import { asyncHandler } from '../utils/asyncHandler';
import { ApiError } from '../utils/ApiError';
import { IUser } from '../models/user.model';
import { ApiResponse } from '../utils/ApiResponse';
import { Request } from 'express';
import { Transaction } from '../models/transaction.model';
import { validateRequiredFields } from '../utils/validateRequiredFields';

const transactions = asyncHandler(
  async (req: Request & { user?: IUser }, res) => {
    if (!req.user) {
      throw new ApiError(404, 'User does not exist');
    }
    const userId = req.user._id;
    const transactions = await Transaction.find({ userId }).populate({
      path: 'categoryId',
      select: 'name',
    });
    if (!transactions.length) {
      throw new ApiError(404, 'No transactions found');
    }
    return res.status(200).json(new ApiResponse(200, transactions));
  },
);
const transaction = asyncHandler(
  async (req: Request & { user?: IUser }, res) => {
    if (!req.user) {
      throw new ApiError(404, 'User does not exist');
    }
    const userId = req.user._id;
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      userId,
    });
    if (!transaction) {
      throw new ApiError(404, 'No transactions found');
    }
    return res.status(200).json(new ApiResponse(200, transaction));
  },
);
const addTransactions = asyncHandler(
  async (req: Request & { user?: IUser }, res) => {
    if (!req.user) {
      throw new ApiError(404, 'User does not exist');
    }
    const { amount, type, categoryId, description, date } = req.body;
    validateRequiredFields(req.body, [
      'amount',
      'type',
      'categoryId',
      'description',
      'date',
    ]);

    const userId = req.user._id;
    const transactions = await Transaction.create({
      amount,
      type,
      categoryId,
      description,
      date,
      userId,
    });
    return res.status(200).json(new ApiResponse(200, transactions));
  },
);

const editTransaction = asyncHandler(
  async (req: Request & { user?: IUser }, res) => {
    if (!req.user) {
      throw new ApiError(404, 'User does not exist');
    }
    const userId = req.user._id;
    const { id } = req.params;
    if (!id) {
      throw new ApiError(404, 'Transaction not found');
    }
    const { amount, type, categoryId, description, date } = req.body;
    validateRequiredFields(req.body, [
      'amount',
      'type',
      'categoryId',
      'description',
      'date',
    ]);
    const transaction = await Transaction.findById({ _id: id });
    // console.log("transaction",transaction)
    if (!transaction) {
      throw new ApiError(404, 'Transaction not found');
    }

    Object.assign(transaction, {
      amount,
      type,
      categoryId,
      description,
      date,
    });
    await transaction.save();

    return res.status(200).json(new ApiResponse(200, transaction));
  },
);

const deleteTransaction = asyncHandler(
  async (req: Request & { user?: IUser }, res) => {
    if (!req.user) {
      throw new ApiError(404, 'User does not exist');
    }
    const userId = req.user._id;
    const { id } = req.params;

    const transaction = await Transaction.findOne({ _id: id, userId });
    if (!transaction) {
      throw new ApiError(404, 'Transaction not found');
    }

    await transaction.deleteOne();

    return res
      .status(200)
      .json(
        new ApiResponse(200, { message: 'Transaction deleted successfully' }),
      );
  },
);
const getSpendingOverview = asyncHandler(
  async (req: Request & { user?: IUser }, res) => {
    if (!req.user) {
      throw new ApiError(404, 'User does not exist');
    }

    const userId = req.user._id;
    const { startDate, endDate } = req.query as {
      startDate?: string;
      endDate?: string;
    };

    const dateFilter: any = {};
    if (startDate) {
      const start = new Date(startDate);
      if (isNaN(start.getTime())) {
        throw new ApiError(400, 'Invalid startDate');
      }
      dateFilter.$gte = start;
    }

    if (endDate) {
      const end = new Date(endDate);
      if (isNaN(end.getTime())) {
        throw new ApiError(400, 'Invalid endDate');
      }
      dateFilter.$lte = end;
    }

    const matchCondition: any = {
      userId,
      type: 'expense',
    };

    if (Object.keys(dateFilter).length > 0) {
      matchCondition.date = dateFilter;
    }

    const monthlyAggregation = await Transaction.aggregate([
      { $match: matchCondition },
      {
        $group: {
          _id: {
            year: { $year: '$date' },
            month: { $month: '$date' },
          },
          totalAmount: { $sum: '$amount' },
        },
      },
      {
        $sort: {
          '_id.year': 1,
          '_id.month': 1,
        },
      },
    ]);
    // console.log("monthlyAggregation",monthlyAggregation)

    const monthLabels = monthlyAggregation.map(
      (m) => `${m._id.year}-${m._id.month.toString().padStart(2, '0')}`,
    );
    const monthlyExpenses = {
      labels: monthLabels,
      values: monthlyAggregation.map((m) => m.totalAmount),
    };

    const categoryAggregation = await Transaction.aggregate([
      { $match: matchCondition },
      {
        $group: {
          _id: '$categoryId',
          totalAmount: { $sum: '$amount' },
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
      { $sort: { totalAmount: -1 } },
    ]);

    const categoryExpenses = {
      categories: categoryAggregation.map((c) => c.category.name),
      values: categoryAggregation.map((c) => c.totalAmount),
    };
    // console.log("categoryExpenses",categoryExpenses)

    const categoryTrendAggregation = await Transaction.aggregate([
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
    // console.log("allLabelsSet",allLabelsSet)

    for (const record of categoryTrendAggregation) {
      const label = `${record.year}-${record.month.toString().padStart(2, '0')}`;
      allLabelsSet.add(label);
    }

    const allLabels = Array.from(allLabelsSet).sort();
    // console.log("allLabels",allLabels)
    const trendMap: Record<string, Record<string, number>> = {};
    for (const record of categoryTrendAggregation) {
      const category = record.categoryName;
      const label = `${record.year}-${record.month.toString().padStart(2, '0')}`;
      if (!trendMap[category]) trendMap[category] = {};
      trendMap[category][label] = record.totalAmount;
    }
    // console.log("trendMap",trendMap)

    for (const category of Object.keys(trendMap)) {
      categoryTrends[category] = allLabels.map(
        (label) => trendMap[category][label] || 0,
      );
    }

    return res.status(200).json(
      new ApiResponse(200, {
        monthlyExpenses,
        categoryExpenses,
        categoryTrends,
        labels: allLabels,
      }),
    );
  },
);

export {
  transactions,
  transaction,
  addTransactions,
  editTransaction,
  deleteTransaction,
  getSpendingOverview,
};
