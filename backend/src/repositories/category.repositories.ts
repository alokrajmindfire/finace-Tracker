import { Category } from '../models/category.model';

export class CategoryRepository {
  static async findByUserId(userId: string) {
    return Category.find({ userId });
  }

  static async createCategory(data: { name: string; userId: string }) {
    return Category.create(data);
  }
}
