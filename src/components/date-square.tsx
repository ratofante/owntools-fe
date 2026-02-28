import { format } from 'date-fns'

export function DateSquare({ date }: { date: Date }) {
  return (
    <div className="bg-accent border-accent-foreground/10 border rounded-lg p-1 w-10 text-xs text-center">
      <p className="font-medium">{format(date, 'dd')}</p>
      <p className="text-[10px] text-accent-foreground">
        {format(date, 'MMM')}
      </p>
    </div>
  )
}
