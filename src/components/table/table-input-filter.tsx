'use client'
import { ArrowUpDown, FilterIcon } from 'lucide-react'
import React, { useEffect, useRef } from 'react'
import { Button } from '../ui/button'
import { Column } from '@tanstack/react-table'
import { Input } from '../ui/input'
import { createPortal } from 'react-dom'

interface Props {
  column: Column<any>
  header: string
  accessorKey: string
}

export const TableInputFilter = ({ column, header }: Props) => {
  const ref = useRef<HTMLDivElement>(null)
  const [position, setPosition] = React.useState({ x: 0, y: 0 })
  const [dimension, setDimension] = React.useState({ width: 0, height: 0 })
  const [value, setValue] = React.useState(column.getFilterValue() || '')
  const [showFilter, setShowFilter] = React.useState(false)

  useEffect(() => {
    column.setFilterValue(value)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  useEffect(() => {
    const handleWindowResize = () => {
      if (ref.current) {
        setPosition({
          x: ref.current.getBoundingClientRect().left,
          y: ref.current.getBoundingClientRect().top,
        })
        setDimension({
          width: ref.current.offsetWidth,
          height: ref.current.offsetHeight,
        })
      }
    }
    handleWindowResize()
    window.addEventListener('resize', handleWindowResize)
    return () => {
      window.removeEventListener('resize', handleWindowResize)
    }
  }, [ref])

  return (
    <div className="flex items-center px-2">
      <Button
        type="button"
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        {header}
        <ArrowUpDown />
      </Button>
      <div ref={ref} className="relative">
        <Button
          type="button"
          variant="ghost"
          size={'icon'}
          onClick={() => setShowFilter(!showFilter)}
        >
          <FilterIcon />
        </Button>
        {showFilter && (
          <PortalInputFilter
            showFilter={showFilter}
            setShowFilter={setShowFilter}
            onChange={(e) => {
              setValue(e.target.value)
            }}
            value={value as string}
            setValue={setValue}
            placeholder={`Filter ${header}`}
            position={position}
            dimension={dimension}
          />
        )}
      </div>
    </div>
  )
}

interface PortalInputFilterProps {
  showFilter: boolean
  setShowFilter: (show: boolean) => void
  value: string
  setValue: (value: string) => void
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder: string
  position: { x: number; y: number }
  dimension: { width: number; height: number }
}

const PortalInputFilter = ({
  showFilter,
  setShowFilter,
  value,
  setValue,
  onChange,
  placeholder,
  position: { x, y },
  dimension: { height },
}: PortalInputFilterProps) => {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current) {
        if (showFilter && !e.composedPath().includes(ref.current)) {
          setShowFilter(false)
        }
      }
    }

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowFilter(false)
      }
    }
    document.addEventListener('click', handleClick)
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('click', handleClick)
      document.removeEventListener('keydown', handleEscape)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showFilter, ref])
  return createPortal(
    <div
      ref={ref}
      style={{ top: y + height + 4, left: x }}
      className={`fixed z-10 flex w-96 -translate-x-1/2 items-center gap-2 rounded-lg bg-white p-4 shadow-2xl dark:border-gray-700 dark:bg-gray-800`}
    >
      <Input
        type="text"
        autoFocus
        value={value as string}
        onChange={onChange}
        className="w-full"
        placeholder={placeholder}
        onKeyDown={(e) => {
          e.stopPropagation()
          if (e.key === 'Enter' || e.key === 'Escape') {
            setShowFilter(false)
          }
        }}
      />
      <Button variant={'outline'} size={'sm'} className="px-8" onClick={() => setValue('')}>
        clear
      </Button>
    </div>,
    document.body
  )
}
