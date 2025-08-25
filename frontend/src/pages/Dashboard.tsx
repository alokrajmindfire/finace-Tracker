import React from 'react'
import { StatsCards } from '@/components/dashboard/StatsCards'
import { useDashboardOverview } from '@/lib/queries'
import { Skeleton } from '@/components/ui/skeleton'
import { CategoryBreakdown } from '@/components/dashboard/CategoryBreakdown'
import { MonthlyChart } from '@/components/dashboard/MonthlyChart'
import ExpenseChart from '@/components/dashboard/ExpenseChart'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export const Dashboard: React.FC = () => {
  const { data: stats, isLoading: statsLoading, isError } = useDashboardOverview()
  // console.log("stats", stats)

  return (
    <div className="space-y-6 pb-20 md:pb-6">
      {statsLoading ? (
        <Skeleton className="h-80" />
      ) : isError || !stats || !stats.success ? (
        <Card className="h-full">
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent className="max-w-md">
            <p className="text-red-600">Failed to load Overview.</p>
          </CardContent>
        </Card>
      ) : (
        <StatsCards stats={stats.data} />
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        <CategoryBreakdown />
        <MonthlyChart />
      </div>
      <ExpenseChart />
    </div>
  )
}

export default Dashboard
