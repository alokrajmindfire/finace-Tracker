import { ApiError } from '../utils/ApiError';
import { TransactionRepository } from '../repositories/transaction.repository';
import { Types } from 'mongoose';
import { validateRequiredFields } from '../utils/validateRequiredFields';

export class TransactionService {
  private repo: TransactionRepository;

  constructor() {
    this.repo = new TransactionRepository();
  }

  async getAll(userId: Types.ObjectId) {
    const transactions = await this.repo.findAllByUser(userId);
    if (!transactions.length) throw new ApiError(404, 'No transactions found');
    return transactions;
  }

  async getOne(userId: Types.ObjectId, id: string) {
    const transaction = await this.repo.findOneById(id, userId);
    if (!transaction) throw new ApiError(404, 'Transaction not found');
    return transaction;
  }

  async add(userId: Types.ObjectId, body: any) {
    validateRequiredFields(body, [
      'amount',
      'type',
      'categoryId',
      'description',
      'date',
    ]);
    return this.repo.create({ ...body, userId });
  }

  async edit(userId: Types.ObjectId, id: string, body: any) {
    validateRequiredFields(body, [
      'amount',
      'type',
      'categoryId',
      'description',
      'date',
    ]);
    const transaction = await this.repo.findOneById(id, userId);
    if (!transaction) throw new ApiError(404, 'Transaction not found');
    return this.repo.update(id, body);
  }

  async delete(userId: Types.ObjectId, id: string) {
    const deleted = await this.repo.delete(id, userId);
    if (!deleted) throw new ApiError(404, 'Transaction not found');
    return { message: 'Transaction deleted successfully' };
  }

  async getSpendingOverview(
    userId: Types.ObjectId,
    startDate?: string,
    endDate?: string,
  ) {
    const dateFilter: any = {};
    if (startDate) {
      const start = new Date(startDate);
      if (isNaN(start.getTime())) throw new ApiError(400, 'Invalid startDate');
      dateFilter.$gte = start;
    }
    if (endDate) {
      const end = new Date(endDate);
      if (isNaN(end.getTime())) throw new ApiError(400, 'Invalid endDate');
      dateFilter.$lte = end;
    }

    const matchCondition: any = { userId, type: 'expense' };
    if (Object.keys(dateFilter).length) matchCondition.date = dateFilter;

    // Monthly aggregation
    const monthlyAggregation = await this.repo.aggregate([
      { $match: matchCondition },
      {
        $group: {
          _id: { year: { $year: '$date' }, month: { $month: '$date' } },
          totalAmount: { $sum: '$amount' },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);
    const monthLabels = monthlyAggregation.map(
      (m) => `${m._id.year}-${m._id.month.toString().padStart(2, '0')}`,
    );
    const monthlyExpenses = {
      labels: monthLabels,
      values: monthlyAggregation.map((m) => m.totalAmount),
    };

    // Category aggregation
    const categoryAggregation = await this.repo.aggregate([
      { $match: matchCondition },
      { $group: { _id: '$categoryId', totalAmount: { $sum: '$amount' } } },
      {
        $lookup: {
          from: 'categories',
          localField: '_id',
          foreignField: '_id',
          as: 'category',
        },
      },
      { $unwind: '$category' },
      { $sort: { totalAmount: -1 } },
    ]);
    const categoryExpenses = {
      categories: categoryAggregation.map((c) => c.category.name),
      values: categoryAggregation.map((c) => c.totalAmount),
    };

    // Category trends
    const categoryTrendAggregation = await this.repo.aggregate([
      { $match: matchCondition },
      {
        $group: {
          _id: {
            categoryId: '$categoryId',
            year: { $year: '$date' },
            month: { $month: '$date' },
          },
          totalAmount: { $sum: '$amount' },
        },
      },
      {
        $lookup: {
          from: 'categories',
          localField: '_id.categoryId',
          foreignField: '_id',
          as: 'category',
        },
      },
      { $unwind: '$category' },
      {
        $project: {
          year: '$_id.year',
          month: '$_id.month',
          categoryName: '$category.name',
          totalAmount: 1,
          _id: 0,
        },
      },
      { $sort: { year: 1, month: 1 } },
    ]);

    const categoryTrends: Record<string, number[]> = {};
    const allLabelsSet = new Set(monthLabels);
    for (const record of categoryTrendAggregation) {
      const label = `${record.year}-${record.month.toString().padStart(2, '0')}`;
      allLabelsSet.add(label);
    }
    const allLabels = Array.from(allLabelsSet).sort();
    const trendMap: Record<string, Record<string, number>> = {};
    for (const record of categoryTrendAggregation) {
      const category = record.categoryName;
      const label = `${record.year}-${record.month.toString().padStart(2, '0')}`;
      if (!trendMap[category]) trendMap[category] = {};
      trendMap[category][label] = record.totalAmount;
    }
    for (const category of Object.keys(trendMap)) {
      categoryTrends[category] = allLabels.map(
        (label) => trendMap[category][label] || 0,
      );
    }

    return {
      monthlyExpenses,
      categoryExpenses,
      categoryTrends,
      labels: allLabels,
    };
  }
}
