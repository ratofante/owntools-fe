import { createFileRoute } from '@tanstack/react-router'
import { useAuthStore } from '@/stores/auth-store'
import { RoutineBuilder } from '@/components/routines/routine-builder'

export const Route: any = createFileRoute('/app/dashboard')({
  component: Dashboard,
})

function Dashboard() {
  const auth = useAuthStore()

  return (
    <>
      {auth.user && auth.token && (
        <div className="space-y-4">
          <RoutineBuilder user={auth.user} />
        </div>
      )}
    </>
  )
}
