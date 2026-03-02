import { createLazyFileRoute } from '@tanstack/react-router'
import { SearchIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useGetExercises } from '@/hooks/use-get-exercises'
import { Pagination } from '@/components/pagination'
import { useExercisesTable } from '@/hooks/use-exercises-table'
import { ExerciseTable } from '@/components/exercises/exercises-table'
import { Input } from '@/components/ui/input'
import { useDebounce } from '@/hooks/use-debounce'

export const Route = createLazyFileRoute('/app/exercises')({
  component: RouteComponent,
})

function RouteComponent() {
  const [search, setSearch] = useState<string>('')
  const { page, limit, setPage, setLimit, searchName, setSearchName } =
    useExercisesTable()
  const { data, isLoading } = useGetExercises({
    page: page,
    limit: limit,
    search: searchName,
  })
  const exercises = data?.data || []
  console.log(exercises)

  const debouncedSearchName = useDebounce(search, 500)

  useEffect(() => {
    setSearchName(debouncedSearchName)
  }, [debouncedSearchName])

  return (
    <div className="flex-1 flex flex-col">
      <h1 className="text-2xl font-bold">Exercises</h1>
      <div className="flex-1">
        <div className="flex items-center">
          <Input
            icon={<SearchIcon className="w-4 h-4" />}
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Pagination
            className="ml-auto"
            currentPage={data?.meta.currentPage || 1}
            limit={limit}
            limitOptions={[10, 20, 50]}
            totalPages={Math.ceil(
              (data?.meta.total || 0) / (data?.meta.perPage || 1),
            )}
            lastPage={data?.meta.lastPage || 1}
            onPrevious={() => setPage(page - 1)}
            onNext={() => setPage(page + 1)}
            onLimitChange={(newLimit) => setLimit(newLimit)}
          />
        </div>
        <ExerciseTable exercises={exercises} isLoading={isLoading} />
      </div>
    </div>
  )
}
