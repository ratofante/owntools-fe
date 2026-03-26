import { useEffect, useState } from 'react'
import { CircleCheck, Loader2, Plus, X } from 'lucide-react'
import type { UserType } from '@/types'
import { useDebounce } from '@/hooks/use-debounce'
import { useFindUsers } from '@/hooks/use-find-users'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface FindUserProps {
  selectedUsers: Array<UserType>
  selectedUserIds: Array<number>
  onAdd: (user: UserType) => void
  onRemove: (id: number) => void
}

export function FindUser({
  selectedUsers,
  selectedUserIds,
  onAdd,
  onRemove,
}: FindUserProps) {
  const [searchInputValue, setSearchInputValue] = useState('')
  const [search, setSearch] = useState('')
  const { data, isLoading } = useFindUsers(search)
  const debouncedSearch = useDebounce(searchInputValue, 500)

  useEffect(() => {
    setSearch(debouncedSearch)
  }, [debouncedSearch])

  return (
    <div className="space-y-2">
      <Label>Invite Participants</Label>
      <Input
        type="text"
        placeholder="Search users by email"
        value={searchInputValue}
        onChange={(e) => setSearchInputValue(e.target.value)}
      />

      {search && (
        <div className="">
          {isLoading ? (
            <div className="flex items-center gap-2 p-3 text-sm text-muted-foreground">
              <Loader2 size={14} className="animate-spin" /> Searching...
            </div>
          ) : !data?.users || data.users.length === 0 ? (
            <p className="p-3 text-sm text-muted-foreground">No users found</p>
          ) : (
            data.users.map((u) => (
              <Button
                variant="outline"
                size="sm"
                key={u.id}
                type="button"
                disabled={selectedUserIds.includes(u.id)}
                onClick={() => onAdd(u)}
              >
                {selectedUserIds.includes(u.id) ? (
                  <CircleCheck size={12} />
                ) : (
                  <Plus size={12} />
                )}
                <span>{u.email}</span>
              </Button>
            ))
          )}
        </div>
      )}

      {selectedUsers.length > 0 && (
        <div className="space-y-2 p-3 border rounded-md bg-muted">
          <Label className="text-sm text-muted-foreground">
            Selected participants
          </Label>
          <div className="space-y-2">
            {selectedUsers.map((u) => (
              <div
                key={u.id}
                className="flex items-center gap-1.5 text-sm pl-3 rounded-md w-fit bg-white"
              >
                <span>{u.email}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={`Remove ${u.email}`}
                  onClick={() => onRemove(u.id)}
                >
                  <X size={12} />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
