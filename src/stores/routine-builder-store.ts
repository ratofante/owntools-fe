import { create } from 'zustand'
import type { WorkoutBlockDraft, WorkoutTypeOption } from '@/types/routine'

type EditingBlock = {
  index: number
  block: WorkoutBlockDraft
}

type RoutineBuilderStore = {
  workoutType: WorkoutTypeOption | null
  editingBlock: EditingBlock | null
  setWorkoutType: (type: WorkoutTypeOption | null) => void
  startEditing: (
    index: number,
    block: WorkoutBlockDraft,
    workoutTypeOption: WorkoutTypeOption,
  ) => void
  reset: () => void
}

export const useRoutineBuilderStore = create<RoutineBuilderStore>((set) => ({
  workoutType: null,
  editingBlock: null,
  setWorkoutType: (type) => set({ workoutType: type }),
  startEditing: (index, block, workoutTypeOption) =>
    set({ editingBlock: { index, block }, workoutType: workoutTypeOption }),
  reset: () => set({ workoutType: null, editingBlock: null }),
}))
