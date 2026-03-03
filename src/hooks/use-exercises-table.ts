import { create } from 'zustand'

interface ExercisesTableState {
  page: number
  limit: number
  setPage: (page: number) => void
  setLimit: (limit: number) => void
  searchName: string
  setSearchName: (searchName: string) => void
  bodyZones: Array<string>
  setBodyZones: (bodyZones: Array<string>) => void
  hasFilters: () => boolean
  clearFilters: () => void
}

export const useExercisesTable = create<ExercisesTableState>((set, get) => ({
  page: 1,
  limit: 10,
  setPage: (page) => set({ page }),
  setLimit: (limit) => set({ limit }),
  searchName: '',
  setSearchName: (searchName) => set({ searchName }),
  bodyZones: [],
  setBodyZones: (bodyZones) => set({ bodyZones }),
  hasFilters: () => {
    return get().searchName !== '' || get().bodyZones.length > 0
  },
  clearFilters: () => {
    set({ searchName: '', bodyZones: [], page: 1 })
  },
}))
