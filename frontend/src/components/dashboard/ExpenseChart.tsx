import {
  Card,
  CardHeader,
  CardTitle,
  CardContent
} from '@/components/ui/card';
import { useExpenseTrends } from '@/lib/queries';
import {
  ResponsiveContainer,
  LineChart,
  BarChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Skeleton } from '../ui/skeleton';
import type { ExpenseTrendsChart } from '@/types';

interface ExpenseTrendsChartProps {
  data: ExpenseTrendsChart;
}

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

const ExpenseTrendsChartComponent: React.FC<ExpenseTrendsChartProps> = ( {data} ) => {
  const { monthlyExpenses, categoryExpenses, categoryTrends, labels } = data;
  const monthlyData = labels.map((label: any, i: number) => ({
    month: label,
    expenses: monthlyExpenses.values[i] ?? 0
  }));

  const trendData = labels.map((label: any, idx: number) => {
    const entry: any = { month: label };
    Object.keys(categoryTrends).forEach(cat => {
      entry[cat] = categoryTrends[cat][idx] ?? 0;
    });
    return entry;
  });

  const pieData = categoryExpenses.categories.map((cat, i) => ({
    name: cat,
    value: categoryExpenses.values[i] ?? 0
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="col-span-1 lg:col-span-2">
        <CardHeader>
          <CardTitle>Monthly Expenses</CardTitle>
        </CardHeader>
        <CardContent className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="expenses" fill="#ef4444" name="Expenses" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Category Distribution</CardTitle>
        </CardHeader>
        <CardContent className="h-72 flex justify-center items-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {pieData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="col-span-1 lg:col-span-3">
        <CardHeader>
          <CardTitle>Category Trends Over Time</CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              {Object.keys(categoryTrends).map((cat, i) => (
                <Line
                  key={cat}
                  type="monotone"
                  dataKey={cat}
                  stroke={COLORS[i % COLORS.length]}
                  strokeWidth={2}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export const ExpenseChart = () => {
  const { data, isLoading, isError } = useExpenseTrends();
  // console.log("ExpenseTrends",data)
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

    if (isError || !data?.success) {
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
    <div>
      <ExpenseTrendsChartComponent data={data.data} />
    </div>
  )
}

export default ExpenseChart
