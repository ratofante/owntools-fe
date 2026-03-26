import { createFileRoute, redirect } from '@tanstack/react-router'
import { LoginForm } from '@/components/login-form'

const fallback = '/app/dashboard' as const

export const Route = createFileRoute('/_public/login')({
  beforeLoad: ({ context, search }) => {
    if (context.auth.getState().isAuthenticated) {
      throw redirect({
        to: (search as { redirect?: string }).redirect || fallback,
      })
    }
  },
  component: PageLogin,
})

function PageLogin() {
  return (
    <div className="flex justify-center">
      <LoginForm />
    </div>
  )
}
