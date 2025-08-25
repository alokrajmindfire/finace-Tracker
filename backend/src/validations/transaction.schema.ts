import { z } from 'zod';

export const addTransactionSchema = z.object({
  body: z.object({
    amount: z.number().positive('Amount must be greater than 0'),
    type: z.enum(['income', 'expense']),
    categoryId: z.string().min(1, 'Category is required'),
    description: z.string().min(1, 'Description is required'),
    date: z.string().refine((val) => !isNaN(Date.parse(val)), {
      message: 'Invalid date format',
    }),
  }),
});

export const editTransactionSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Transaction ID is required'),
  }),
  body: z.object({
    amount: z.number().positive('Amount must be greater than 0'),
    type: z.enum(['income', 'expense']),
    categoryId: z.string().min(1, 'Category is required'),
    description: z.string().min(1, 'Description is required'),
    date: z.string().refine((val) => !isNaN(Date.parse(val)), {
      message: 'Invalid date format',
    }),
  }),
});

export const deleteTransactionSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Transaction ID is required'),
  }),
});

export const getTransactionSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Transaction ID is required'),
  }),
});
