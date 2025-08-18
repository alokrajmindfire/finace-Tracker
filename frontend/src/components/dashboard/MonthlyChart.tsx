import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { useMonthlySummary } from '@/lib/queries';
import { Skeleton } from '../ui/skeleton';



export const MonthlyChart: React.FC = () => {
  const { data: monthlySummary, isLoading, isError } = useMonthlySummary(String(new Date().getFullYear()));
   if (isLoading) {
        return (
            <div className="max-w-md">
                <CardHeader>
                    <CardTitle>Monthly Summary</CardTitle>
                </CardHeader>
                <>
                    <Skeleton className="h-6 w-3/4 mb-4" />
                    {[...Array(5)].map((_, i) => (
                        <Skeleton key={i} className="h-4 mb-2" />
                    ))}
                </>
            </div>
        );
    }

    if (isError || !monthlySummary?.success) {
        return (
            <div className="max-w-md">
                <CardHeader>
                    <CardTitle>Monthly Summary</CardTitle>
                </CardHeader>
                    <p className="text-red-600">Failed to load category breakdown.</p>
            </div>
        );
    }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlySummary.data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis 
                tickFormatter={(value) => `$${value.toLocaleString()}`}
              />
              <Tooltip 
                formatter={(value: number) => [
                  new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                  }).format(value),
                ]}
              />
              <Legend />
              <Bar dataKey="income" fill="#10b981" name="Income" />
              <Bar dataKey="expenses" fill="#ef4444" name="Expenses" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
