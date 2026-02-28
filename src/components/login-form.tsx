import { useForm } from '@tanstack/react-form'
import { useNavigate } from '@tanstack/react-router'
import { z } from 'zod'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useAuth } from '@/hooks/use-auth'
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'

const loginSchema = z.object({
  email: z.email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  const auth = useAuth()
  const navigate = useNavigate({ from: '/login' })
  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    validators: {
      onSubmit: loginSchema,
      onBlur: loginSchema,
    },
    onSubmit: async ({ value }) => {
      console.log(value)
      console.log(form.state)
      await auth.login(value.email, value.password)
      navigate({ to: '/app/dashboard' })
    },
  })

  console.log(form.state.isValid, form.state.canSubmit)

  return (
    <div
      className={cn('flex flex-col gap-6 flex-1 max-w-md', className)}
      {...props}
    >
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            id="login-form"
            onSubmit={(e) => {
              e.preventDefault()
              form.handleSubmit()
            }}
          >
            <FieldGroup>
              <form.Field
                name="email"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        type="email"
                        placeholder="mail@domain.com"
                        autoComplete="off"
                        required
                      />
                      <FieldError errors={field.state.meta.errors} />
                    </Field>
                  )
                }}
              />
              <form.Field
                name="password"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        type="password"
                        placeholder="********"
                        autoComplete="off"
                        required
                      />
                      <FieldError errors={field.state.meta.errors} />
                    </Field>
                  )
                }}
              />
              <form.Subscribe
                selector={(state) => [state.canSubmit, state.isSubmitting]}
                children={([canSubmit, isSubmitting]) => (
                  <Button type="submit" disabled={!canSubmit}>
                    {isSubmitting ? 'Logging in...' : 'Login'}
                  </Button>
                )}
              />
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
