import { useGetExercises } from '@/hooks/use-get-exercises'
import { createLazyFileRoute } from '@tanstack/react-router'
import type { ColumnDef } from '@tanstack/react-table'
import type { Exercise } from '@/types/exercise'
import { DataTable } from '@/components/data-table'
import { Card } from '@/components/ui/card'

export const Route = createLazyFileRoute('/app/exercises')({
  component: RouteComponent,
})

const exerciseColumns: ColumnDef<Exercise>[] = [
  {
    header: 'Name',
    accessorKey: 'name',
  },
  {
    header: 'Description',
    accessorKey: 'description',
  },
  {
    header: 'Video URL',
    accessorKey: 'videoUrl',
  },
  {
    header: 'Created At',
    accessorKey: 'createdAt',
  },
]

function RouteComponent() {
  const { data, isLoading, error } = useGetExercises({
    page: 1,
    limit: 10,
  })

  return (
    <div>
      <h1>Exercises</h1>
      {isLoading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>Error: {error.message}</div>
      ) : (
        <div className="w-full">
          <DataTable columns={exerciseColumns} data={data?.data || []} />
        </div>
      )}
    </div>
  )
}
