import { Info } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'

export function AppTooltip({
  content,
  icon: Icon = Info,
}: {
  content: React.ReactNode
  icon?: LucideIcon
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Icon className="size-4" />
      </TooltipTrigger>
      <TooltipContent>
        <p className="max-w-xs leading-4.5">{content}</p>
      </TooltipContent>
    </Tooltip>
  )
}
