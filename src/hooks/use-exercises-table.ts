import { create } from 'zustand'

interface ExercisesTableState {
  page: number
  limit: number
  setPage: (page: number) => void
  setLimit: (limit: number) => void
  searchName: string
  setSearchName: (searchName: string) => void
}

export const useExercisesTable = create<ExercisesTableState>((set) => ({
  page: 1,
  limit: 10,
  setPage: (page) => set({ page }),
  setLimit: (limit) => set({ limit }),
  searchName: '',
  setSearchName: (searchName) => set({ searchName }),
}))
