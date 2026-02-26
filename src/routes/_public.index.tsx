import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_public/')({
  component: App,
})

function App() {
  return (
    <div className="flex h-auto w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <h1>Home</h1>
      </div>
    </div>
  )
}
