import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import type { ColumnDef } from '@tanstack/react-table'
import type { ExpenseType } from '@/types'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { getInitials } from '@/lib/utils'
import { CurrencyDisplay } from '@/components/currency-display'

const expenseColumns: Array<ColumnDef<ExpenseType>> = [
  {
    accessorKey: 'date',
    header: 'Date',
    cell: ({ row }) => {
      return (
        <div className="min-w-12 max-w-64 w-fit text-xs text-muted-foreground uppercase">
          {row.original.date}
        </div>
      )
    },
  },
  {
    accessorKey: 'description',
    header: 'Description',
    cell: ({ row }) => {
      return (
        <div className="min-w-12 max-w-64 w-fit">
          {row.original.description}
        </div>
      )
    },
  },
  {
    accessorKey: 'amountCents',
    header: 'Amount',
    cell: ({ row }) => {
      return (
        <div className="min-w-12 max-w-64 w-fit font-medium">
          <CurrencyDisplay amount={row.original.amountCents / 100} />
        </div>
      )
    },
  },
  {
    accessorKey: 'paidBy',
    header: 'Paid By',
    cell: ({ row }) => {
      return (
        <div className="min-w-12 max-w-64 w-fit">
          {row.original.paidBy.fullName}
        </div>
      )
    },
  },
  {
    accessorKey: 'shares',
    header: 'Shares',
    cell: ({ row }) => {
      const { shares, splitType } = row.original

      if (splitType === 'equal') {
        return <span className="text-xs text-muted-foreground">Equal</span>
      }

      return (
        <div className="flex flex-wrap gap-2">
          {shares.map((share) => (
            <span key={share.id} className="text-xs">
              <span className="font-medium">
                {getInitials(share.user.fullName)}
              </span>{' '}
              <CurrencyDisplay amount={share.shareAmountCents / 100} />
            </span>
          ))}
        </div>
      )
    },
  },
]

export function ExpensesTable({
  expenses,
  isLoading,
}: {
  expenses: Array<ExpenseType>
  isLoading: boolean
}) {
  const table = useReactTable({
    data: expenses,
    columns: expenseColumns,
    getCoreRowModel: getCoreRowModel(),
  })
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
                colSpan={expenseColumns.length}
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
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={expenseColumns.length}
                className="h-24 text-center"
              >
                No expenses yet.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  )
}
