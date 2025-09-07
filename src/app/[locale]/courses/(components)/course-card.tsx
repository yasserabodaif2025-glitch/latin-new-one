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
import { ICourse } from './course.interface'
import { Pencil, Trash, BookOpen, Clock, ChevronDown, Eye } from 'lucide-react'
import { routes } from '@/lib/const/routes.enum'
import { Link } from '@/i18n/routing'
import { useTranslations } from 'next-intl'
import { Badge } from '@/components/ui/badge'
export function CourseCard({ course, idx }: { course: ICourse; idx: number }) {
  const t = useTranslations('course')
  const [isOpen, setIsOpen] = useState(false)
  console.log({ course })
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            <CardTitle>{course.name}</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Link href={`${routes.courses}/${routes.edit}/${course.id}`}>
              <Button variant="ghost" size="icon">
                <Pencil className="h-4 w-4 text-muted-foreground" />
              </Button>
            </Link>
            <Link href={`${routes.courses}/${routes.delete}/${course.id}`}>
              <Button variant="ghost" size="icon">
                <Trash className="h-4 w-4 text-destructive" />
              </Button>
            </Link>
            <Link href={`${routes.courses}/${course.id}`}>
              <Button variant="ghost" size="icon">
                <Eye className="h-4 w-4 text-muted-foreground" />
              </Button>
            </Link>
          </div>
        </div>
        <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs">
          <div className="flex items-center">
            <Badge className="bg-zinc-200 text-zinc-800 hover:bg-zinc-300 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700">
              CRS{course.id.toString().padStart(3, '0')}
            </Badge>
          </div>
          <div className="flex items-center">
            <Badge className="bg-indigo-200 text-indigo-800 hover:bg-indigo-300 dark:bg-indigo-800 dark:text-indigo-200 dark:hover:bg-indigo-700">
              {course.categoryName}
            </Badge>
          </div>
          <div className="flex items-center">
            <Badge className="bg-green-200 text-green-800 hover:bg-green-300 dark:bg-green-800 dark:text-green-200 dark:hover:bg-green-700">
              {course.levels.reduce((acc, l) => acc + l.sessionsCount, 0)} {t('session')}
            </Badge>
          </div>
          <div className="flex items-center">
            <Badge className="bg-red-200 text-red-800 hover:bg-red-300 dark:bg-red-800 dark:text-red-200 dark:hover:bg-red-700">
              {course.levels.reduce((acc, l) => acc + l.price, 0)} {t('pound')}
            </Badge>
          </div>
        </div>
        <p className="mt-2 text-sm">{course.description}</p>
      </CardHeader>
      <CardContent className="pb-1 pt-0">
        <div className="border-b">
          <h3
            className="flex cursor-pointer items-center justify-between py-2 text-sm font-medium hover:bg-neutral-50 hover:text-primary"
            onClick={() => setIsOpen(!isOpen)}
          >
            <span>
              {t('levels')} ({course.levels.length})
            </span>
            <ChevronDown
              className={`h-4 w-4 shrink-0 transition-transform duration-200 ${
                isOpen ? 'rotate-180' : ''
              }`}
            />
          </h3>
          <div
            className={`overflow-hidden transition-all duration-300 ${
              isOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('code')}</TableHead>
                    <TableHead>{t('courseLevelName')}</TableHead>
                    <TableHead>{t('sessionsCount')}</TableHead>
                    <TableHead>{t('duration')}</TableHead>
                    <TableHead>{t('price')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {course.levels.map((level, idx) => (
                    <TableRow key={level.id}>
                      <TableCell className="font-medium">
                        CRS{course.id.toString().padStart(3, '0')}-{idx + 1}
                      </TableCell>
                      <TableCell>
                        {t('courseLevelName')} {idx + 1}
                      </TableCell>
                      <TableCell>
                        {level.sessionsCount ?? 0} {t('session')}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          <span>
                            {level.sessionsDiortion ?? 0} {t('hours')}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {level.price ?? 0} {t('pound')}
                      </TableCell>
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
