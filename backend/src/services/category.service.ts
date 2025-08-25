// src/services/category.service.ts
import { CategoryRepository } from '../repositories/category.repositories';
import { ApiError } from '../utils/ApiError';

export class CategoryService {
  static async getCategories(userId: string) {
    const categories = await CategoryRepository.findByUserId(userId);

    if (!categories.length) {
      throw new ApiError(404, 'No categories found');
    }

    return categories;
  }

  static async addCategory(userId: string, name: string) {
    if (!name || name.trim() === '') {
      throw new ApiError(400, 'Category name is required');
    }

    const category = await CategoryRepository.createCategory({ name, userId });
    return category;
  }
}
