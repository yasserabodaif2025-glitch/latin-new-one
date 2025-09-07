'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Users, Calendar, BookOpen, GraduationCap, BarChart3, Clock } from 'lucide-react'
import { getGroupsReport, getLecturers, type GroupsReportData } from '../groups-report.action'

const formatDate = (dateString: string) => {
  if (!dateString) return 'غير محدد'
  return new Date(dateString).toLocaleDateString('ar-EG')
}

const getStatusBadge = (status: string) => {
  const statusMap = {
    'scheduled': { label: 'مجدولة', variant: 'secondary' as const },
    'in_progress': { label: 'قيد التنفيذ', variant: 'default' as const },
    'active': { label: 'نشطة', variant: 'default' as const },
    'completed': { label: 'مكتملة', variant: 'outline' as const },
    'cancelled': { label: 'ملغاة', variant: 'destructive' as const }
  }
  
  const statusInfo = statusMap[status as keyof typeof statusMap] || { label: status, variant: 'secondary' as const }
  
  return (
    <Badge variant={statusInfo.variant} className="text-xs">
      {statusInfo.label}
    </Badge>
  )
}

const getProgressPercentage = (completed: number, total: number) => {
  if (!total || total === 0) return 0
  return Math.round((completed / total) * 100)
}

export default function GroupsReport() {
  const [data, setData] = useState<GroupsReportData | null>(null)
  const [lecturers, setLecturers] = useState<{ id: number; name: string }[]>([])
  const [isLoading, setIsLoading] = useState(false)
  
  // فلاتر
  const [startDate, setStartDate] = useState(() => {
    const date = new Date()
    date.setMonth(date.getMonth() - 1)
    return date.toISOString().split('T')[0]
  })
  const [endDate, setEndDate] = useState(() => new Date().toISOString().split('T')[0])
  const [selectedStatus, setSelectedStatus] = useState<string>('')
  const [selectedLecturer, setSelectedLecturer] = useState<string>('')

  const loadReport = async () => {
    try {
      setIsLoading(true)
      const lecturerId = selectedLecturer ? Number(selectedLecturer) : undefined
      const result = await getGroupsReport(startDate, endDate, selectedStatus, lecturerId)
      setData(result)
    } catch (error) {
      console.error('فشل في جلب التقرير:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const loadLecturers = async () => {
    try {
      const result = await getLecturers()
      setLecturers(result)
    } catch (error) {
      console.error('فشل في جلب المحاضرين:', error)
    }
  }

  useEffect(() => {
    loadLecturers()
    loadReport()
  }, [])

  const handleFilter = () => {
    loadReport()
  }

  const resetFilters = () => {
    setSelectedStatus('')
    setSelectedLecturer('')
    const date = new Date()
    date.setMonth(date.getMonth() - 1)
    setStartDate(date.toISOString().split('T')[0])
    setEndDate(new Date().toISOString().split('T')[0])
  }

  return (
    <div className="space-y-4">
      {/* فلاتر */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm">
            <BarChart3 className="h-4 w-4" />
            فلترة تقرير المجموعات
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 items-end">
            <div className="space-y-1">
              <Label className="text-xs">من تاريخ</Label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="h-8 text-xs"
              />
            </div>
            
            <div className="space-y-1">
              <Label className="text-xs">إلى تاريخ</Label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="h-8 text-xs"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs">الحالة</Label>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue placeholder="جميع الحالات" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الحالات</SelectItem>
                  <SelectItem value="scheduled">مجدولة</SelectItem>
                  <SelectItem value="in_progress">قيد التنفيذ</SelectItem>
                  <SelectItem value="active">نشطة</SelectItem>
                  <SelectItem value="completed">مكتملة</SelectItem>
                  <SelectItem value="cancelled">ملغاة</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label className="text-xs">المحاضر</Label>
              <Select value={selectedLecturer} onValueChange={setSelectedLecturer}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue placeholder="جميع المحاضرين" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع المحاضرين</SelectItem>
                  {lecturers.map((lecturer) => (
                    <SelectItem key={lecturer.id} value={lecturer.id.toString()}>
                      {lecturer.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleFilter} disabled={isLoading} className="h-8 text-xs flex-1">
                {isLoading ? 'جاري التحميل...' : 'تطبيق'}
              </Button>
              <Button onClick={resetFilters} variant="outline" className="h-8 text-xs">
                إعادة ضبط
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {data && (
        <>
          {/* إحصائيات سريعة */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-600">إجمالي المجموعات</p>
                    <p className="text-lg font-bold">{data.totalGroups}</p>
                  </div>
                  <BookOpen className="h-5 w-5 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-600">المجموعات النشطة</p>
                    <p className="text-lg font-bold text-green-600">{data.activeGroups}</p>
                  </div>
                  <Users className="h-5 w-5 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-600">المجموعات المكتملة</p>
                    <p className="text-lg font-bold text-blue-600">{data.completedGroups}</p>
                  </div>
                  <GraduationCap className="h-5 w-5 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-600">المجموعات المجدولة</p>
                    <p className="text-lg font-bold text-orange-600">{data.scheduledGroups}</p>
                  </div>
                  <Calendar className="h-5 w-5 text-orange-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-600">إجمالي الطلاب</p>
                    <p className="text-lg font-bold text-purple-600">{data.totalStudents}</p>
                  </div>
                  <Users className="h-5 w-5 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* جدول المجموعات */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">تفاصيل المجموعات</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="text-xs">
                      <TableHead className="text-xs">اسم المجموعة</TableHead>
                      <TableHead className="text-xs">الكورس</TableHead>
                      <TableHead className="text-xs">المحاضر</TableHead>
                      <TableHead className="text-xs">الحالة</TableHead>
                      <TableHead className="text-xs">عدد الطلاب</TableHead>
                      <TableHead className="text-xs">التقدم</TableHead>
                      <TableHead className="text-xs">تاريخ البدء</TableHead>
                      <TableHead className="text-xs">تاريخ الانتهاء</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.groups.map((group) => {
                      const progress = getProgressPercentage(group.completedSessions, group.totalSessions)
                      return (
                        <TableRow key={group.id} className="text-xs">
                          <TableCell className="font-medium">{group.name}</TableCell>
                          <TableCell>{group.courseName}</TableCell>
                          <TableCell>{group.lecturerName}</TableCell>
                          <TableCell>{getStatusBadge(group.status)}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              {group.studentsCount}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="w-16 bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-blue-600 h-2 rounded-full" 
                                  style={{ width: `${progress}%` }}
                                ></div>
                              </div>
                              <span className="text-xs">{progress}%</span>
                            </div>
                          </TableCell>
                          <TableCell>{formatDate(group.startDate)}</TableCell>
                          <TableCell>{formatDate(group.endDate)}</TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
                
                {data.groups.length === 0 && (
                  <div className="text-center py-8 text-sm text-gray-500">
                    لا توجد مجموعات في الفترة المحددة
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {isLoading && (
        <div className="text-center py-8 text-sm text-gray-500">
          جاري تحميل التقرير...
        </div>
      )}
    </div>
  )
}