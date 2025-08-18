import { useCategoryBreakdown } from '@/lib/queries';
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

function DateSelector({
    month,
    year,
    setMonth,
    setYear,
}: {
    month: string;
    year: string;
    setMonth: (m: string) => void;
    setYear: (y: string) => void;
}) {
    return (
        <div className="flex items-center space-x-6">
            <div className="flex gap-2">
                <Label htmlFor="month" >Month:</Label>
                <Select
                    value={month}
                    onValueChange={(value) => setMonth(value)}
                >
                    <SelectTrigger className="w-24">
                        <SelectValue placeholder="Select month" />
                    </SelectTrigger>
                    <SelectContent>
                        {[...Array(12).keys()].map((m) => {
                            const val = (m + 1).toString().padStart(2, '0');
                            return (
                                <SelectItem key={val} value={val}>
                                    {val}
                                </SelectItem>
                            );
                        })}
                    </SelectContent>
                </Select>
            </div>

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
    );
}

export const CategoryBreakdown: React.FC = () => {
    const [month, setMonth] = useState((new Date().getMonth() + 1).toString().padStart(2, '0'));
    const [year, setYear] = useState(String(new Date().getFullYear()));
    // console.log("new Date().getMonth()", new Date().getMonth())
    return (
        <div>
            <Card >
                <CardHeader>
                    <CardTitle className="text-lg font-bold text-gray-800">
                        Category Breakdown for {month}/{year}
                    </CardTitle>
                <DateSelector month={month} year={year} setMonth={setMonth} setYear={setYear} />
                </CardHeader>
                <CardContent>
                <CategoryBreakdownHelper month={month} year={year} />
                </CardContent>
            </Card>
        </div>
    );
};


function CategoryBreakdownHelper({ month, year }: { month: string; year: string }) {
    const { data, isLoading, isError } = useCategoryBreakdown(month, year);

    if (isLoading) {
        return (
            <div className="max-w-md">
                <CardHeader>
                    <CardTitle>Category Breakdown</CardTitle>
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
                    <CardTitle>Category Breakdown</CardTitle>
                </CardHeader>
                    <p className="text-red-600">Failed to load category breakdown.</p>
            </div>
        );
    }

    const breakdown = data.data;

    console.log("breakdown", breakdown)

    return (
        <div>
            {breakdown.length === 0 ? (
                <p className="text-gray-600">No expenses found for this period.</p>
            ) : (
                <ul className="space-y-3">
                    {breakdown.map(({ categoryId, categoryName, total }) => (
                        <li key={categoryId} className="flex justify-between items-center">
                            <span className="font-medium text-gray-700">{categoryName}</span>
                            <span className="text-sm font-semibold text-gray-900">
                                ${total.toFixed(2)}
                            </span>
                        </li>
                    ))}
                </ul>
            )}

        </div>
    );
}
