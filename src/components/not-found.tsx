import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'

export function NotFound() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 p-6">
      <h1 className="text-2xl font-semibold">Page not found</h1>
      <p className="text-muted-foreground text-center text-sm">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Button asChild>
        <Link to="/">Go home</Link>
      </Button>
    </div>
  )
}
