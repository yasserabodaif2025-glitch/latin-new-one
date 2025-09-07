'use client'

import React, { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { activateGroup } from '../course-group.action'
import { ICourseGroup } from './course-group.interface'
import { toast } from 'sonner'
import { motion } from 'framer-motion'
import { useTranslations, useLocale } from 'next-intl'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useRouter } from '@/i18n/routing'
import { routes } from '@/lib/const/routes.enum'

interface ActivateGroupModalProps {
  open: boolean
  onClose?: () => void
  group: ICourseGroup | null
  onActivated?: () => void
}

const SlidingNumber = ({ value }: { value: number }) => {
  return (
    <motion.span
      key={value}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="inline-block"
    >
      {value}
    </motion.span>
  )
}

export const ActivateGroupModal: React.FC<ActivateGroupModalProps> = ({
  onClose,
  group,
  onActivated,
}) => {
  const [open, setOpen] = React.useState(true)
  const router = useRouter()
  const t = useTranslations('activateGroupModal')
  const locale = useLocale()
  const isRTL = locale === 'ar'

  const [discounts, setDiscounts] = useState<Record<number, number>>({})
  const [loading, setLoading] = useState(false)
  const [animatedPrices, setAnimatedPrices] = useState<Record<number, number>>({})
  const [students, setStudents] = useState(group?.students || [])
  // const [addStudentId, setAddStudentId] = useState('')

  useEffect(() => {
    if (group) {
      setStudents(group.students)
      const initialPrices: Record<number, number> = {}
      group.students.forEach((student) => {
        initialPrices[student.id] = group.price
      })
      setAnimatedPrices(initialPrices)
      setDiscounts({})
    }
  }, [group])

  if (!group) return null

  const handleDiscountChange = (studentId: number, value: string) => {
    let num = parseInt(value, 10)
    if (isNaN(num) || num < 0) num = 0
    if (num > group.price) num = group.price
    setDiscounts((prev) => {
      const newDiscounts = { ...prev, [studentId]: num }
      const finalPrice = getFinalPrice(group.price, num)
      setAnimatedPrices((prev) => ({ ...prev, [studentId]: finalPrice }))
      return newDiscounts
    })
  }

  const getFinalPrice = (price: number, discount: number) => {
    return price - discount
  }

  // const handleRemoveStudent = (studentId: number) => {
  //   setStudents((prev) => prev.filter((s) => s.id !== studentId))
  //   setDiscounts((prev) => {
  //     const copy = { ...prev }
  //     delete copy[studentId]
  //     return copy
  //   })
  //   setAnimatedPrices((prev) => {
  //     const copy = { ...prev }
  //     delete copy[studentId]
  //     return copy
  //   })
  // }

  // const handleAddStudent = (studentId: string) => {
  //   const id = Number(studentId)
  //   const student = allStudents.find((s) => s.id === id)
  //   if (student && !students.some((s) => s.id === id)) {
  //     setStudents((prev) => [...prev, student])
  //     setAnimatedPrices((prev) => ({ ...prev, [id]: group.price }))
  //   }
  //   setAddStudentId('')
  // }

  const handleClose = () => {
    onClose?.()
    setOpen(false)
    router.push(`/${routes.courseGroups}`)
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const enrollments = students.map((student) => ({
        studentId: student.id,
        discount: discounts[student.id] || 0,
      }))
      await activateGroup({ groupId: group.id, enrollments })
      toast.success(t('activateGroup'), {
        description: t('studentsEnrolled', { count: students.length }),
      })
      onClose?.()
      onActivated?.()
      router.push(`/${routes.courseGroups}`)
    } catch (error) {
      console.error('Error activating group:', error)
      toast.error(t('activateGroup'), {
        description: t('activating'),
      })
    } finally {
      setLoading(false)
      setOpen(false)
      router.push(`/${routes.courseGroups}`)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        className={`max-w-6xl duration-300 animate-in fade-in-0 zoom-in-95 ${isRTL ? 'rtl' : ''}`}
      >
        <DialogHeader className={`border-b pb-4 ${isRTL ? 'text-right' : ''}`}>
          <DialogTitle className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-2xl font-bold text-transparent">
            {t('title', { name: group.name })}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Review student enrollments and set individual discounts before activating the course group.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-6 overflow-hidden rounded-xl border bg-card shadow-sm">
          <div className="flex flex-col gap-4 p-4"></div>
          <div className="max-h-[60vh] overflow-x-auto">
            <div className="min-w-full divide-y divide-border">
              <div
                className={`sticky top-0 z-10 border-b bg-muted/90 backdrop-blur-sm ${isRTL ? 'flex-row-reverse text-right' : ''}`}
              >
                <div
                  className={`grid grid-cols-7 px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground ${isRTL ? 'flex-row-reverse text-right' : ''}`}
                >
                  <div>{t('name')}</div>
                  <div>{t('phone')}</div>
                  <div>{t('sourceName')}</div>
                  <div>{t('price')}</div>
                  <div>{t('discount')}</div>
                  <div>{t('finalPrice')}</div>
                </div>
              </div>
              <div className="divide-y divide-border bg-card">
                {students.map((student, index) => {
                  const discount = discounts[student.id] || 0
                  const finalPrice = getFinalPrice(group.price, discount)
                  return (
                    <motion.div
                      key={student.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.05 }}
                      className={`grid grid-cols-7 items-center px-4 py-3 transition-colors ${
                        index % 2 === 0 ? 'bg-background' : 'bg-muted/20'
                      } hover:bg-accent/10 ${isRTL ? 'flex-row-reverse text-right' : ''}`}
                    >
                      <div className="flex items-center gap-2">
                        <Avatar className="h-7 w-7">
                          <AvatarFallback>{student.name?.slice(0, 2)}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium text-foreground">{student.name}</span>
                      </div>
                      <div className="text-sm text-muted-foreground">{student.phone}</div>
                      <div className="truncate text-sm text-muted-foreground">
                        {student.sourceName}
                      </div>
                      <div>
                        <Badge variant="outline" className="bg-background/50">
                          {group.price}
                        </Badge>
                      </div>
                      <div>
                        <div className="relative w-24">
                          <Input
                            type="number"
                            max={group.price}
                            value={discount}
                            onChange={(e) => handleDiscountChange(student.id, e.target.value)}
                            className="h-8 rounded-lg border-input/60 pr-8 text-center focus-visible:ring-primary/20"
                            disabled={loading}
                            dir={isRTL ? 'rtl' : 'ltr'}
                          />
                        </div>
                      </div>
                      <div className="font-bold text-emerald-600 dark:text-emerald-500">
                        <SlidingNumber value={animatedPrices[student.id] || finalPrice} />
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
        <DialogFooter
          className={`mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-between ${isRTL ? 'flex-row-reverse text-right' : ''}`}
        >
          <div className="text-sm text-muted-foreground">
            {t('studentsEnrolled', { count: students.length })}
          </div>
          <div className={`flex gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={loading}
              className="h-10 min-w-[100px] text-sm font-medium transition-all hover:border-destructive/30 hover:bg-destructive/10 hover:text-destructive"
            >
              {t('cancel')}
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="h-10 min-w-[100px] text-sm font-medium shadow-md transition-all hover:shadow-lg"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="-ml-1 mr-2 h-4 w-4 animate-spin text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  {t('activating')}
                </span>
              ) : (
                t('activateGroup')
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
