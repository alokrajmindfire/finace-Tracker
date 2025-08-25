import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/ApiResponse';
import { ApiError } from '../utils/ApiError';
import { IUser } from '../models/user.model';
import { OverviewService } from '../services/dashboard.service';
import { Types } from 'mongoose';

const service = new OverviewService();

export const getOverview = asyncHandler(
  async (req: Request & { user?: IUser }, res: Response) => {
    if (!req.user) throw new ApiError(404, 'User does not exist');
    const data = await service.getOverview(req.user._id as Types.ObjectId);
    res.status(200).json(new ApiResponse(200, data));
  },
);

export const getCategoryBreakdown = asyncHandler(
  async (req: Request & { user?: IUser }, res: Response) => {
    if (!req.user) throw new ApiError(404, 'User does not exist');
    const { month, year } = req.query as { month: string; year: string };
    const data = await service.getCategoryBreakdown(
      req.user._id as Types.ObjectId,
      month,
      year,
    );
    res.status(200).json(new ApiResponse(200, data));
  },
);

export const getMonthlySummary = asyncHandler(
  async (req: Request & { user?: IUser }, res: Response) => {
    if (!req.user) throw new ApiError(404, 'User does not exist');
    const { year } = req.query as { year: string };
    const data = await service.getMonthlySummary(
      req.user._id as Types.ObjectId,
      year,
    );
    res.status(200).json(new ApiResponse(200, data));
  },
);
