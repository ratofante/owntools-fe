import type { RoutineType } from '@/types'

export function RoutineView({
  routine,
  children,
}: {
  routine: Partial<RoutineType>
  children?: React.ReactNode
}) {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">{routine.name}</h2>
      <div className="flex flex-col gap-2">{children}</div>
    </div>
  )
}
