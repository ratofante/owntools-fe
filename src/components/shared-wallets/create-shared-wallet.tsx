import { useState } from 'react'
import { useForm } from '@tanstack/react-form'
import { useStore } from '@tanstack/react-store'
import type { UserType } from '@/types'
import { FindUser } from '@/components/users/find-user'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export function CreateSharedWallet() {
  const [selectedUsers, setSelectedUsers] = useState<Array<UserType>>([])

  const form = useForm({
    defaultValues: {
      walletName: '',
      userIds: [] as Array<number>,
    },
    onSubmit: ({ value }) => {
      console.log(value)
    },
  })

  const userIds = useStore(form.baseStore, (state) => state.values.userIds)

  function addUser(userToAdd: UserType) {
    if (userIds.includes(userToAdd.id)) return
    form.setFieldValue('userIds', [...userIds, userToAdd.id])
    setSelectedUsers((prev) => [...prev, userToAdd])
  }

  function removeUser(id: number) {
    form.setFieldValue(
      'userIds',
      userIds.filter((uid: number) => uid !== id),
    )
    setSelectedUsers((prev) => prev.filter((u) => u.id !== id))
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        form.handleSubmit()
      }}
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <form.Field name="walletName">
            {(field) => (
              <>
                <Label htmlFor="walletName">Wallet Name</Label>
                <Input
                  id="walletName"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="My shared wallet"
                />
              </>
            )}
          </form.Field>
        </div>

        <FindUser
          selectedUsers={selectedUsers}
          selectedUserIds={userIds}
          onAdd={addUser}
          onRemove={removeUser}
        />

        <Button type="submit">Create Wallet</Button>
      </div>
    </form>
  )
}
