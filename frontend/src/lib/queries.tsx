import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { categoryApi, transactionApi } from "./api";
import type { Transaction } from "@/types/transaction";
import type { Category } from "@/types";

export const useTransactions = () =>{
  return useQuery({ 
    queryKey: ['transactions'],
    queryFn:() => transactionApi.transaction(),  
    })
};
export const useUpdateTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Transaction> }) =>
      transactionApi.updateTransaction(id, data),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },

    onError: (error) => {
      console.error("Failed to update transaction", error);
    },
  });
};

export const useCreateTransaction = () => {
    const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ data }: { data: Partial<Transaction> }) =>
      transactionApi.create(data),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },

    onError: (error) => {
      console.error("Failed to update transaction", error);
    },
  });
};

export const useDeleteTransaction = () => {
    const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id }: { id: string }) =>
      transactionApi.delete(id),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },

    onError: (error) => {
      console.error("Failed to update transaction", error);
    },
  });
};

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryApi.list(),
  });
};
export const useCreateCategory = () => {
    const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ data }: { data: Partial<Category> }) =>
      categoryApi.create(data),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },

    onError: (error) => {
      console.error("Failed to update transaction", error);
    },
  });
};