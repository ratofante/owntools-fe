import { createFileRoute } from '@tanstack/react-router'
import { useAuthStore } from '@/stores/auth-store'
import { WalletsGallery } from '@/components/shared-wallets/wallets-gallery'

export const Route = createFileRoute('/quicksplit/dashboard')({
  component: RouteComponent,
})

function RouteComponent() {
  const auth = useAuthStore()
  return (
    <>
      {auth.user && auth.token && (
        <div className="space-y-6">
          <h1 className="app-title">QuickSplit Dashboard</h1>

          <WalletsGallery userId={auth.user.id} />
        </div>
      )}
    </>
  )
}
