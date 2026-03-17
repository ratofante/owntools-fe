import { create } from 'zustand'
import type { ExerciseType } from '@/types/exercise'

interface ExercisesTableStore {
  page: number
  limit: number
  setPage: (page: number) => void
  setLimit: (limit: number) => void
  searchName: string
  setSearchName: (searchName: string) => void
  bodyZones: Array<string>
  setBodyZones: (bodyZones: Array<string>) => void
  muscleGroups: Array<string>
  setMuscleGroups: (muscleGroups: Array<string>) => void

  /** Exercise Sheet */
  openExerciseSheet: boolean
  setOpenExerciseSheet: (openExerciseSheet: boolean) => void
  exercise: ExerciseType | null
  setExercise: (exercise: ExerciseType | null) => void

  hasFilters: () => boolean
  clearFilters: () => void
}

export const useExercisesTableStore = create<ExercisesTableStore>(
  (set, get) => ({
    page: 1,
    limit: 10,
    setPage: (page) => set({ page }),
    setLimit: (limit) => set({ limit }),
    searchName: '',
    setSearchName: (searchName) => set({ searchName }),
    bodyZones: [],
    setBodyZones: (bodyZones) => set({ bodyZones }),
    muscleGroups: [],
    setMuscleGroups: (muscleGroups) => set({ muscleGroups }),

    /** Exercise Sheet */
    openExerciseSheet: false,
    setOpenExerciseSheet: (openExerciseSheet) => set({ openExerciseSheet }),
    exercise: null,
    setExercise: (exercise) => set({ exercise }),

    hasFilters: () => {
      return (
        get().searchName !== '' ||
        get().bodyZones.length > 0 ||
        get().muscleGroups.length > 0
      )
    },
    clearFilters: () => {
      set({ searchName: '', bodyZones: [], muscleGroups: [], page: 1 })
    },
  }),
)
