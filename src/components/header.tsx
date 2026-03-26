import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'

export function Header() {
  return (
    <header
      className="fixed top-0 left-0 right-0 bg-white shadow-2xl
    flex items-center justify-between py-2 z-50"
    >
      <div className="flex items-center justify-between w-full container px-4 max-w-5xl mx-auto">
        <Link to="/">
          <div className="flex items-center justify-center bg-secondary shadow-xl size-8 rounded-full">
            <div className="flex items-center justify-center size-5 bg-white rounded-full">
              <div className="size-3 bg-primary rounded-full"></div>
            </div>
          </div>
        </Link>
        <Button className="ml-auto" variant="outline" asChild>
          <Link to="/login">Login</Link>
        </Button>
      </div>
    </header>
  )
}
