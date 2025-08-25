import { useState } from 'react'
import { useCategories } from '@/lib/queries'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import { CategoryForm } from '@/components/category/CategoryForm'

const CategoryPage = () => {
  const { data, isLoading, isError } = useCategories()
  const [isOpen, setIsOpen] = useState(false)

  if (isLoading) return <div>Loading...</div>

  const closeDialog = () => setIsOpen(false)
  const onOpenChange = () => setIsOpen(!isOpen)
  return (
    <>
      <div className="flex justify-end mb-6">
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
          <DialogTrigger asChild>
            <Button size="sm" variant="outline" className="p-0 flex justify-center items-center">
              <Plus className="h-5 w-5 text-blue-600" /> Add Category
            </Button>
          </DialogTrigger>
          <CategoryForm onClose={closeDialog} />
        </Dialog>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {isError || !data || !data.success ? (
          <div className="text-red-500">
            {data && 'message' in data ? data.message : 'Failed to load categories'}
          </div>
        ) : (
          data.data.map((item: { _id: string; name: string }) => (
            <div key={item._id} className="bg-white shadow-md rounded-lg p-4">
              <div className="flex justify-between items-center">
                <div className="text-lg font-semibold">{item.name}</div>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  )
}

export default CategoryPage
