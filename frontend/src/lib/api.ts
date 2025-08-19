import type { Category, CategoryItem, DashboardStats, ExpenseTrendsChart, MonthlyChart, User } from "@/types";
import api, { setAuthToken } from "./axios";
import type { Transaction } from "@/types/transaction";
import { handleApi } from "./apiWrapper";

export const authApi = {
  login: async (email: string, password: string): Promise<User> => {
    const { data } = await api.post("/auth/login", { email, password });
    console.log("data", data)
    const { accessToken, user } = data?.data;

    localStorage.setItem("token", accessToken);
    setAuthToken(accessToken);

    return user;
  },

  register: async (email: string, password: string, fullName: string): Promise<User> => {
    const { data } = await api.post("/auth/register", { email, password, fullName });
    const { accessToken, user } = data.data;

    localStorage.setItem("token", accessToken);
    setAuthToken(accessToken);

    return user;
  },

  logout: async (): Promise<void> => {
    await api.post("/auth/logout");
    localStorage.removeItem("token");
    setAuthToken(null);
  },
};

export const transactionApi = {
  transaction: () => handleApi<Transaction[]>(() => api.get("/transaction")),
  updateTransaction: (id: string, payload: Partial<Transaction>) =>
    handleApi<Transaction>(() => api.put(`/transaction/${id}`, payload)),
  create: (payload: Partial<Transaction>) =>
    handleApi<Transaction>(() => api.post(`/transaction`, payload)),
  delete: (id:string) =>
    handleApi<Transaction>(() => api.delete(`/transaction/${id}`)),
};

export const categoryApi = {
  list: () => handleApi<CategoryItem[]>(() => api.get('/category')), 
  create: (payload: Partial<Category>) =>
    handleApi<Category>(() => api.post('/category', payload)),
};

export const dashboardApi = {
  getStats: () => handleApi<DashboardStats>(() => api.get('/dashboard/overview')),
  categoryBreakdown: (month:string, year:string) => handleApi<{categoryId:string, categoryName: string; total: number }[]>(() => api.get(`/dashboard/category-breakdown?month=${month}&year=${year}`)),
  monthlySummary: (year:string) => handleApi<MonthlyChart[]>(() => api.get(`/dashboard/monthly-summary?year=${year}`)),
  spendingOverview: () => handleApi<ExpenseTrendsChart>(() => api.get(`/transaction/spending-overview`))
}