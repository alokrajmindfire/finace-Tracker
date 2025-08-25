import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useMonthlySummary } from '@/lib/queries'
import { Skeleton } from '../ui/skeleton'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { useState } from 'react'

function YearSelector({ year, setYear }: { year: string; setYear: (y: string) => void }) {
  return (
    <div className="flex items-center space-x-6">
      <div className="flex gap-2">
        <Label htmlFor="year">Year: </Label>
        <Input
          id="year"
          type="number"
          min={2000}
          max={2100}
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="w-24"
        />
      </div>
    </div>
  )
}

export const MonthlyChart: React.FC = () => {
  const [year, setYear] = useState(String(new Date().getFullYear()))
  const { data: monthlySummary, isLoading, isError } = useMonthlySummary(year)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Summary</CardTitle>
        <YearSelector year={year} setYear={setYear} />
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-72">
            <Skeleton className="h-6 w-3/4 mb-4" />
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-4 mb-2" />
            ))}
          </div>
        ) : isError || !monthlySummary?.success ? (
          <p className="text-red-600">Failed to load category breakdown.</p>
        ) : (
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlySummary.data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(value) => `$${value.toLocaleString()}`} />
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
        )}
      </CardContent>
    </Card>
  )
}
