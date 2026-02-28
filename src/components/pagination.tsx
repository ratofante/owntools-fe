import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'

export function Pagination({
  className,
  currentPage,
  limit,
  limitOptions,
  totalPages,
  lastPage,
  onPrevious,
  onNext,
  onLimitChange,
}: {
  className?: string
  currentPage: number
  limit: number
  limitOptions: Array<number>
  totalPages: number
  lastPage: number
  onPrevious: () => void
  onNext: () => void
  onLimitChange: (limit: number) => void
}) {
  return (
    <div
      className={cn('flex items-center justify-end space-x-2 py-4', className)}
    >
      <div className="text-sm text-muted-foreground">
        {currentPage} of {totalPages}
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={onPrevious}
        disabled={currentPage === 1}
      >
        <ChevronLeftIcon className="w-4 h-4" />
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={onNext}
        disabled={currentPage === lastPage}
      >
        <ChevronRightIcon className="w-4 h-4" />
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            <span className="sr-only">Items per page</span>
            {limit}
            <ChevronDownIcon className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {limitOptions.map((option) => (
            <DropdownMenuItem
              key={option}
              onClick={() => onLimitChange(option)}
            >
              {option}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
