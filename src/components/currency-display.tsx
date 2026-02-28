import { useMemo } from 'react'
import { cn } from '@/lib/utils'

interface CurrencyDisplayProps {
  amount: number
  className?: string
  withDecimals?: boolean
}

export function CurrencyDisplay({
  amount,
  withDecimals = true,
  className,
}: CurrencyDisplayProps) {
  const parts = useMemo(() => {
    const formatter = new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      currencyDisplay: 'narrowSymbol',
    })

    return formatter.formatToParts(amount)
  }, [amount])

  return (
    <span className={className}>
      {parts.map((part, index) => {
        if (part.type === 'decimal' || part.type === 'fraction') {
          return (
            <span
              key={index}
              className={cn('text-[0.7em]', !withDecimals && 'hidden')}
            >
              {part.value}
            </span>
          )
        }
        return <span key={index}>{part.value}</span>
      })}
    </span>
  )
}
