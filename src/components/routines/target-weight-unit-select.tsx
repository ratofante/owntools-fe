import type { TargetWeightUnit } from '@/types/routine-old'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export function TargetWeightUnitSelect({
  value,
  onValueChange,
}: {
  value: TargetWeightUnit | null
  onValueChange: (value: TargetWeightUnit) => void
}) {
  return (
    <Select value={value ?? undefined} onValueChange={onValueChange}>
      <SelectTrigger className="max-w-48">
        <SelectValue placeholder="Unit" defaultValue={value ?? undefined} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="kg">kg</SelectItem>
          <SelectItem value="lbs">lbs</SelectItem>
          <SelectItem value="cal">cal</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
