import { useForm } from '@tanstack/react-form'
import { useNavigate } from '@tanstack/react-router'
import { z } from 'zod'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useAuthStore } from '@/stores/auth-store'
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

const registerSchema = z
  .object({
    email: z.email('Invalid email address'),
    password: z.string().min(8, 'Password is required'),
    confirmPassword: z.string().min(8, 'Confirm password is required'),
    fullName: z.string().min(3, 'Full name is required'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  })

export function RegisterForm() {
  const auth = useAuthStore()
  const navigate = useNavigate({ from: '/' })
  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      fullName: '',
    },
    validators: {
      onSubmit: registerSchema,
      onMount: registerSchema,
    },
    onSubmit: async ({ value }) => {
      await auth.register(value.email, value.password, value.fullName)
      navigate({ to: '/app/dashboard' })
    },
  })
  return (
    <Card className="shadow-2xl">
      <CardHeader>
        <CardTitle>Be an early adopter</CardTitle>
        <CardDescription>
          Your feedback will help us shape the future of the app.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          id="register-form"
          onSubmit={(e) => {
            e.preventDefault()
            form.handleSubmit()
          }}
          className="@container"
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
                    <FieldError
                      errors={
                        field.state.meta.isBlurred
                          ? field.state.meta.errors
                          : []
                      }
                    />
                  </Field>
                )
              }}
            />
            <form.Field
              name="fullName"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Full Name</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      type="text"
                      placeholder="John Doe"
                      autoComplete="off"
                      required
                    />
                    <FieldError
                      errors={
                        field.state.meta.isBlurred
                          ? field.state.meta.errors
                          : []
                      }
                    />
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
                    <FieldError
                      errors={
                        field.state.meta.isBlurred
                          ? field.state.meta.errors
                          : []
                      }
                    />
                  </Field>
                )
              }}
            />
            <form.Field
              name="confirmPassword"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>
                      Confirm Password
                    </FieldLabel>
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
                    <FieldError
                      errors={
                        field.state.meta.isBlurred
                          ? field.state.meta.errors
                          : []
                      }
                    />
                  </Field>
                )
              }}
            />

            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
              children={([canSubmit, isSubmitting]) => (
                <Button
                  type="submit"
                  disabled={!canSubmit}
                  size="lg"
                  className="text-base tracking-wide"
                >
                  {isSubmitting ? 'Registering...' : 'Start now'}
                </Button>
              )}
            />
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}
