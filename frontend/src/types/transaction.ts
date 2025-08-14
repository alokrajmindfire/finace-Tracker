export interface Transaction {
  _id: string;
  amount: number;
  type: 'income' | 'expense';
  categoryId: {
    _id: string,
    name: string
  };
  description: string;
  date: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}