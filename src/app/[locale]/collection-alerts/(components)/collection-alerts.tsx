'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Search, Bell, UserCheck, UsersRound } from 'lucide-react'
import { IStudentBalance, ICollectionFilters } from './collection-alerts.interface'
import { getStudentsWithBalance, sendReminder } from '../collection-alerts.action'
import { toast } from 'sonner'

// دالة لتنسيق العملة
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('ar-EG', {
    style: 'currency',
    currency: 'EGP',
  }).format(amount)
}

// دالة لتنسيق التاريخ
const formatDate = (date: string | null) => {
  if (!date) return 'لم يتم السداد بعد'
  return new Date(date).toLocaleDateString('ar-EG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export default function CollectionAlerts() {
  const t = useTranslations('collectionAlerts')
  const [isLoading, setIsLoading] = useState(false)
  const [students, setStudents] = useState<IStudentBalance[]>([])
  const [filteredStudents, setFilteredStudents] = useState<IStudentBalance[]>([])
  const [filters, setFilters] = useState<ICollectionFilters>({})
  const [groups, setGroups] = useState<{ id: number; name: string }[]>([])
  const [totalDue, setTotalDue] = useState(0)

  // جلب البيانات
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const data = await getStudentsWithBalance()
        setStudents(data)
        setFilteredStudents(data)
        // حساب إجمالي المتأخرات
        const total = data.reduce(
          (sum: number, student: IStudentBalance) => sum + student.remainingBalance,
          0
        )
        setTotalDue(total)
      } catch (error) {
        toast.error('فشل في جلب البيانات')
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  // تطبيق الفلاتر
  useEffect(() => {
    let result = [...students]

    if (filters.studentName) {
      result = result.filter((student) =>
        student.studentName.toLowerCase().includes(filters.studentName!.toLowerCase())
      )
    }

    if (filters.groupId) {
      result = result.filter((student) => student.groupId === filters.groupId)
    }

    if (filters.minAmount) {
      result = result.filter((student) => student.remainingBalance >= filters.minAmount!)
    }

    if (filters.maxAmount) {
      result = result.filter((student) => student.remainingBalance <= filters.maxAmount!)
    }

    if (filters.dueDateFrom) {
      result = result.filter(
        (student) => new Date(student.dueDate) >= new Date(filters.dueDateFrom!)
      )
    }

    if (filters.dueDateTo) {
      result = result.filter((student) => new Date(student.dueDate) <= new Date(filters.dueDateTo!))
    }

    setFilteredStudents(result)
    const total = result.reduce((sum, student) => sum + student.remainingBalance, 0)
    setTotalDue(total)
  }, [filters, students])

  // إرسال تذكير للطالب
  const handleSendReminder = async (studentId: number) => {
    try {
      await sendReminder(studentId)
      toast.success('تم إرسال التذكير بنجاح')
    } catch {
      toast.error('فشل في إرسال التذكير')
    }
  }

  return (
    <div className="space-y-6">
      {/* إحصائيات عامة */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{formatCurrency(totalDue)}</div>
            <div className="mt-1 text-sm text-gray-500">إجمالي المتأخرات</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">{filteredStudents.length}</div>
            <div className="mt-1 text-sm text-gray-500">عدد الطلاب المتأخرين</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {formatCurrency(totalDue / filteredStudents.length || 0)}
            </div>
            <div className="mt-1 text-sm text-gray-500">متوسط المتأخرات</div>
          </CardContent>
        </Card>
      </div>

      {/* فلاتر البحث */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">فلترة النتائج</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label>اسم الطالب</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="بحث باسم الطالب..."
                  className="pl-8"
                  onChange={(e) => setFilters({ ...filters, studentName: e.target.value })}
                />
              </div>
            </div>
            <div>
              <Label>المجموعة</Label>
              <Select
                onValueChange={(value) =>
                  setFilters({ ...filters, groupId: value ? parseInt(value) : undefined })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر المجموعة" />
                </SelectTrigger>
                <SelectContent>
                  {groups.map((group) => (
                    <SelectItem key={group.id} value={group.id.toString()}>
                      {group.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>المبلغ المتأخر</Label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="من"
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      minAmount: e.target.value ? parseFloat(e.target.value) : undefined,
                    })
                  }
                />
                <Input
                  type="number"
                  placeholder="إلى"
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      maxAmount: e.target.value ? parseFloat(e.target.value) : undefined,
                    })
                  }
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* قائمة الطلاب */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg">قائمة الطلاب المتأخرين</CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setFilters({})
              setFilteredStudents(students)
            }}
          >
            إعادة ضبط الفلاتر
          </Button>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="py-8 text-center text-gray-500">جاري التحميل...</div>
          ) : filteredStudents.length > 0 ? (
            <div className="space-y-4">
              {filteredStudents.map((student) => (
                <div
                  key={student.studentId}
                  className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-gray-50"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <UserCheck className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">{student.studentName}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <UsersRound className="h-4 w-4" />
                      {student.groupName} - {student.courseName} ({student.levelName})
                    </div>
                    <div className="text-sm text-gray-500">
                      آخر سداد: {formatDate(student.lastPaymentDate)}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-red-600">
                      {formatCurrency(student.remainingBalance)}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="mt-2"
                      onClick={() => handleSendReminder(student.studentId)}
                    >
                      <Bell className="mr-1 h-4 w-4" />
                      إرسال تذكير
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-gray-500">لا يوجد طلاب متأخرين في السداد</div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
