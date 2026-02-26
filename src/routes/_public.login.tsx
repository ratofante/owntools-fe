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
    <div className="flex h-auto w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </div>
  )
}
