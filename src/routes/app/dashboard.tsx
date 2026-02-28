import { createFileRoute } from '@tanstack/react-router'
import { useAuth } from '@/hooks/use-auth'

export const Route: any = createFileRoute('/app/dashboard')({
  component: Dashboard,
})

function Dashboard() {
  const auth = useAuth()

  return (
    <>
      {auth.user && auth.token && (
        <div className="space-y-4">
          <h1>Dashboard</h1>
        </div>
      )}
    </>
  )
}
