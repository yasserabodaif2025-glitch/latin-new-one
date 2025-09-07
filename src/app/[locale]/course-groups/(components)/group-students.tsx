'use client'

import { useRef, useState } from 'react'
import { useStudents } from '../../students/(components)/useStudents'
import { Input } from '@/components/ui/input'
import { useTranslations } from 'next-intl'
import { GroupStudentsTable } from './group-students-table'
import { useClickaway } from '@/lib/hooks/useClickaway'

type CourseGroupStudentsProps = {
  selectedStudents: number[]
  setSelectedStudents: (studentIds: number[]) => void
  maxStudents?: number
  disabled?: boolean
}

export const CourseGroupStudents = ({
  selectedStudents,
  setSelectedStudents,
  maxStudents,
  disabled,
}: CourseGroupStudentsProps) => {
  const { students } = useStudents()
  const suggestionsRef = useRef<HTMLDivElement>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const t = useTranslations('student')

  useClickaway(suggestionsRef, () => setShowSuggestions(false))

  const filteredStudents = students?.filter(
    (student) =>
      (student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.applicationId.toString().includes(searchTerm) ||
        student.phone.includes(searchTerm) ||
        student.email.includes(searchTerm)) &&
      !selectedStudents.includes(student.id)
  )

  const handleSelectStudent = (studentId: number) => {
    setSelectedStudents([...selectedStudents, studentId])
    setSearchTerm('')
    // setShowSuggestions(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // e.preventDefault()
    if (e.key === 'Enter' && filteredStudents && filteredStudents.length > 0) {
      e.stopPropagation()
      handleSelectStudent(filteredStudents[0].id)
    }
    if (e.key === 'Escape') {
      setShowSuggestions(false)
    }
  }

  const handleRemoveStudent = (studentId: number) => {
    setSelectedStudents(selectedStudents.filter((id) => id !== studentId))
  }

  const selectedStudentsData = students?.filter((student) => selectedStudents.includes(student.id))

  return (
    <div className="space-y-4">
      {!disabled && (
        <div className="flex items-center justify-between gap-x-8">
          <div className="relative grow" ref={suggestionsRef}>
            <Input
              type="text"
              value={searchTerm}
              disabled={disabled}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                setShowSuggestions(true)
              }}
              onKeyDown={handleKeyDown}
              onFocus={() => {
                setSearchTerm('')
                setShowSuggestions(true)
              }}
              placeholder={t('search')}
              className="w-full"
            />

            {showSuggestions && (
              <div className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md border bg-white shadow-lg">
                {filteredStudents?.slice(0, 10).map((student) => (
                  <div
                    key={student.id}
                    className="cursor-pointer px-4 py-2 hover:bg-gray-100"
                    onClick={() => handleSelectStudent(student.id)}
                  >
                    {student.name}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="text-sm text-gray-500">
            {selectedStudents.length} / {maxStudents}
          </div>
        </div>
      )}

      <GroupStudentsTable
        disabled={disabled}
        data={selectedStudentsData || []}
        onDelete={handleRemoveStudent}
      />
    </div>
  )
}
