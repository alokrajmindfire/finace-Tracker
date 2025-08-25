// src/validations/category.validation.ts
import { z } from 'zod';

export const addCategorySchema = z.object({
  name: z.string().min(1, 'Category name is required'),
});
