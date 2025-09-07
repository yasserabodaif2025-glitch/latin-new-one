import React, { useRef, useState } from 'react'
import { Textarea } from './textarea'
import { Button } from './button'
import { cn } from '@/lib/utils'

interface MessageTemplateInputProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'value' | 'onChange'> {
  value: string
  onChange: (value: string) => void
}

interface Placeholder {
  id: string
  label: string
  color: string
  backgroundColor: string
}

const PLACEHOLDERS: Placeholder[] = [
  {
    id: 'company',
    label: '@company',
    color: 'text-blue-700 hover:text-blue-800',
    backgroundColor: 'bg-blue-100/80 hover:bg-blue-100',
  },
  {
    id: 'lead',
    label: '@lead',
    color: 'text-emerald-700 hover:text-emerald-800',
    backgroundColor: 'bg-emerald-100/80 hover:bg-emerald-100',
  },
  {
    id: 'course',
    label: '@course',
    color: 'text-purple-700 hover:text-purple-800',
    backgroundColor: 'bg-purple-100/80 hover:bg-purple-100',
  },
]

export function MessageTemplateInput({ value, onChange, ...props }: MessageTemplateInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [selection, setSelection] = useState<{ start: number; end: number } | null>(null)
  const [showCursor, setShowCursor] = useState(false)

  // Handle selection
  const handleSelect = (e: React.SyntheticEvent<HTMLTextAreaElement>) => {
    const target = e.target as HTMLTextAreaElement
    setSelection({
      start: target.selectionStart,
      end: target.selectionEnd,
    })
  }

  return (
    <div className="space-y-2">
      {/* Placeholder Buttons */}
      <div className="flex flex-wrap gap-2">
        {!props.disabled &&
          PLACEHOLDERS.map((placeholder) => (
            <Button
              key={placeholder.id}
              type="button"
              variant="outline"
              size="sm"
              disabled={props.disabled}
              onClick={(e) => {
                onChange(value.trim() + ' ' + placeholder.label + ' ')
                e.currentTarget.blur()
                textareaRef.current?.focus()
              }}
              className={`${placeholder.backgroundColor} ${placeholder.color} border-0`}
            >
              {placeholder.label}
            </Button>
          ))}
      </div>

      {/* Textarea & Display Layer */}
      <div className="relative">
        <Textarea
          ref={textareaRef}
          value={value}
          onFocus={() => setShowCursor(true)}
          onBlur={() => setShowCursor(false)}
          onChange={(e) => onChange(e.target.value)}
          onSelect={handleSelect}
          className="relative z-10 min-h-[150px] text-sm opacity-0 disabled:opacity-0"
          {...props}
        />
        <div className="pointer-events-auto absolute inset-0 whitespace-pre-wrap break-words rounded-xl border p-3 text-sm">
          <DisplayContent value={value} selection={selection} showCursor={showCursor} />
        </div>
      </div>
    </div>
  )
}

const DisplayContent = ({
  value,
  selection,
  showCursor,
}: {
  value: string
  selection: { start: number; end: number } | null
  showCursor: boolean
}) => {
  const reservedWords = new Set(['@lead', '@company', '@course'])
  // Detect if the text contains Arabic
  const isArabic = /[\u0600-\u06FF]/.test(value.trim().charAt(0))
  const direction = isArabic ? 'rtl' : 'ltr'

  return (
    <div className="relative flex flex-wrap" dir={direction}>
      <div className="relative flex flex-wrap gap-1">
        {value.split(/\s+/).map((word, index) => {
          const startIndex = value.indexOf(word)
          const isSelected =
            selection && startIndex >= selection.start && startIndex + word.length <= selection.end

          return (
            <span
              key={index}
              className={cn(
                reservedWords.has(word)
                  ? 'rounded-lg bg-indigo-100 px-2 py-0.5 text-indigo-500'
                  : '',
                isSelected ? 'bg-blue-300' : ''
              )}
            >
              {word}
            </span>
          )
        })}

        {/* Cursor Effect */}
      </div>
      {showCursor && <span className="animate-blink text-gray-700">|</span>}
    </div>
  )
}
