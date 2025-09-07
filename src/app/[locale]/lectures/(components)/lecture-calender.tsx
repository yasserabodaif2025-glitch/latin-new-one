'use client'

import { useHoursList } from '@/lib/hooks/useHoursList'
import { Link } from '@/i18n/routing'
import { routes } from '@/lib/const/routes.enum'
import { TodaySessions } from './lecture.interface'
import Image from 'next/image'
import noLectures from '@/assets/no-lecture.jpg'
import { motion } from 'framer-motion'

export const LectureCalender = ({ sessions }: { sessions: TodaySessions[] }) => {
  // Get unique rooms from sessions
  const rooms = Array.from(new Set(sessions.map((s) => s.room)))
  // Generate 30-min interval times (8:00 AM to 11:00 PM)
  const hours = useHoursList({
    startHour: 6,
    endHour: 5.3,
    intervalMinutes: 30,
  })

  // Helper: Find session for a given room and time
  const findSession = (room: string, time: string) => {
    return sessions.find((s) => {
      const sessionHour = time.replace(/(\d{2}):(\d{2}) (AM|PM)/, (_, hours, minutes, period) => {
        let hour = parseInt(hours)
        if (period === 'PM' && hour !== 12) hour += 12
        if (period === 'AM' && hour === 12) hour = 0
        return `${hour.toString().padStart(2, '0')}:${minutes}`
      })

      const sessionStartTime = s.startTime
      const sessionEndTime = s.endTime

      return s.room === room && sessionHour >= sessionStartTime && sessionHour <= sessionEndTime

      return s.room === room && s.startTime === sessionHour
    })
  }

  return (
    <div className="mt-4 flex w-full flex-grow flex-col">
      <div className="mb-2 flex items-center justify-between gap-2 overflow-hidden">
        <motion.h2
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-lg font-semibold"
        >
          جدول المحاضرات اليومي
        </motion.h2>
        <motion.span
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-sm text-gray-500"
        >
          {new Date().toLocaleDateString()}
        </motion.span>
      </div>
      {sessions.length > 0 ? (
        <div className="flex w-full flex-col gap-2 overflow-x-auto rounded-lg border bg-white shadow">
          <table className="w-full min-w-max border-separate border-spacing-0">
            <thead className="border-b bg-zinc-50">
              <tr>
                <th className="sticky left-0 z-10 min-w-24 bg-zinc-50 p-3 text-center text-xs font-bold text-zinc-500">
                  الوقت
                </th>
                {rooms.map((room) => (
                  <th
                    key={room}
                    className="min-w-40 p-3 text-center text-xs font-bold text-zinc-500"
                  >
                    {room}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {hours.map((hour, rowIdx) => (
                <tr key={hour} className="border-b hover:bg-zinc-50">
                  <td className="sticky left-0 z-10 border-r bg-white p-3 text-center font-mono text-xs text-zinc-600">
                    {hour}
                  </td>
                  {rooms.map((room) => {
                    const session = findSession(room, hour)
                    return (
                      <td key={room} className="p-2 text-center align-middle">
                        {session ? (
                          <Link
                            href={`/${routes.lectures}/${routes.edit}/${session.id}`}
                            className="block rounded-md border border-zinc-200 bg-zinc-100 px-2 py-1 text-xs text-zinc-700 shadow-sm transition-all hover:border-primary hover:bg-primary/10"
                          >
                            <div className="text-sm font-semibold text-primary">
                              {session.course}
                            </div>
                            <div className="text-zinc-600">{session.instructor}</div>
                            <div className="mt-1 flex flex-col gap-0.5">
                              <span className="text-[11px] text-zinc-500">
                                المجموعة: {session.group}
                              </span>
                              <span className="text-[11px] text-zinc-500">
                                المستوى: {session.level}
                              </span>
                            </div>
                          </Link>
                        ) : null}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.75 }}
          className="flex w-full flex-1 flex-col items-center justify-center gap-2 overflow-x-auto rounded-lg border bg-white shadow"
        >
          <div className="flex flex-col items-center justify-center gap-2">
            <motion.p
              initial={{ opacity: 0, y: -100 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-sm font-semibold text-gray-500"
            >
              لا يوجد محاضرات اليوم
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Image src={noLectures} alt="no lectures" width={300} height={300} />
            </motion.div>
          </div>
        </motion.div>
      )}
    </div>
  )
}
