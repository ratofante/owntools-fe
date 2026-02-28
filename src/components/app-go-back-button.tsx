import { useRouter } from '@tanstack/react-router'
import { ArrowLeftIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const AppGoBackButton = ({ to }: { to?: string }) => {
  const router = useRouter()
  const handleGoBack = () => {
    if (to) {
      router.navigate({ to })
    } else {
      router.history.back()
    }
  }
  return (
    <Button variant="outline" size="icon" onClick={handleGoBack}>
      <ArrowLeftIcon className="size-4" />
    </Button>
  )
}
