'use client'
import React, { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { ICourseGroup } from './course-group.interface'
import { Pencil, Trash, BookOpen, Clock, ChevronDown, Eye } from 'lucide-react'
import { routes } from '@/lib/const/routes.enum'
import { Link } from '@/i18n/routing'
import { useTranslations } from 'next-intl'
import { useGroupStatus } from './useGroupStatus'
import { useGroupDays } from './useGroupDays'

export function CourseGroupCard({ courseGroup, idx }: { courseGroup: ICourseGroup; idx: number }) {
  const t = useTranslations('courseGroup')
  const tLecture = useTranslations('lecture')
  const groupStatus = useGroupStatus()
  const groupDays = useGroupDays()
  const [isOpen, setIsOpen] = useState(false)
  // Helper to get status name
  const statusName = groupStatus.find((s) => s.id === courseGroup.statusId)?.name || ''
  // Helper to get days names
  const daysNames = courseGroup.daysArray
    .map((dayId) => groupDays.find((d) => d.id === dayId)?.name)
    .filter(Boolean)
    .join('، ')
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            <CardTitle>{courseGroup.name}</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Link href={`${routes.courseGroups}/${routes.edit}/${courseGroup.id}`}>
              <Button variant="ghost" size="icon">
                <Pencil className="h-4 w-4 text-muted-foreground" />
              </Button>
            </Link>
            <Link href={`${routes.courseGroups}/${routes.delete}/${courseGroup.id}`}>
              <Button variant="ghost" size="icon">
                <Trash className="h-4 w-4 text-destructive" />
              </Button>
            </Link>
            <Link href={`${routes.courseGroups}/${courseGroup.id}`}>
              <Button variant="ghost" size="icon">
                <Eye className="h-4 w-4 text-muted-foreground" />
              </Button>
            </Link>
          </div>
        </div>
        <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <div className="flex items-center">
            <span className="ml-1 font-medium">{t('code')}:</span> CRS
            {courseGroup.id.toString().padStart(3, '0')}
          </div>
          <div className="flex items-center">
            <span className="ml-1 font-medium">{t('name')}:</span> {courseGroup.name}
          </div>
          <div className="flex items-center">
            <span className="ml-1 font-medium">{t('startDate')}:</span> {courseGroup.startDate}
          </div>
          <div className="flex items-center">
            <span className="ml-1 font-medium">{t('endDate')}:</span> {courseGroup.endDate}
          </div>
          <div className="flex items-center">
            <span className="ml-1 font-medium">{t('status')}:</span> {statusName}
          </div>
          <div className="flex items-center">
            <span className="ml-1 font-medium">{t('lecturer')}:</span> {courseGroup.instructorName}
          </div>
          <div className="flex items-center">
            <span className="ml-1 font-medium">{t('level')}:</span> {courseGroup.levelId}
          </div>
          <div className="flex items-center">
            <span className="ml-1 font-medium">{t('lab')}:</span> {courseGroup.roomName}
          </div>
          <div className="flex items-center">
            <span className="ml-1 font-medium">{t('days')}:</span> {daysNames}
          </div>
          <div className="flex items-center">
            <span className="ml-1 font-medium">{t('startTime')}:</span> {courseGroup.startTime}
          </div>
          <div className="flex items-center">
            <span className="ml-1 font-medium">{t('endTime')}:</span> {courseGroup.endTime}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-1 pt-0">
        <div className="border-b">
          <h3
            className="flex cursor-pointer items-center justify-between py-2 text-sm font-medium hover:bg-neutral-50 hover:text-primary"
            onClick={() => setIsOpen(!isOpen)}
          >
            <span>
              {t('sessionsCount')} ({courseGroup.sessions.length})
            </span>
            <ChevronDown
              className={`h-4 w-4 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
            />
          </h3>
          <div
            className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}
          >
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('code')}</TableHead>
                    <TableHead>{t('lecturer')}</TableHead>
                    <TableHead>{t('lab')}</TableHead>
                    <TableHead>{t('startTime')}</TableHead>
                    <TableHead>{tLecture('notes')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {courseGroup.sessions.map((session) => (
                    <TableRow key={session.id}>
                      <TableCell>{session.id}</TableCell>
                      <TableCell>{session.instructorName}</TableCell>
                      <TableCell>{session.roomName}</TableCell>
                      <TableCell>
                        {session.startTime instanceof Date
                          ? new Date(session.startTime).toISOString().split('T')[0]
                          : session.startTime}
                      </TableCell>
                      <TableCell>{session.notes}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
