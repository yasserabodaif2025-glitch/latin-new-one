'use client'

import React, { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { ILecture } from './lecture.interface'
import { toast } from 'sonner'

interface AttendanceModalProps {
  isOpen: boolean
  onClose: () => void
  lecture: ILecture | null
}

interface StudentAttendance {
  studentId: number
  name: string
  phone: string
  isPresent: boolean
  notes: string
  email: string
}

export const AttendanceModal = ({ isOpen, onClose, lecture }: AttendanceModalProps) => {
  const [students, setStudents] = useState<StudentAttendance[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (lecture && isOpen) {
      // محاكاة بيانات الطلاب - يجب استبدالها بـ API call حقيقي
      const mockStudents: StudentAttendance[] = [
        { studentId: 1, name: 'أحمد محمد', phone: '01234567890', email: 'ahmed@example.com', isPresent: true, notes: '' },
        { studentId: 2, name: 'فاطمة علي', phone: '01234567891', email: 'fatima@example.com', isPresent: true, notes: '' },
        { studentId: 3, name: 'محمد حسن', phone: '01234567892', email: 'mohamed@example.com', isPresent: false, notes: 'غائب بعذر' },
        { studentId: 4, name: 'نور الدين', phone: '01234567893', email: 'nour@example.com', isPresent: true, notes: '' },
      ]
      setStudents(mockStudents)
    }
  }, [lecture, isOpen])

  const handleAttendanceChange = (studentId: number, isPresent: boolean) => {
    setStudents(prev => 
      prev.map(student => 
        student.studentId === studentId 
          ? { ...student, isPresent }
          : student
      )
    )
  }

  const handleNotesChange = (studentId: number, notes: string) => {
    setStudents(prev => 
      prev.map(student => 
        student.studentId === studentId 
          ? { ...student, notes }
          : student
      )
    )
  }

  const handleSaveAttendance = async () => {
    setIsLoading(true)
    try {
      // هنا يجب إضافة API call لحفظ الغياب
      console.log('💾 Saving attendance for lecture:', lecture?.id)
      console.log('📋 Students attendance:', students)
      
      // محاكاة API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast.success('تم حفظ الغياب بنجاح')
      onClose()
    } catch (error) {
      console.error('❌ Error saving attendance:', error)
      toast.error('فشل في حفظ الغياب')
    } finally {
      setIsLoading(false)
    }
  }

  const presentCount = students.filter(s => s.isPresent).length
  const absentCount = students.length - presentCount

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            أخذ الغياب
          </DialogTitle>
          <DialogDescription asChild>
            {lecture && (
              <div className="space-y-2 text-sm">
                <div><strong>المجموعة:</strong> {lecture.groupName}</div>
                <div><strong>المدرس:</strong> {lecture.instructorName}</div>
                <div><strong>القاعة:</strong> {lecture.roomName}</div>
                <div><strong>التوقيت:</strong> {new Date(lecture.startTime).toLocaleString('ar-SA')}</div>
              </div>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* إحصائيات سريعة */}
          <div className="flex gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{presentCount}</div>
              <div className="text-sm text-gray-600">حاضر</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{absentCount}</div>
              <div className="text-sm text-gray-600">غائب</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{students.length}</div>
              <div className="text-sm text-gray-600">المجموع</div>
            </div>
          </div>

          {/* جدول الطلاب */}
          <div className="border rounded-lg overflow-hidden">
            <div className="bg-gray-50 p-3 font-semibold border-b">
              قائمة الطلاب
            </div>
            <div className="space-y-2 p-3">
              {students.map((student) => (
                <div key={student.studentId} className="flex items-center gap-4 p-3 border rounded-lg">
                  <Checkbox
                    checked={student.isPresent}
                    onCheckedChange={(checked) => 
                      handleAttendanceChange(student.studentId, checked as boolean)
                    }
                  />
                  <div className="flex-1">
                    <div className="font-medium">{student.name}</div>
                    <div className="text-sm text-gray-600">{student.phone}</div>
                  </div>
                  <div className="flex-1">
                    <Input
                      placeholder="ملاحظات"
                      value={student.notes}
                      onChange={(e) => handleNotesChange(student.studentId, e.target.value)}
                      className="text-sm"
                    />
                  </div>
                  <div className="text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      student.isPresent 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {student.isPresent ? 'حاضر' : 'غائب'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* أزرار الحفظ والإلغاء */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={onClose} disabled={isLoading}>
              إلغاء
            </Button>
            <Button onClick={handleSaveAttendance} disabled={isLoading}>
              {isLoading ? 'جاري الحفظ...' : 'حفظ الغياب'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
