import { Link, useNavigate, useRouterState } from '@tanstack/react-router'
import { LayoutDashboard, LogOut } from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/use-auth'

const items = {
  application: [
    {
      title: 'Dashboard',
      url: '/app/dashboard',
      icon: LayoutDashboard,
      disabled: false,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const auth = useAuth()
  const navigate = useNavigate()
  const routerState = useRouterState()
  const currentPath = routerState.location.pathname
  console.log(currentPath)

  function handleLogout() {
    auth.logout()
    navigate({ from: currentPath as any, to: '/login' })
  }
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <div>Logo Here</div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel> Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.application.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    className="hover:bg-secondary transition-colors"
                    isActive={location.pathname === item.url}
                    asChild
                  >
                    <Link
                      to={item.url}
                      className={cn({
                        'pointer-events-none opacity-50': item.disabled,
                      })}
                    >
                      <item.icon /> {item.title}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div>User</div>
        <Button variant="ghost" onClick={handleLogout}>
          <LogOut />
          Logout
        </Button>
      </SidebarFooter>
    </Sidebar>
  )
}
