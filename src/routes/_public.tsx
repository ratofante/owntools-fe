import { Outlet, createFileRoute } from '@tanstack/react-router'
import { Header } from '@/components/header'

export const Route = createFileRoute('/_public')({
  component: RouteComponent,
  beforeLoad: ({ search }) => {
    console.log('search', search)
  },
})

function RouteComponent() {
  return (
    <div className="min-h-screen w-full bg-muted">
      <Header />
      <main className="container px-4 max-w-5xl mx-auto pt-28">
        <Outlet />
      </main>
    </div>
  )
}
