
export interface Category {
  name: string;
}
export interface CategoryItem extends Category{
  _id: string;
}

export interface User {
  id: string;
  email: string;
  fullName: string;
}

export interface DashboardStats {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  monthlyIncome: number;
  monthlyExpenses: number;
}