import { useForm, Controller } from 'react-hook-form';
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogTrigger,
  Dialog
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem
} from '@/components/ui/select';
import { useUpdateTransaction, useCreateTransaction, useCategories } from '@/lib/queries';
import type { Transaction } from '@/types/transaction';
import { useState, type ReactElement } from 'react';

interface FormData {
  type: 'income' | 'expense';
  amount: number;
  description: string;
  categoryId: string;
  date: string;
}

interface Props {
  data?: Transaction | null;
  children: ReactElement
}

export const TransactionForm = ({ data, children }: Props) => {
  const isEdit = Boolean(data);
  const [isOpen, setIsOpen] = useState(false)

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      type: data?.type ?? 'expense',
      amount: data?.amount ?? 0,
      description: data?.description ?? '',
      categoryId: typeof data?.categoryId != 'string' ? data?.categoryId?._id : '',
      date: data?.date ? new Date(data.date).toISOString().slice(0, 10) : undefined,
    },
  });
  // console.log("data", data)

  const { mutate: updateTransaction, isPending: isUpdatePending } = useUpdateTransaction();
  const { mutate: createTransaction, isPending: isCreatePending } = useCreateTransaction();

  const { data: categoriesData, isLoading: isCategoriesLoading, isError: isCategoriesError } = useCategories();

  const onSubmit = (formData: FormData) => {
    const transactionData = {
      amount: formData.amount,
      description: formData.description,
      type: formData.type,
      categoryId: formData.categoryId,
      date: formData.date,
    };

    if (isEdit && data) {
      updateTransaction(
        { id: data._id, data: transactionData },
        { onSuccess: () => onClose?.() }
      );
    } else {
      createTransaction({ data: transactionData }, { onSuccess: () => onClose?.() });
    }
  };
  const onClose = () => setIsOpen(false)
  const onOpenChange = () => setIsOpen(!isOpen)

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
          <DialogHeader>
            <DialogTitle>{isEdit ? 'Edit Transaction' : 'Add New Transaction'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-3">
            <Label htmlFor="type">Type{data?._id}</Label>
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Type</SelectLabel>
                      <SelectItem value="income">Income</SelectItem>
                      <SelectItem value="expense">Expense</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="grid gap-3">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              {...register('amount', { required: 'Amount is required' })}
            />
            {errors.amount && <span className="text-red-500">{errors.amount.message}</span>}
          </div>

          <div className="grid gap-3">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              {...register('description', { required: 'Description is required' })}
            />
            {errors.description && <span className="text-red-500">{errors.description.message}</span>}
          </div>

          <div className="grid gap-3">
            <Label htmlFor="categoryId">Category</Label>
            <Controller
              name="categoryId"
              control={control}
              rules={{ required: 'Category is required' }}
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={isCategoriesLoading || isCategoriesError}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Categories</SelectLabel>
                      {categoriesData?.success && categoriesData.data?.length > 0 ? (
                        categoriesData.data.map((category) => (
                          <SelectItem key={category._id} value={category._id}>
                            {category.name}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value='' disabled={true}>No categories available</SelectItem>
                      )}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.categoryId && <span className="text-red-500">{errors.categoryId.message}</span>}
          </div>

          <div className="grid gap-3">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              {...register('date', { required: 'Date is required' })}
            />
            {errors.date && <span className="text-red-500">{errors.date.message}</span>}
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" type="button">Cancel</Button>
            </DialogClose>
            {/* <DialogClose asChild > */}
            <Button type="submit" disabled={isUpdatePending || isCreatePending}>
              {isUpdatePending || isCreatePending ? 'Saving...' : isEdit ? 'Save Changes' : 'Save Transaction'}
            </Button>
            {/* </DialogClose> */}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
