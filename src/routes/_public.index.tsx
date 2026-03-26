import { createFileRoute } from '@tanstack/react-router'
import { Check, CircleDashed, Hammer } from 'lucide-react'
import { RegisterForm } from '@/components/register-form'

export const Route = createFileRoute('/_public/')({
  component: App,
})

function App() {
  return (
    <div className="flex flex-col gap-8 lg:flex-row lg:gap-12">
      <div className="flex-1 space-y-3">
        <h1 className="text-4xl font-bold font-serif">
          Build routines for your workouts{' '}
          <span className="text-primary">Beta</span>
        </h1>
        <p>Create and share your own routines with the community.</p>
        <div className="flex gap-4">
          <article className="border rounded-2xl p-4 flex-1">
            <h2 className="text-xl font-semibold font-serif mb-2">
              How it works
            </h2>
            <ol className="space-y-2">
              <ListItem label="Create an account" number={1} />
              <ListItem label="Start a routine" number={2} />
              <ListItem label="Plan your workout" number={3} />
              <ListItem label="Publish and share" number={4} />
            </ol>
          </article>
          <article className="border rounded-2xl p-4 flex-1">
            <h2 className="text-xl font-semibold font-serif mb-2">Roadmap</h2>
            <ol className="space-y-2">
              <ListItem stateIcon="in-progress" label="Routine Builder MVP" />
              <ListItem stateIcon="not-started" label="Enrich exercises data" />
              <ListItem stateIcon="not-started" label="Start a community" />
              <ListItem stateIcon="not-started" label="Add  user features" />
            </ol>
          </article>
        </div>
      </div>
      <div className="flex-1">
        <RegisterForm />
      </div>
    </div>
  )
}

function ListItem({
  label,
  number,
  stateIcon,
}: {
  label: string
  number?: number
  stateIcon?: string | 'done' | 'in-progress' | 'not-started'
}) {
  return (
    <li className="flex items-center gap-2">
      {number && (
        <span className="font-medium size-6 border border-secondary leading-0 text-xs rounded-full grid place-items-center">
          {number}
        </span>
      )}
      {stateIcon && stateIcon === 'done' && (
        <div className="size-6 grid place-items-center bg-secondary/50 rounded-sm">
          <Check className="size-4 text-secondary-foreground" />
        </div>
      )}
      {stateIcon && stateIcon === 'in-progress' && (
        <div className="size-6 grid place-items-center bg-secondary/80 rounded-sm">
          <Hammer className="size-4 text-secondary-foreground" />
        </div>
      )}
      {stateIcon && stateIcon === 'not-started' && (
        <div className="size-6 grid place-items-center rounded-sm">
          <CircleDashed className="size-4 text-muted-foreground" />
        </div>
      )}
      <p className="text-sm">{label}</p>
    </li>
  )
}
