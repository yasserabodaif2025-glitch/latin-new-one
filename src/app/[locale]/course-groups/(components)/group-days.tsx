import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useGroupDays } from './useGroupDays'

type Props = {
  selectedDaysIds: number[]
  setSelectedDaysIds: (daysIds: number[]) => void
  disabled?: boolean
  days?: { id: number; name: string }[]
}

export const CourseGroupDays = ({ selectedDaysIds, setSelectedDaysIds, disabled, days }: Props) => {
  const groupDays = useGroupDays()
  const displayDays = days ?? groupDays
  return (
    <div className="flex flex-wrap gap-2">
      {displayDays?.map((day) => (
        <Button
          type="button"
          size={'sm'}
          key={day.id}
          variant={selectedDaysIds.includes(day.id) ? 'default' : 'outline'}
          disabled={disabled}
          onClick={() => {
            if (selectedDaysIds.includes(day.id)) {
              setSelectedDaysIds(selectedDaysIds.filter((id) => id !== day.id))
            } else {
              setSelectedDaysIds([...selectedDaysIds, day.id])
            }
          }}
          className={cn('capitalize')}
        >
          {day.name}
        </Button>
      ))}
    </div>
  )
}
