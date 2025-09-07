'use client'

import * as React from 'react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ChevronUp } from 'lucide-react'
import { useTranslations } from 'next-intl'

interface Option {
  label: string
  value: string
}

interface MultiSelectProps {
  options: Option[]
  placeholder?: string
  value?: string[]
  onChange?: (value: string[]) => void
  disabled?: boolean
}

export function MultiSelect({ options, value = [], onChange, disabled = false }: MultiSelectProps) {
  const t = useTranslations('multiSelect')
  const [open, setOpen] = React.useState(false)
  //   const [selectedValues, setSelectedValues] = React.useState<string[]>([])

  const getOptionLabel = (value: string) => {
    const option = options.find((option) => option.value === value)
    return option ? option.label : value
  }

  return (
    <div>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild disabled={disabled}>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            {value && value.length > 0 ? (
              <div className="flex max-w-[230px] flex-wrap gap-1">
                {value.length <= 1 ? (
                  value.map((value) => (
                    <Badge variant="secondary" key={value} className="mr-1">
                      {getOptionLabel(value)}
                    </Badge>
                  ))
                ) : (
                  <>
                    <Badge variant="secondary">
                      {value.length} {t('selected')}
                    </Badge>
                  </>
                )}
              </div>
            ) : (
              t('placeholder')
            )}
            <ChevronUp
              size={16}
              className={cn(
                'transform text-neutral-500 transition-transform',
                open ? '' : 'rotate-180'
              )}
            />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder={t('search')} />
            <CommandEmpty>{t('noResults')}</CommandEmpty>
            <CommandList>
              <ScrollArea className="h-[200px]">
                <CommandGroup>
                  {options.map((option) => {
                    const isSelected = value.includes(option.value)
                    return (
                      <CommandItem
                        key={option.value}
                        onSelect={() => {
                          if (onChange) {
                            if (isSelected) {
                              onChange(value.filter((v) => v !== option.value))
                            } else {
                              onChange([...value, option.value])
                            }
                          }
                        }}
                      >
                        <div className="mr-2 flex items-center gap-2">
                          <Checkbox
                            checked={isSelected}
                            className={cn('mr-2', isSelected ? 'opacity-100' : 'opacity-40')}
                          />
                        </div>
                        {option.label}
                      </CommandItem>
                    )
                  })}
                </CommandGroup>
              </ScrollArea>
            </CommandList>
            {value.length > 0 && (
              <>
                <CommandSeparator />
                <div className="p-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => onChange!([])}
                  >
                    {t('clear')}
                  </Button>
                </div>
              </>
            )}
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}
