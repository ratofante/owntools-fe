import { useState } from 'react'
import { useForm } from '@tanstack/react-form'
import { Plus } from 'lucide-react'
import type { WalletType } from '@/types'
import { ExpenseSchema } from '@/types/expense'
import { useAddExpense } from '@/hooks/use-expenses'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'

/** Converts a display string like "3000" or "3000.50" to integer cents.
 *  Uses string splitting to avoid floating-point rounding errors. */
function toCents(display: string): number {
  if (!display || display === '.') return 0
  const [intPart = '0', decPart = ''] = display.split('.')
  return (
    parseInt(intPart || '0', 10) * 100 +
    parseInt(decPart.padEnd(2, '0').slice(0, 2), 10)
  )
}

export function AddExpense({
  className,
  userId,
  wallet,
  disabled = false,
}: {
  className?: string
  userId: number
  wallet: WalletType
  disabled?: boolean
}) {
  const [open, setOpen] = useState(false)
  const [amountDisplay, setAmountDisplay] = useState('')
  const [shareDisplays, setShareDisplays] = useState<Array<string>>(() =>
    wallet.users.map(() => ''),
  )
  const { mutateAsync: addExpense } = useAddExpense(wallet.id)

  const form = useForm({
    defaultValues: {
      user_id: userId,
      description: '',
      amount_cents: 0,
      split_type: 'equal',
      custom_shares: [] as Array<{
        user_id: number
        share_amount_cents: number
      }>,
    },
    validators: {
      onSubmit: ({ value }) => {
        const payload =
          value.split_type === 'equal'
            ? { ...value, custom_shares: undefined }
            : value
        const result = ExpenseSchema.safeParse(payload)
        if (!result.success) {
          return result.error.issues[0]?.message ?? 'Invalid form data'
        }
        return undefined
      },
    },
    onSubmit: async ({ value }) => {
      const payload =
        value.split_type === 'equal'
          ? { ...value, custom_shares: undefined }
          : value
      const result = ExpenseSchema.safeParse(payload)
      if (result.success) {
        console.log('adding expense: ', result.data)
        await addExpense(result.data, {
          onSuccess: () => {
            setOpen(false)
            form.reset()
            setAmountDisplay('')
            setShareDisplays(wallet.users.map(() => ''))
          },
        })
      }
    },
  })
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="default"
          size="sm"
          className={className}
          disabled={disabled}
        >
          <Plus size={16} />
          Expense
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Add Expense</SheetTitle>
          <SheetDescription>Add a new expense to the wallet</SheetDescription>
        </SheetHeader>
        <div className="space-4 px-4">
          <form
            id="add-expense-form"
            className="flex flex-col"
            onSubmit={(e) => {
              e.preventDefault()
              form.handleSubmit()
            }}
          >
            <FieldGroup>
              <form.Field
                name="description"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Description</FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          field.handleChange(e.target.value)
                        }
                        aria-invalid={field.state.meta.isValid}
                      />
                      <FieldError errors={field.state.meta.errors} />
                    </Field>
                  )
                }}
              />
              <form.Field
                name="amount_cents"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Amount</FieldLabel>
                      <Input
                        type="text"
                        inputMode="decimal"
                        id={field.name}
                        name={field.name}
                        placeholder="0"
                        value={amountDisplay}
                        onFocus={(e) => e.target.select()}
                        onBlur={() => {
                          // Strip trailing dot on blur (e.g. "30." → "30")
                          if (amountDisplay.endsWith('.')) {
                            setAmountDisplay((prev) => prev.slice(0, -1))
                          }
                          field.handleBlur()
                        }}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          const raw = e.target.value
                          // Allow empty, integers, or decimals with up to 2 places
                          if (raw !== '' && !/^\d+\.?\d{0,2}$/.test(raw)) return
                          setAmountDisplay(raw)
                          field.handleChange(toCents(raw))
                        }}
                        aria-invalid={field.state.meta.isValid}
                      />
                      <FieldError errors={field.state.meta.errors} />
                    </Field>
                  )
                }}
              />
              <form.Subscribe
                selector={(state) => ({
                  splitType: state.values.split_type,
                  amountCents: state.values.amount_cents,
                  shares: state.values.custom_shares,
                })}
                children={({ splitType, amountCents, shares }) => {
                  const sharesSum = shares.reduce(
                    (acc, s) => acc + s.share_amount_cents,
                    0,
                  )
                  const remainingCents = amountCents - sharesSum

                  return (
                    <div className="bg-muted text-muted-foreground p-4 rounded-md">
                      {splitType === 'equal' && (
                        <div className="flex flex-col gap-2">
                          <span className="text-sm text-muted-foreground">
                            This expense will be split equally between the
                            members of the wallet.
                          </span>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                              form.setFieldValue('split_type', 'custom')
                              form.setFieldValue(
                                'custom_shares',
                                wallet.users.map((u) => ({
                                  user_id: u.id,
                                  share_amount_cents: 0,
                                })),
                              )
                              setShareDisplays(wallet.users.map(() => ''))
                            }}
                          >
                            Custom split
                          </Button>
                        </div>
                      )}
                      {splitType === 'custom' && (
                        <div className="flex flex-col gap-3">
                          <span className="text-sm text-muted-foreground">
                            Set each member&apos;s share. They must add up to
                            the total amount.
                          </span>

                          {wallet.users.map((user, i) => (
                            <form.Field
                              key={user.id}
                              name={`custom_shares[${i}].share_amount_cents`}
                              children={(field) => (
                                <Field>
                                  <FieldLabel htmlFor={field.name}>
                                    {user.fullName || user.email}
                                  </FieldLabel>
                                  <Input
                                    type="text"
                                    inputMode="decimal"
                                    id={field.name}
                                    placeholder="0"
                                    value={shareDisplays[i]}
                                    onFocus={(e) => e.target.select()}
                                    onBlur={() => {
                                      if (shareDisplays[i]?.endsWith('.')) {
                                        setShareDisplays((prev) => {
                                          const next = [...prev]
                                          next[i] = prev[i].slice(0, -1)
                                          return next
                                        })
                                      }
                                      field.handleBlur()
                                    }}
                                    onChange={(
                                      e: React.ChangeEvent<HTMLInputElement>,
                                    ) => {
                                      const raw = e.target.value
                                      if (
                                        raw !== '' &&
                                        !/^\d+\.?\d{0,2}$/.test(raw)
                                      )
                                        return
                                      setShareDisplays((prev) => {
                                        const next = [...prev]
                                        next[i] = raw
                                        return next
                                      })
                                      field.handleChange(toCents(raw))
                                    }}
                                  />
                                </Field>
                              )}
                            />
                          ))}

                          {amountCents > 0 && (
                            <p
                              className={
                                remainingCents === 0
                                  ? 'text-sm text-green-600'
                                  : 'text-sm text-destructive'
                              }
                            >
                              {remainingCents === 0
                                ? 'Shares add up correctly.'
                                : remainingCents > 0
                                  ? `${(remainingCents / 100).toFixed(2)} still to assign`
                                  : `${(Math.abs(remainingCents) / 100).toFixed(2)} over the total`}
                            </p>
                          )}

                          <Button
                            type="button"
                            variant="outline"
                            onClick={() =>
                              form.setFieldValue('split_type', 'equal')
                            }
                          >
                            Split equally instead
                          </Button>
                        </div>
                      )}
                    </div>
                  )
                }}
              />
            </FieldGroup>
            <form.Subscribe
              selector={(state) => ({
                canSubmit:
                  state.values.description.trim() !== '' &&
                  state.values.amount_cents > 0 &&
                  !state.isSubmitting,
              })}
              children={({ canSubmit }) => (
                <Button type="submit" disabled={!canSubmit} className="mt-8">
                  Add Expense
                </Button>
              )}
            />
          </form>
        </div>
      </SheetContent>
    </Sheet>
  )
}
