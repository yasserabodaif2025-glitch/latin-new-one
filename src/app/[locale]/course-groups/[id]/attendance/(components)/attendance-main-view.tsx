'use client'

import { ICourseGroup } from '../../../(components)/course-group.interface'
import { ILecture, SessionStudent } from '../../../../lectures/(components)'

interface AttendanceMainViewProps {
  group: ICourseGroup
}

import { useState } from 'react'
import { updateSessionAttendance } from '../../../course-group.action'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Check, X } from 'lucide-react'

export const AttendanceMainView = ({ group }: AttendanceMainViewProps) => {
  const [sessions, setSessions] = useState(group.sessions)

  const handleAttendanceChange = (sessionId: number, studentId: number, isPresent: boolean) => {
    const updatedSessions = sessions.map((session) => {
      if (session.id === sessionId) {
        const updatedStudents = session.students.map((student: SessionStudent) => {
          if (student.studentId === studentId) {
            return { ...student, isPresent }
          }
          return student
        })
        return { ...session, students: updatedStudents }
      }
      return session
    })
    setSessions(updatedSessions)
  }

  const handleSaveChanges = async () => {
    try {
      for (const session of sessions) {
        const data = {
          ...session,
          sessionStudents: session.students.map((s: SessionStudent) => ({
            studentId: s.studentId,
            isPresent: s.isPresent,
            notes: s.notes,
          })),
        }
        await updateSessionAttendance(session.id, data)
      }
      toast.success('Attendance updated successfully')
    } catch (error) {
      toast.error('Failed to update attendance')
    }
  }

  return (
    <div className="p-4">
      <h1 className="mb-4 text-2xl font-bold">Attendance for {group.name}</h1>
      <div className="space-y-4">
        {sessions.map((session) => (
          <div key={session.id} className="rounded-lg border p-4">
            <h2 className="text-lg font-semibold">{`Session on ${
              new Date(session.startTime).toISOString().split('T')[0]
            }`}</h2>
            <ul className="mt-2 space-y-2">
              {session.students.map((student: SessionStudent) => (
                <li key={student.studentId} className="flex items-center justify-between">
                  <span>{student.studentName}</span>
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant={student.isPresent ? 'default' : 'outline'}
                      onClick={() => handleAttendanceChange(session.id, student.studentId, true)}
                    >
                      <Check className="size-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant={!student.isPresent ? 'destructive' : 'outline'}
                      onClick={() => handleAttendanceChange(session.id, student.studentId, false)}
                    >
                      <X className="size-4" />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="mt-4">
        <Button onClick={handleSaveChanges}>Save Changes</Button>
      </div>
    </div>
  )
}
