import { Link, Outlet, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_public')({
  component: RouteComponent,
  beforeLoad: ({ search }) => {
    console.log('search', search)
  },
})

function RouteComponent() {
  return (
    <div>
      <header>
        <ol className="list-disc list-inside px-2">
          <li>
            <Link to="/" className="text-blue-500 hover:opacity-75">
              Home
            </Link>
          </li>
          <li>
            <Link to="/login" className="text-blue-500 hover:opacity-75">
              Login
            </Link>
          </li>
        </ol>
      </header>
      <Outlet />
    </div>
  )
}
