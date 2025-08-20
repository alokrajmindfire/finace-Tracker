import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useDeleteTransaction, useTransactions } from '@/lib/queries'
import type { Transaction } from '@/types/transaction'
import { Button } from '@/components/ui/button'
import { Edit, Plus, Trash2 } from 'lucide-react'
import { TransactionForm } from '@/components/transaction/TransactionForm'

const Transactions = () => {
  const { data, isLoading, isError } = useTransactions()

  const deleteMutation = useDeleteTransaction();
  // console.log(data)

  if (isLoading) return <div>Loading...</div>;


  return (
    <>
      <div className="flex justify-end mb-6">

        <TransactionForm>
          <Button
            size="sm"
            variant="outline"
            className="p-0 flex justify-center items-center"
          ><Plus className="h-3 w-3" /> Add Transactions
          </Button>
        </TransactionForm>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Type</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Category</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {(isError || !data || !data.success) ?
            <TableRow>
              <TableCell className="text-red-500" >
                {data && 'message' in data ? data.message : 'Failed to load transactions'}
              </TableCell>
            </TableRow>
            : data.data.map((item: Transaction) => (
              <TableRow key={item._id}>
                <TableCell className="font-medium">{item?.type?.charAt(0)?.toUpperCase() + item?.type?.slice(1)}</TableCell>
                <TableCell>${item.amount}</TableCell>
                <TableCell>{item.description}</TableCell>
                <TableCell>{typeof item?.categoryId != 'string' ? item.categoryId?.name : ''}</TableCell>
                <TableCell className="text-right">
                  <TransactionForm data={item}>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0"
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                  </TransactionForm>
                  <div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => deleteMutation.mutate({ id: item._id })}
                      disabled={deleteMutation.isPending}
                      className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div></TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </>
  )
}

export default Transactions
