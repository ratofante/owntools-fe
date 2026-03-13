import { format } from 'date-fns'
import { BicepsFlexed, CircleCheck, CircleX } from 'lucide-react'
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import type { ColumnDef } from '@tanstack/react-table'
import type { Exercise } from '@/types/exercise'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { ExerciseSheet } from '@/components/exercises/exercise-sheet'
import { exercisesTableStore } from '@/stores/exercises-table-store'

const exerciseColumns: Array<ColumnDef<Exercise>> = [
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => {
      return <div className="min-w-12 max-w-64 w-fit">{row.original.name}</div>
    },
  },
  {
    accessorKey: 'description',
    header: 'Description',
    cell: ({ row }) => {
      return (
        <div className="text-wrap max-w-xs min-w-48 line-clamp-2 text-xs w-fit">
          {row.original.description}
        </div>
      )
    },
  },
  {
    accessorKey: 'bodyZones',
    header: () => <div>Primary Body Zones</div>,
    cell: ({ row }) => (
      <div className="max-w-3xs flex flex-wrap gap-1 w-fit">
        {row.original.bodyZones.map((bodyZone) => (
          <Badge
            key={bodyZone.id}
            variant="outline"
            style={{ backgroundColor: bodyZone.hexColor }}
          >
            {bodyZone.name}
          </Badge>
        ))}
      </div>
    ),
  },
  {
    accessorKey: 'muscleGroups',
    header: () => (
      <div className="flex items-center gap-1">
        Muscle Groups <BicepsFlexed size={16} />
      </div>
    ),
    cell: ({ row }) => (
      <div className="max-w-3xs flex flex-wrap gap-1">
        {row.original.muscleGroups.map((muscleGroup) =>
          muscleGroup.involvement_level === 'primary' ? (
            <Badge key={muscleGroup.id} variant="outline">
              {muscleGroup.name}
            </Badge>
          ) : (
            <Badge key={muscleGroup.id} variant="secondary">
              {muscleGroup.name}
            </Badge>
          ),
        )}
      </div>
    ),
  },
  {
    accessorKey: 'videoUrl',
    header: () => <div className="text-center">Video</div>,
    cell: ({ row }) => (
      <div>
        {row.original.videoUrl ? (
          <CircleCheck size={16} className="text-green-500 mx-auto" />
        ) : (
          <CircleX size={16} className="text-red-500 mx-auto" />
        )}
      </div>
    ),
  },
  {
    accessorKey: 'Created By',
    header: () => <div className="text-center">Created By</div>,
    cell: ({ row }) => {
      return (
        <div className="text-center">
          {row.original.createdBy ? (
            row.original.user?.fullName
          ) : (
            <Badge variant="outline">System</Badge>
          )}
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

export function ExerciseTable({
  exercises,
  isLoading,
}: {
  exercises: Array<Exercise>
  isLoading: boolean
}) {
  const table = useReactTable({
    data: exercises,
    columns: exerciseColumns,
    getCoreRowModel: getCoreRowModel(),
  })
  const { openExerciseSheet, setOpenExerciseSheet, exercise, setExercise } =
    exercisesTableStore()

  return (
    <>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id} className="font-semibold">
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
                onClick={(e) => {
                  e.stopPropagation()
                  setExercise(row.original)
                  setOpenExerciseSheet(true)
                }}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
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
      </Table>
      <ExerciseSheet
        open={openExerciseSheet}
        onOpenChange={setOpenExerciseSheet}
        exercise={exercise}
      />
    </>
  )
}
