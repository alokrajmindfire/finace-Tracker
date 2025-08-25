import { ApiError } from '../utils/ApiError';
import { TransactionRepository } from '../repositories/transaction.repository';
import { Types } from 'mongoose';

export class OverviewService {
  private repo: TransactionRepository;

  constructor() {
    this.repo = new TransactionRepository();
  }

  async getOverview(userId: Types.ObjectId) {
    if (!userId) throw new ApiError(404, 'User does not exist');

    const totalIncome = await this.repo.aggregate([
      { $match: { userId, type: 'income' } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);

    const totalExpense = await this.repo.aggregate([
      { $match: { userId, type: 'expense' } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);

    const income = totalIncome[0]?.total || 0;
    const expense = totalExpense[0]?.total || 0;
    const currentBalance = income - expense;

    return { totalIncome: income, totalExpense: expense, currentBalance };
  }

  async getCategoryBreakdown(
    userId: Types.ObjectId,
    month: string,
    year: string,
  ) {
    if (!userId) throw new ApiError(404, 'User does not exist');

    const startDate = new Date(`${year}-${month}-01`);
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 1);

    return this.repo.aggregate([
      {
        $match: {
          userId,
          type: 'expense',
          date: { $gte: startDate, $lt: endDate },
        },
      },
      {
        $group: {
          _id: '$categoryId',
          total: { $sum: '$amount' },
        },
      },
      {
        $lookup: {
          from: 'categories',
          localField: '_id',
          foreignField: '_id',
          as: 'category',
        },
      },
      { $unwind: '$category' },
      {
        $project: {
          categoryId: '$_id',
          categoryName: '$category.name',
          total: 1,
          _id: 0,
        },
      },
    ]);
  }

  async getMonthlySummary(userId: Types.ObjectId, year: string) {
    if (!userId) throw new ApiError(404, 'User does not exist');

    const startDate = new Date(`${year}-01-01`);
    const endDate = new Date(`${+year + 1}-01-01`);

    const data = await this.repo.aggregate([
      {
        $match: {
          userId,
          date: { $gte: startDate, $lt: endDate },
        },
      },
      {
        $group: {
          _id: {
            month: { $month: '$date' },
            type: '$type',
          },
          total: { $sum: '$amount' },
        },
      },
    ]);

    const monthlyData = Array(12)
      .fill(null)
      .map((_, i) => ({
        month: new Date(0, i).toLocaleString('default', { month: 'long' }),
        income: 0,
        expenses: 0,
      }));

    data.forEach(({ _id, total }) => {
      const monthIndex = _id.month - 1;
      if (_id.type === 'income') {
        monthlyData[monthIndex].income = total;
      } else {
        monthlyData[monthIndex].expenses = total;
      }
    });

    return monthlyData;
  }
}
