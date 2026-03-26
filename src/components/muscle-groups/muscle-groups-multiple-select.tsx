import {
  MultiSelect,
  MultiSelectContent,
  MultiSelectGroup,
  MultiSelectItem,
  MultiSelectTrigger,
  MultiSelectValue,
} from '@/components/ui/multi-select'
import { useGetMuscleGroups } from '@/hooks/use-get-muscle-groups'

export function MuscleGroupsMultipleSelect({
  className,
  values,
  onValuesChange,
  disabledValues,
}: {
  className?: string
  values: Array<string>
  onValuesChange: (values: Array<string>) => void
  disabledValues?: Array<string>
}) {
  const { data, isLoading } = useGetMuscleGroups()
  const muscleGroups = data?.data || []

  return (
    <MultiSelect values={values} onValuesChange={onValuesChange}>
      <MultiSelectTrigger className={className}>
        <MultiSelectValue
          overflowBehavior={'cutoff'}
          placeholder={isLoading ? 'Loading...' : 'Select muscle groups'}
        />
      </MultiSelectTrigger>
      <MultiSelectContent>
        <MultiSelectGroup>
          {muscleGroups.map((muscleGroup) => (
            <MultiSelectItem
              key={muscleGroup.id}
              value={muscleGroup.id.toString()}
              disabled={disabledValues?.includes(muscleGroup.id.toString())}
            >
              {muscleGroup.name}
            </MultiSelectItem>
          ))}
        </MultiSelectGroup>
      </MultiSelectContent>
    </MultiSelect>
  )
}
