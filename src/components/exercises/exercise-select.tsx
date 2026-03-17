import { useState } from 'react'
import { CheckIcon, ChevronsUpDownIcon } from 'lucide-react'
import type { ExerciseType } from '@/types/exercise'
import { useGetExercises } from '@/hooks/use-exercises'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

interface ExerciseSelectProps {
  value: ExerciseType | null
  onSelect: (exercise: ExerciseType | null) => void
}

export function ExerciseSelect({ value, onSelect }: ExerciseSelectProps) {
  const [open, setOpen] = useState(false)
  const { data: exercises, isLoading } = useGetExercises()

  return (
    <div className="space-y-4">
      <Label htmlFor="exercise-select">Exercise</Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="lg"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
            aria-label="Exercise combobox"
          >
            {value ? value.name : 'Select Exercise...'}
            <ChevronsUpDownIcon className="opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0">
          <Command>
            <CommandInput placeholder="Search exercises..." className="h-9" />
            <CommandList>
              <CommandEmpty>No exercises found.</CommandEmpty>
              <CommandGroup>
                {isLoading ? (
                  <CommandItem>Loading...</CommandItem>
                ) : (
                  exercises?.map((exercise) => (
                    <CommandItem
                      key={exercise.id}
                      value={exercise.name}
                      onSelect={(currentValue) => {
                        onSelect(currentValue === value?.name ? null : exercise)
                        setOpen(false)
                      }}
                    >
                      {exercise.name}
                      <CheckIcon
                        className={cn(
                          'ml-auto',
                          value?.name === exercise.name
                            ? 'opacity-100'
                            : 'opacity-0',
                        )}
                      />
                    </CommandItem>
                  ))
                )}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}
