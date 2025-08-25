import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiError } from '../utils/ApiError';
import { IUser } from '../models/user.model';
import { ApiResponse } from '../utils/ApiResponse';
import { Transaction } from '../models/transaction.model';

const getOverview = asyncHandler(
  async (req: Request & { user?: IUser }, res) => {
    const userId = req.user?._id;
    if (!userId) {
      throw new ApiError(404, 'User does not exist');
    }
    const totalIncome = await Transaction.aggregate([
      {
        $match: { userId, type: 'income' },
      },
      {
        $group: { _id: null, total: { $sum: '$amount' } },
      },
    ]);
    const totalExpense = await Transaction.aggregate([
      {
        $match: { userId, type: 'expense' },
      },
      {
        $group: { _id: null, total: { $sum: '$amount' } },
      },
    ]);
    // console.log("totalIncome", totalIncome)
    const income = totalIncome[0]?.total || 0;
    const expense = totalExpense[0]?.total || 0;
    const currentBalance = income - expense;
    return res.status(200).json(
      new ApiResponse(200, {
        totalIncome: income,
        totalExpense: expense,
        currentBalance,
      }),
    );
  },
);
const getCategoryBreakdown = asyncHandler(
  async (req: Request & { user?: IUser }, res) => {
    const userId = req.user?._id;
    if (!userId) {
      throw new ApiError(404, 'User does not exist');
    }
    // console.log("userId",userId)
    const { month, year } = req.query;
    const startdate = new Date(`${year}-${month}-01`);
    const endDate = new Date(startdate);
    endDate.setMonth(endDate.getMonth() + 1);

    const date = await Transaction.aggregate([
      {
        $match: {
          userId,
          type: 'expense',
          date: { $gte: startdate, $lt: endDate },
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
      {
        $unwind: '$category',
      },
      {
        $project: {
          categoryId: '$_id',
          categoryName: '$category.name',
          total: 1,
          _id: 0,
        },
      },
    ]);

    return res.status(200).json(new ApiResponse(200, date));
  },
);
const getMonthlySummary = asyncHandler(
  async (req: Request & { user?: IUser }, res) => {
    const userId = req.user?._id;
    if (!userId) {
      throw new ApiError(404, 'User does not exist');
    }
    const { year } = req.query;

    const startdate = new Date(`${year}-01-01`);
    const endDate = new Date(
      `${+(year || new Date().getFullYear()) + 1}-01-01`,
    );

    const data = await Transaction.aggregate([
      {
        $match: {
          userId,
          date: { $gte: startdate, $lt: endDate },
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
    // console.log("Data",data)
    const monthlyData = Array(12)
      .fill(null)
      .map((_, i) => ({
        month: new Date(0, i).toLocaleString('default', { month: 'long' }),
        income: 0,
        expenses: 0,
      }));
    // console.log("monthlyData",monthlyData)
    data.forEach(({ _id, total }) => {
      const monthIndex = _id.month - 1;
      if (_id.type === 'income') {
        monthlyData[monthIndex].income = total;
      } else {
        monthlyData[monthIndex].expenses = total;
      }
    });
    // console.log("monthlyData",monthlyData)

    return res.status(200).json(new ApiResponse(200, monthlyData));
  },
);

export { getOverview, getCategoryBreakdown, getMonthlySummary };
