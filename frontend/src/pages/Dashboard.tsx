import React from 'react'
import { StatsCards } from '@/components/dashboard/StatsCards';
import { useDashboardOverview } from '@/lib/queries';
import { Skeleton } from '@/components/ui/skeleton';
import { CategoryBreakdown } from '@/components/dashboard/CategoryBreakdown';
import { MonthlyChart } from '@/components/dashboard/MonthlyChart';
import ExpenseChart from '@/components/dashboard/ExpenseChart';

export const Dashboard: React.FC = () => {
  const { data: stats, isLoading: statsLoading, isError } = useDashboardOverview()
  // console.log("stats", stats)

  return (
    <div className="space-y-6 pb-20 md:pb-6">
      {statsLoading ? <Skeleton className="h-80" /> : (isError || !stats || !stats.success) ?
        <p className="text-gray-600">Overview not found</p> :
        <StatsCards stats={stats.data} />
      }
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6'>
        <CategoryBreakdown />
        <MonthlyChart />
      </div>
      <ExpenseChart />

    </div>
  );
};

export default Dashboard
