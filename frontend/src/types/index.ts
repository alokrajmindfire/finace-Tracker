export interface Category {
  name: string
}
export interface CategoryItem extends Category {
  _id: string
}

export interface User {
  id: string
  email: string
  fullName: string
}

export interface DashboardStats {
  currentBalance: number
  totalExpense: number
  totalIncome: number
}
export interface MonthlyChart {
  month: string
  income: number
  expenses: number
}
export interface ExpenseTrendsChart {
  monthlyExpenses: { labels: string[]; values: number[] }
  categoryExpenses: { categories: string[]; values: number[] }
  categoryTrends: Record<string, number[]>
  labels: string[]
}
