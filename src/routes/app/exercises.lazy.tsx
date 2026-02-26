import { useGetExercises } from '@/hooks/use-get-exercises'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/app/exercises')({
  component: RouteComponent,
})

function RouteComponent() {
  const { data, isLoading, error } = useGetExercises({
    page: 1,
    limit: 10,
  })

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  return (
    <div>
      <h1>Exercises</h1>
      <ul>
        {data?.data.map((exercise) => (
          <li key={exercise.id}>{exercise.name}</li>
        ))}
      </ul>
    </div>
  )
}
