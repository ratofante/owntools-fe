import { createLazyFileRoute } from '@tanstack/react-router'
import { FunnelX, SearchIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useGetExercises } from '@/hooks/use-get-exercises'
import { useDebounce } from '@/hooks/use-debounce'
import { Pagination } from '@/components/pagination'
import { useExercisesTable } from '@/hooks/use-exercises-table'
import { ExerciseTable } from '@/components/exercises/exercises-table'
import { Input } from '@/components/ui/input'
import { BodyZonesMultipleSelect } from '@/components/body-zones/body-zones-multiple-select'
import { Button } from '@/components/ui/button'

export const Route = createLazyFileRoute('/app/exercises')({
  component: RouteComponent,
})

function RouteComponent() {
  const [search, setSearch] = useState<string>('')
  const {
    page,
    limit,
    setPage,
    setLimit,
    searchName,
    setSearchName,
    bodyZones,
    setBodyZones,
    hasFilters,
    clearFilters,
  } = useExercisesTable()
  const { data, isLoading } = useGetExercises({
    page: page,
    limit: limit,
    search: searchName,
    bodyZones: bodyZones,
  })
  const exercises = data?.data || []

  const debouncedSearchName = useDebounce(search, 500)

  useEffect(() => {
    setSearchName(debouncedSearchName)
  }, [debouncedSearchName])

  function handleBodyZonesChange(values: Array<string>) {
    console.log(values)
    setBodyZones(values)
  }

  return (
    <div className="flex-1 flex flex-col">
      <h1 className="text-2xl font-bold">Exercises</h1>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <Input
            icon={<SearchIcon className="w-4 h-4" />}
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <BodyZonesMultipleSelect
            className="max-w-3xs"
            values={bodyZones}
            onValuesChange={handleBodyZonesChange}
          />
          <Button
            variant="outline"
            size="icon"
            disabled={!hasFilters()}
            onClick={clearFilters}
          >
            <FunnelX className="w-4 h-4" />
          </Button>
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
