import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/ApiResponse';
import { ApiError } from '../utils/ApiError';
import { IUser } from '../models/user.model';
import { CategoryService } from '../services/category.service';
import { addCategorySchema } from '../validations/category.validation';

const categories = asyncHandler(
  async (req: Request & { user?: IUser }, res: Response) => {
    const user = req.user;

    if (!user) {
      throw new ApiError(404, 'User does not exist');
    }

    const result = await CategoryService.getCategories(user._id as string);

    return res
      .status(200)
      .json(new ApiResponse(200, result, 'Categories fetched successfully'));
  },
);

const addCategories = asyncHandler(
  async (req: Request & { user?: IUser }, res: Response) => {
    const user = req.user;

    if (!user) {
      throw new ApiError(404, 'User does not exist');
    }

    const parsedData = addCategorySchema.parse(req.body);

    const category = await CategoryService.addCategory(
      user._id as string,
      parsedData.name,
    );

    return res
      .status(200)
      .json(new ApiResponse(200, category, 'Category created successfully'));
  },
);

export { categories, addCategories };
