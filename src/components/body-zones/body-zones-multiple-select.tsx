import {
  MultiSelect,
  MultiSelectContent,
  MultiSelectGroup,
  MultiSelectItem,
  MultiSelectTrigger,
  MultiSelectValue,
} from '@/components/ui/multi-select'
import { useGetBodyZones } from '@/hooks/use-get-body-zones'

export function BodyZonesMultipleSelect({
  className,
  values,
  onValuesChange,
}: {
  className?: string
  values: Array<string>
  onValuesChange: (values: Array<string>) => void
}) {
  const { data, isLoading } = useGetBodyZones()
  const bodyZones = data?.data || []

  return (
    <MultiSelect values={values} onValuesChange={onValuesChange}>
      <MultiSelectTrigger className={className}>
        <MultiSelectValue
          overflowBehavior={'cutoff'}
          placeholder={isLoading ? 'Loading...' : 'Select body zones'}
        />
      </MultiSelectTrigger>
      <MultiSelectContent>
        <MultiSelectGroup>
          {bodyZones.map((bodyZone) => (
            <MultiSelectItem key={bodyZone.id} value={bodyZone.id.toString()}>
              {bodyZone.name}
            </MultiSelectItem>
          ))}
        </MultiSelectGroup>
      </MultiSelectContent>
    </MultiSelect>
  )
}
