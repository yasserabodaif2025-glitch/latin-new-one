'use client'

import * as React from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

type Props = {
  data: any[]
  placeholder?: string
  emptyMessage?: string
  selectedValue: string
  onSelect: (value: string) => void
}

export function Combobox({
  data,
  placeholder = '',
  emptyMessage = 'no data found',
  selectedValue,
  onSelect,
}: Props) {
  const [open, setOpen] = React.useState(false)
  // const [value, setValue] = React.useState('')

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {selectedValue ? data.find((item) => item.value === selectedValue)?.label : placeholder}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command className="w-full">
          <CommandInput placeholder={placeholder} className="h-9 w-full" />
          <CommandList>
            <CommandEmpty>{emptyMessage}</CommandEmpty>
            <CommandGroup className="w-full">
              {data.map((item) => (
                <CommandItem
                  key={item.value}
                  value={item.value}
                  className="w-full"
                  onSelect={(currentValue) => {
                    // setValue(currentValue ==s= value ? '' : currentValue)
                    onSelect?.(currentValue)
                    setOpen(false)
                  }}
                >
                  {item.label}
                  <Check
                    className={cn(
                      'ml-auto',
                      selectedValue === item.value ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
