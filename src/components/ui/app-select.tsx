import { cn } from '@/lib/utils'
import { useState, useRef, useEffect } from 'react'

interface Option {
  value: string | number
  label: string
}

interface AppSelectProps {
  options: Option[]
  value: string | number
  onChangeValue: (value: string | number) => void
  placeholder?: string
  className?: string
  isRTL?: boolean
}

export function AppSelect({
  options = [],
  value,
  onChangeValue,
  placeholder = 'Select an option',
  className,
  isRTL = false,
}: AppSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const selectRef = useRef<HTMLDivElement>(null)

  const selectedOption = options?.find((option) => option.value === value)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div
      ref={selectRef}
      className={cn('relative w-full', isRTL ? 'text-right' : 'text-left', className)}
    >
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'w-full rounded-md border bg-white px-3 py-2 text-sm',
          'flex items-center justify-between',
          'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
          isRTL ? 'flex-row-reverse' : 'flex-row'
        )}
      >
        <span className="truncate">{selectedOption ? selectedOption.label : placeholder}</span>
        <svg
          className={cn(
            '-mr-1 ml-2 h-4 w-4',
            isOpen && 'rotate-180 transform',
            isRTL && 'ml-0 mr-2'
          )}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div
          className={cn(
            'absolute z-10 mt-1 w-full rounded-md border bg-white shadow-lg',
            'max-h-60 overflow-auto'
          )}
        >
          {options?.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChangeValue(option.value)
                setIsOpen(false)
              }}
              className={cn(
                'w-full px-3 py-2 text-left text-sm hover:bg-gray-100',
                'focus:bg-gray-100 focus:outline-none',
                isRTL && 'text-right',
                option.value === value && 'bg-primary/10'
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
