'use client'
import React, { useEffect, useState } from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { useTranslations } from 'next-intl'
import { routes } from '@/lib/const/routes.enum'
import { AppTable } from '@/components/table/app-table'
import { getLabs } from '../../labs/lab.action'
import { ILab } from '../../labs/(components)'
import { useSelectedBranch } from '@/lib/hooks/useSelectedBranch'
import { Input } from '@/components/ui/input'
import { AttendanceModal } from './attendance-modal'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ILecture } from './lecture.interface'

type Props = {
  data: ILecture[]
}

export const LectureTable = ({ data }: Props) => {
  const [rooms, setRooms] = useState<ILab[]>([])
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [attendanceModal, setAttendanceModal] = useState<{ isOpen: boolean; lecture: ILecture | null }>({
    isOpen: false,
    lecture: null
  })
  const selectedBranchId = useSelectedBranch()
  const t = useTranslations('lecture')

  useEffect(() => {
    const fetchRooms = async () => {
      const res = await getLabs()
      let filteredRooms = res.data
      
      // تصفية القاعات حسب الفرع المحدد
      if (selectedBranchId && selectedBranchId > 0) {
        filteredRooms = res.data.filter((room: ILab) => room.branchId === selectedBranchId)
        console.log('🏢 Rooms filtered by branch in lecture table:', {
          branchId: selectedBranchId,
          totalRooms: res.data.length,
          filteredRooms: filteredRooms.length,
          rooms: filteredRooms.map(r => ({ id: r.id, name: r.name, branchId: r.branchId }))
        })
      }
      
      setRooms(filteredRooms)
    }
    fetchRooms()
  }, [selectedBranchId])

  useEffect(() => {
    console.log('========= All Lectures =========')
    console.log('Total lectures received:', data.length)
    console.log('Selected date:', selectedDate)
    
    if (data.length === 0) {
      console.log('⚠️ No lectures data received!')
      return
    }
    
    data.forEach((lecture, index) => {
      console.log(`Lecture ${index + 1}:`, {
        id: lecture.id,
        startTime: lecture.startTime,
        groupName: lecture.groupName,
        roomId: lecture.roomId,
        instructorName: lecture.instructorName,
        parsedDate: new Date(lecture.startTime).toISOString().split('T')[0], // Use ISO format instead of locale-dependent format
        formattedDateTime: new Date(lecture.startTime).toLocaleString('en-US', {
          dateStyle: 'full',
          timeStyle: 'long',
        }),
      })
    })
    console.log('================================')
  }, [data, selectedDate])

  const lecturesForSelectedDate = data.filter((lecture) => {
    try {
      // التاريخ المحدد من قبل المستخدم
      const selectedDateTime = new Date(selectedDate + 'T00:00:00')
      const selectedYear = selectedDateTime.getFullYear()
      const selectedMonth = selectedDateTime.getMonth()
      const selectedDay = selectedDateTime.getDate()

      // تاريخ المحاضرة - معالجة التنسيقات المختلفة
      let lectureDateTime: Date
      
      // إذا كان التاريخ نص، حوله إلى Date
      if (typeof lecture.startTime === 'string') {
        // إذا كان التاريخ يحتوي على T، فهو ISO format
        if (lecture.startTime.includes('T')) {
          lectureDateTime = new Date(lecture.startTime)
        } else {
          // إذا كان تاريخ فقط، أضف الوقت
          lectureDateTime = new Date(lecture.startTime + 'T00:00:00')
        }
      } else {
        lectureDateTime = new Date(lecture.startTime)
      }
      
      const lectureYear = lectureDateTime.getFullYear()
      const lectureMonth = lectureDateTime.getMonth()
      const lectureDay = lectureDateTime.getDate()

      // تحويل التواريخ إلى نص للمقارنة المباشرة
      const selectedDateStr = `${selectedYear}-${(selectedMonth + 1).toString().padStart(2, '0')}-${selectedDay.toString().padStart(2, '0')}`
      const lectureDateStr = `${lectureYear}-${(lectureMonth + 1).toString().padStart(2, '0')}-${lectureDay.toString().padStart(2, '0')}`
      
      // مقارنة التواريخ بطرق متعددة
      const dateMatches = selectedDateStr === lectureDateStr
      const componentMatches = lectureYear === selectedYear && lectureMonth === selectedMonth && lectureDay === selectedDay

      // تسجيل مفصل لكل محاضرة
      console.log(`🔍 Lecture ${lecture.id} comparison:`, {
        lecture: {
          id: lecture.id,
          groupName: lecture.groupName,
          startTime: lecture.startTime,
          startTimeType: typeof lecture.startTime,
          parsedDate: lectureDateStr,
          dateTimeValid: !isNaN(lectureDateTime.getTime()),
          components: { year: lectureYear, month: lectureMonth + 1, day: lectureDay }
        },
        selected: {
          input: selectedDate,
          parsedDate: selectedDateStr,
          components: { year: selectedYear, month: selectedMonth + 1, day: selectedDay }
        },
        comparison: {
          stringMatch: dateMatches,
          componentMatch: componentMatches,
          finalResult: dateMatches || componentMatches
        }
      })

      return dateMatches || componentMatches
    } catch (error) {
      console.error('❌ Error comparing dates for lecture:', lecture.id, error)
      return false
    }
  })

  console.log(`📊 Date filtering results:`)
  console.log(`   Total lectures: ${data.length}`)
  console.log(`   Selected date: ${selectedDate}`)
  console.log(`   Filtered lectures: ${lecturesForSelectedDate.length}`)
  
  if (lecturesForSelectedDate.length === 0 && data.length > 0) {
    console.log('⚠️ No lectures found for selected date. Available dates in data:')
    const availableDates = [...new Set(data.map(lecture => {
      let date: Date
      if (typeof lecture.startTime === 'string') {
        if (lecture.startTime.includes('T')) {
          date = new Date(lecture.startTime)
        } else {
          date = new Date(lecture.startTime + 'T00:00:00')
        }
      } else {
        date = new Date(lecture.startTime)
      }
      return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`
    }))].sort()
    console.log('   Available dates:', availableDates)
    console.log('   Raw startTime values:', data.map(l => ({ id: l.id, startTime: l.startTime, type: typeof l.startTime })))
  }

  // Generate time slots from 10:00 to 22:00 with 1.5 hour intervals
  const timeSlots = Array.from({ length: 9 }, (_, i) => {
    const hour = 10 + Math.floor(i * 1.5)
    const minutes = (i % 2) * 30
    return `${hour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
  })

  // حساب ترتيب الجلسة في المجموعة
  const calculateSessionNumber = (lecture: ILecture) => {
    // جمع جميع محاضرات نفس المجموعة
    const groupLectures = data.filter(l => l.groupId === lecture.groupId)
    
    // ترتيب المحاضرات حسب التاريخ
    const sortedLectures = groupLectures.sort((a, b) => 
      new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
    )
    
    // العثور على ترتيب المحاضرة الحالية
    const sessionNumber = sortedLectures.findIndex(l => l.id === lecture.id) + 1
    const totalSessions = sortedLectures.length
    
    return { sessionNumber, totalSessions }
  }

  const findLecture = (time: string, roomId: number) => {
    console.log(`\nSearching for lecture at time: ${time}, roomId: ${roomId}`)
    console.log('Available lectures for this date:', lecturesForSelectedDate.length)

    const lecture = lecturesForSelectedDate.find((lecture) => {
      const lectureTime = new Date(lecture.startTime)
      // استخدم التوقيت المحلي بدلاً من UTC
      const lectureHour = lectureTime.getHours()
      const lectureMinutes = lectureTime.getMinutes()

      const [slotHour, slotMinutes] = time.split(':').map(Number)

      // حساب الدقائق الكلية
      const lectureTotalMinutes = lectureHour * 60 + lectureMinutes
      const slotStartMinutes = slotHour * 60 + slotMinutes
      const slotEndMinutes = slotStartMinutes + 90 // 1.5 hours = 90 minutes

      const timeMatches =
        lectureTotalMinutes >= slotStartMinutes && lectureTotalMinutes < slotEndMinutes
      const roomMatches = lecture.roomId === roomId

      console.log('Checking lecture:', {
        lectureId: lecture.id,
        groupName: lecture.groupName,
        startTime: lecture.startTime,
        parsedTime: `${lectureHour}:${lectureMinutes}`,
        lectureTotalMinutes,
        slotStartMinutes,
        slotEndMinutes,
        roomId: lecture.roomId,
        timeMatches,
        roomMatches,
      })

      return timeMatches && roomMatches
    })

    if (lecture) {
      console.log('Found matching lecture:', {
        id: lecture.id,
        groupName: lecture.groupName,
        startTime: lecture.startTime,
      })
    } else {
      console.log('No matching lecture found for this slot')
    }

    return lecture
  }

  return (
    <div>
      <div className="mb-4">
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium text-gray-700">{t('selectDate')}</label>
          <Input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-fit"
            dir="ltr" // Force LTR for date input
          />
        </div>
        {/* معلومات التشخيص */}
        <div className="mt-2 text-sm text-gray-600">
          <p>إجمالي المحاضرات: {data.length}</p>
          <p>المحاضرات في التاريخ المحدد: {lecturesForSelectedDate.length}</p>
          <p>التاريخ المحدد: {selectedDate}</p>
        </div>
      </div>
      <div
        className="grid border bg-white"
        style={{ gridTemplateColumns: `100px repeat(${rooms.length}, 1fr)` }}
      >
        {/* Header Row */}
        <div className="border bg-gray-50 p-2 font-bold">Time</div>
        {rooms.map((room) => (
          <div key={room.id} className="border bg-gray-50 p-2 text-center font-bold">
            {room.name}
          </div>
        ))}

        {/* Time Slot Rows */}
        {timeSlots.map((time) => (
          <React.Fragment key={time}>
            <div className="border bg-gray-50 p-2 font-bold">
              {new Date(`2000-01-01T${time}`).toLocaleTimeString('ar-SA', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
              })}
            </div>
            {rooms.map((room) => {
              const lecture = findLecture(time, room.id)
              return (
                <div
                  key={room.id}
                  className="relative h-24 border p-1"
                  style={{ minWidth: '150px' }}
                >
                  {lecture ? (
                    <div className="flex h-full flex-col justify-between rounded bg-blue-100 p-2 text-sm shadow">
                      <div className="space-y-1">
                        <button
                          onClick={() => setAttendanceModal({ isOpen: true, lecture })}
                          className="text-xs font-semibold text-blue-800 hover:text-blue-900 hover:underline cursor-pointer block text-right"
                        >
                          {lecture.groupName}
                        </button>
                        <div className="text-xs text-gray-700 text-right">
                          {(() => {
                            const { sessionNumber, totalSessions } = calculateSessionNumber(lecture)
                            return `محاضرة ${sessionNumber} من ${totalSessions}`
                          })()}
                        </div>
                        <div className="text-xs text-gray-600 text-right">
                          {lecture.instructorName}
                        </div>
                        <div className="text-xs text-gray-600 text-right">
                          {lecture.roomName}
                        </div>
                      </div>
                      <div className="text-left text-xs text-gray-500">
                        {new Date(lecture.startTime).toLocaleTimeString('ar-SA', {
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: true,
                        })}
                      </div>
                    </div>
                  ) : null}
                </div>
              )
            })}
          </React.Fragment>
        ))}
      </div>

      {/* نافذة أخذ الغياب */}
      <AttendanceModal
        isOpen={attendanceModal.isOpen}
        onClose={() => setAttendanceModal({ isOpen: false, lecture: null })}
        lecture={attendanceModal.lecture}
      />
    </div>
  )
}
