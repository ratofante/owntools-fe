import { createLazyFileRoute } from '@tanstack/react-router'
import { format } from 'date-fns'
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { SearchIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import type { Exercise } from '@/types/exercise'
import type { ColumnDef } from '@tanstack/react-table'
import { useGetExercises } from '@/hooks/use-get-exercises'
import { Pagination } from '@/components/pagination'
import { useExercisesTable } from '@/hooks/use-exercises-table'
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { useDebounce } from '@/hooks/use-debounce'

export const Route = createLazyFileRoute('/app/exercises')({
  component: RouteComponent,
})

const exerciseColumns: Array<ColumnDef<Exercise>> = [
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => {
      return <div className="min-w-12 max-w-20">{row.original.name}</div>
    },
  },
  {
    accessorKey: 'description',
    header: 'Description',
    cell: ({ row }) => {
      return (
        <div className="text-wrap max-w-xs line-clamp-2 text-xs">
          {row.original.description}
        </div>
      )
    },
  },
  {
    accessorKey: 'createdAt',
    header: () => <div className="text-right">Created At</div>,
    cell: ({ row }) => {
      return (
        <div className="uppercase text-right text-xs text-muted-foreground">
          {format(new Date(row.original.createdAt), 'dd/MM/yyyy')}
        </div>
      )
    },
  },
]

function RouteComponent() {
  const [search, setSearch] = useState<string>('')
  const { page, limit, setPage, setLimit, searchName, setSearchName } =
    useExercisesTable()
  const { data, isLoading } = useGetExercises({
    page: page,
    limit: limit,
    search: searchName,
  })
  const exercises = data?.data || []
  const table = useReactTable({
    data: exercises,
    columns: exerciseColumns,
    getCoreRowModel: getCoreRowModel(),
  })

  const debouncedSearchName = useDebounce(search, 500)

  useEffect(() => {
    setSearchName(debouncedSearchName)
  }, [debouncedSearchName])

  return (
    <div className="flex-1 flex flex-col">
      <h1 className="text-2xl font-bold">Exercises</h1>
      <div className="flex-1">
        <div className="flex items-center">
          <Input
            icon={<SearchIcon className="w-4 h-4" />}
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Pagination
            className="ml-auto"
            currentPage={data?.meta.currentPage || 1}
            limit={limit}
            limitOptions={[10, 20, 50]}
            totalPages={Math.ceil(
              (data?.meta.total || 0) / (data?.meta.perPage || 1),
            )}
            lastPage={data?.meta.lastPage || 1}
            onPrevious={() => setPage(page - 1)}
            onNext={() => setPage(page + 1)}
            onLimitChange={(newLimit) => setLimit(newLimit)}
          />
        </div>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={exerciseColumns.length}
                  className="h-24 text-center"
                >
                  Loading...
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={exerciseColumns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
          <TableFooter></TableFooter>
        </Table>
      </div>
    </div>
  )
}
