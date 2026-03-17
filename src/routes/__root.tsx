import {
  Outlet,
  createRootRouteWithContext,
  redirect,
} from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import type { QueryClient } from '@tanstack/react-query'
import type { useAuthStore } from '@/stores/auth-store'
import TanStackQueryDevtools from '@/integrations/tanstack-query/devtools.tsx'
import { NotFound } from '@/components/not-found'

interface MyRouterContext {
  queryClient: QueryClient
  auth: typeof useAuthStore
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  notFoundComponent: NotFound,
  component: () => (
    <>
      <Outlet />
      <TanStackDevtools
        config={{
          position: 'bottom-right',
        }}
        plugins={[
          {
            name: 'Tanstack Router',
            render: <TanStackRouterDevtoolsPanel />,
          },
          TanStackQueryDevtools,
        ]}
      />
    </>
  ),
  beforeLoad: ({ context, location }) => {
    const { auth } = context
    const authState = auth.getState()
    if (location.pathname.startsWith('/app') && !authState.isAuthenticated) {
      throw redirect({
        to: '/login',
        search: {
          redirect: location.pathname,
        },
      })
    }
  },
})
