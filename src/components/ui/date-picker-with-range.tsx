'use client'

import * as React from 'react'
import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import { DateRange, SelectRangeEventHandler } from 'react-day-picker'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { useLocale } from 'next-intl'

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  date: DateRange | undefined
  disabled?: boolean
  //   setDate: React.Dispatch<React.SetStateAction<DateRange | undefined>>;
  handleSelect: SelectRangeEventHandler | undefined
}

export function DatePickerWithRange({ date, handleSelect, ...rest }: Props) {
  const locale = useLocale()
  const isRTL = locale === 'ar'

  return (
    <div {...rest} className={cn('grid gap-2', rest.className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            disabled={rest.disabled}
            id="date"
            variant={'outline'}
            className={cn(
              'w-full justify-start text-left font-normal disabled:cursor-not-allowed',
              !date && 'text-muted-foreground',
              isRTL && 'flex-row-reverse text-right'
            )}
          >
            <CalendarIcon className={cn(isRTL && 'ml-2')} />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, 'LLL dd, y')} - {format(date.to, 'LLL dd, y')}
                </>
              ) : (
                format(date.from, 'LLL dd, y')
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align={isRTL ? 'end' : 'start'}>
          <Calendar
            disabled={rest.disabled}
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={handleSelect}
            numberOfMonths={2}
            className="w-full"
            isRTL={isRTL}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
