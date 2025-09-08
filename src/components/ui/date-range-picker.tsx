'use client'

import * as React from 'react'
import { format } from 'date-fns'
import { Calendar as CalendarIcon } from 'lucide-react'
import { DateRange } from 'react-day-picker'
import { useRouter, useSearchParams } from 'next/navigation'
import { ar } from 'date-fns/locale/ar'
import { enUS } from 'date-fns/locale'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

interface DateRangePickerProps {
  className?: string
  from?: Date | null
  to?: Date | null
  placeholder?: string
}

export function DateRangePicker({
  className,
  from: initialFrom,
  to: initialTo,
  placeholder = 'Select date range',
}: DateRangePickerProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isOpen, setIsOpen] = React.useState(false)
  const [date, setDate] = React.useState<DateRange | undefined>(
    initialFrom && initialTo
      ? { from: initialFrom, to: initialTo }
      : undefined
  )

  const handleSelect = (range: DateRange | undefined) => {
    setDate(range)
    
    if (range?.from && range?.to) {
      const params = new URLSearchParams(searchParams.toString())
      params.set('from', format(range.from, 'yyyy-MM-dd'))
      params.set('to', format(range.to, 'yyyy-MM-dd'))
      router.push(`?${params.toString()}`)
      setIsOpen(false)
    }
  }

  return (
    <div className={cn('grid gap-2', className)}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={'outline'}
            className={cn(
              'w-[300px] justify-start text-left font-normal',
              !date && 'text-muted-foreground'
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, 'LLL dd, y')} -{' '}
                  {format(date.to, 'LLL dd, y')}
                </>
              ) : (
                format(date.from, 'LLL dd, y')
              )
            ) : (
              <span>{placeholder}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={handleSelect}
            numberOfMonths={2}
            locale={document.documentElement.lang === 'ar' ? ar : enUS}
            dir={document.documentElement.dir}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
