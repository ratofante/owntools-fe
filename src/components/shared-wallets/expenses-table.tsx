import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { EllipsisVertical, Pen, Trash } from 'lucide-react'
import type { ColumnDef } from '@tanstack/react-table'
import type { ExpenseType } from '@/types'
import { useDeleteExpense } from '@/hooks/use-expenses'
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
import { Button } from '@/components/ui/button'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

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
  {
    accessorKey: 'actions',
    header: () => {
      return <div className="flex justify-end w-full">Actions</div>
    },
    cell: ({ row }) => {
      const { mutateAsync: deleteExpense, isPending: isDeletingExpense } =
        useDeleteExpense(row.original.walletId, row.original.id)

      async function handleDelete() {
        await deleteExpense(undefined, {
          onSuccess: () => {
            console.log('deleted expense: ', row.original.id)
          },
        })
      }

      return (
        <div className="flex justify-end w-full">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                disabled={isDeletingExpense}
              >
                <EllipsisVertical size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="left" align="start">
              <DropdownMenuItem>
                <Pen size={16} /> Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDelete}>
                <Trash size={16} /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
