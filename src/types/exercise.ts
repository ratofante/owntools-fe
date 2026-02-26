export interface Exercise {
  id: number
  createdBy: number | null
  name: string
  description: string
  videoUrl: string | null
  createdAt: string
  updatedAt: string
  user?: {
    id: number
    fullName: string
    email: string
  }
}
