import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/ApiResponse';
import { ApiError } from '../utils/ApiError';
import { Request, Response } from 'express';
import { IUser } from '../models/user.model';
import { TransactionService } from '../services/transaction.service';
import { Types } from 'mongoose';

const service = new TransactionService();

export const transactions = asyncHandler(
  async (req: Request & { user?: IUser }, res: Response) => {
    if (!req.user) throw new ApiError(404, 'User does not exist');
    const data = await service.getAll(req.user._id as Types.ObjectId);
    res.status(200).json(new ApiResponse(200, data));
  },
);

export const transaction = asyncHandler(
  async (req: Request & { user?: IUser }, res: Response) => {
    if (!req.user) throw new ApiError(404, 'User does not exist');
    const data = await service.getOne(
      req.user._id as Types.ObjectId,
      req.params.id,
    );
    res.status(200).json(new ApiResponse(200, data));
  },
);

export const addTransactions = asyncHandler(
  async (req: Request & { user?: IUser }, res: Response) => {
    if (!req.user) throw new ApiError(404, 'User does not exist');
    const data = await service.add(req.user._id as Types.ObjectId, req.body);
    res.status(200).json(new ApiResponse(200, data));
  },
);

export const editTransaction = asyncHandler(
  async (req: Request & { user?: IUser }, res: Response) => {
    if (!req.user) throw new ApiError(404, 'User does not exist');
    const data = await service.edit(
      req.user._id as Types.ObjectId,
      req.params.id,
      req.body,
    );
    res.status(200).json(new ApiResponse(200, data));
  },
);

export const deleteTransaction = asyncHandler(
  async (req: Request & { user?: IUser }, res: Response) => {
    if (!req.user) throw new ApiError(404, 'User does not exist');
    const data = await service.delete(
      req.user._id as Types.ObjectId,
      req.params.id,
    );
    res.status(200).json(new ApiResponse(200, data));
  },
);

export const getSpendingOverview = asyncHandler(
  async (req: Request & { user?: IUser }, res: Response) => {
    if (!req.user) throw new ApiError(404, 'User does not exist');
    const { startDate, endDate } = req.query as {
      startDate?: string;
      endDate?: string;
    };
    const data = await service.getSpendingOverview(
      req.user._id as Types.ObjectId,
      startDate,
      endDate,
    );
    res.status(200).json(new ApiResponse(200, data));
  },
);
