'use client'

import * as React from 'react'
import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar, CalendarProps } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

interface DatePickerProps {
  value?: Date | undefined
  onChange?: (date: Date | undefined) => void
  btnClassName?: string
  isRTL?: boolean
}

export function DatePicker({
  value,
  onChange,
  className,
  btnClassName,
  isRTL = false,
  ...calenderProps
}: DatePickerProps & CalendarProps) {
  return (
    <div className={className}>
      <Popover>
        <PopoverTrigger disabled={!!calenderProps.disabled} asChild>
          <Button
            disabled={!!calenderProps.disabled}
            variant={'outline'}
            className={cn(
              'w-[240px] justify-start text-left font-normal',
              !value && 'text-muted-foreground',
              btnClassName,
              isRTL && 'flex-row-reverse'
            )}
          >
            <CalendarIcon className={cn(isRTL && 'ml-2')} />
            {value ? format(value, 'PPP') : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align={isRTL ? 'end' : 'start'}>
          <Calendar
            {...calenderProps}
            mode="single"
            selected={value}
            onSelect={onChange}
            initialFocus
            isRTL={isRTL}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
