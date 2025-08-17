import { useForm } from 'react-hook-form';
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useCreateCategory } from '@/lib/queries';
import type { Category } from '@/types';

interface FormData {
  name: string;
}

interface Props {
  data?: Category;
  onClose?: () => void;
}

export function CategoryForm({ data, onClose }: Props) {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      name: data?.name || '',
    },
  });

  const { mutate: createCategory, isPending: isCreatePending } = useCreateCategory();

  const onSubmit = (formData: FormData) => {
    const categoryData = { name: formData.name };

      createCategory({ data: categoryData }, { onSuccess: onClose });
  };

  return (
    <DialogContent className="sm:max-w-[425px]">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <DialogHeader>
          <DialogTitle>{'Add New Category'}</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            type="text"
            {...register('name', { required: 'Name is required' })}
            className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.name && <span className="text-red-500">{errors.name.message}</span>}
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" type="button">
              Cancel
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button
              type="submit"
              disabled={isCreatePending}
              className="bg-blue-600 text-white hover:bg-blue-700"
            >
              {isCreatePending? 'Saving...' : 'Save Category'}
            </Button>
          </DialogClose>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
