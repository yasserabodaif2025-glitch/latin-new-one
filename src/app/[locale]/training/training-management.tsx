'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Users, Clock, Filter, Search, AlertCircle, Eye, BarChart3 } from 'lucide-react'
import { DatePickerWithRange } from '@/components/ui/date-picker-with-range'
import { useTrainingManagement } from '@/lib/hooks/useTrainingManagement'
import { GroupDetailsModal, TrainingStatistics } from '@/components/training'
import { GroupSummaryResponse } from '@/lib/api/groups.service'

export default function TrainingManagement() {
  const {
    filteredGroups,
    statistics,
    statuses,
    instructors,
    loading,
    error,
    dateRange,
    selectedStatus,
    selectedInstructor,
    searchTerm,
    setDateRange,
    setSelectedStatus,
    setSelectedInstructor,
    setSearchTerm,
    clearFilters,
    refreshData,
  } = useTrainingManagement()

  const [selectedGroup, setSelectedGroup] = useState<GroupSummaryResponse | null>(null)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')

  const handleViewDetails = (group: GroupSummaryResponse) => {
    setSelectedGroup(group)
    setIsDetailsModalOpen(true)
  }

  const handleCloseDetails = () => {
    setSelectedGroup(null)
    setIsDetailsModalOpen(false)
  }

  const getStatusBadgeColor = (statusName: string) => {
    const status = statusName?.toLowerCase()
    if (status?.includes('نشط') || status?.includes('active')) return 'bg-green-100 text-green-800'
    if (status?.includes('مكتمل') || status?.includes('completed'))
      return 'bg-blue-100 text-blue-800'
    if (status?.includes('متوقف') || status?.includes('paused'))
      return 'bg-yellow-100 text-yellow-800'
    if (status?.includes('ملغي') || status?.includes('cancelled')) return 'bg-red-100 text-red-800'
    return 'bg-gray-100 text-gray-800'
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'غير محدد'
    return new Date(dateString).toLocaleDateString('ar-SA')
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-center">
          <AlertCircle className="mx-auto mb-4 h-12 w-12 text-red-500" />
          <p className="mb-4 text-red-600">{error}</p>
          <Button onClick={refreshData}>إعادة المحاولة</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">إدارة التدريب</h1>
        <Button onClick={refreshData} disabled={loading}>
          تحديث البيانات
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            نظرة عامة
          </TabsTrigger>
          <TabsTrigger value="statistics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            الإحصائيات المتقدمة
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <Users className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">إجمالي المجموعات</p>
                    <p className="text-2xl font-bold">{statistics.totalGroups}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <div className="h-5 w-5 rounded-full bg-green-500"></div>
                  <div>
                    <p className="text-sm text-gray-600">المجموعات النشطة</p>
                    <p className="text-2xl font-bold text-green-600">{statistics.activeGroups}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <div className="h-5 w-5 rounded-full bg-blue-500"></div>
                  <div>
                    <p className="text-sm text-gray-600">المجموعات المكتملة</p>
                    <p className="text-2xl font-bold text-blue-600">{statistics.completedGroups}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <Users className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="text-sm text-gray-600">إجمالي الطلاب</p>
                    <p className="text-2xl font-bold text-purple-600">{statistics.totalStudents}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <Clock className="h-5 w-5 text-orange-600" />
                  <div>
                    <p className="text-sm text-gray-600">متوسط التقدم</p>
                    <p className="text-2xl font-bold text-orange-600">
                      {statistics.averageProgress}%
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                الفلاتر
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                {/* Date Range Filter */}
                <div>
                  <label className="mb-2 block text-sm font-medium">الفترة الزمنية</label>
                  <DatePickerWithRange date={dateRange} handleSelect={setDateRange} />
                </div>

                {/* Status Filter */}
                <div>
                  <label className="mb-2 block text-sm font-medium">حالة المجموعة</label>
                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر الحالة" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="-1">جميع الحالات</SelectItem>
                      {statuses.map((status) => (
                        <SelectItem key={status.id} value={String(status.id || -1)}>
                          {status.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Instructor Filter */}
                <div>
                  <label className="mb-2 block text-sm font-medium">المحاضر</label>
                  <Select value={selectedInstructor} onValueChange={setSelectedInstructor}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر المحاضر" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="-1">جميع المحاضرين</SelectItem>
                      {instructors.map((instructor) => (
                        <SelectItem key={instructor.id} value={String(instructor.id || -1)}>
                          {instructor.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Search */}
                <div>
                  <label className="mb-2 block text-sm font-medium">البحث</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                    <Input
                      placeholder="ابحث في المجموعات..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-4 flex justify-end">
                <Button variant="outline" onClick={clearFilters}>
                  مسح الفلاتر
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Groups Summary */}
          <Card>
            <CardHeader>
              <CardTitle>ملخص المجموعات ({filteredGroups.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredGroups.length === 0 ? (
                  <div className="py-8 text-center text-gray-500">
                    لا توجد مجموعات تطابق المعايير المحددة
                  </div>
                ) : (
                  filteredGroups.map((group) => (
                    <div
                      key={group.id}
                      className="rounded-lg border p-4 transition-colors hover:bg-gray-50"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="mb-2 flex items-center gap-3">
                            <h3 className="text-lg font-semibold">{group.name}</h3>
                            <Badge className={getStatusBadgeColor(group.statusName)}>
                              {group.statusName}
                            </Badge>
                          </div>

                          <div className="grid grid-cols-1 gap-4 text-sm text-gray-600 md:grid-cols-3">
                            <div>
                              <p>
                                <span className="font-medium">الدورة:</span> {group.courseName}
                              </p>
                              <p>
                                <span className="font-medium">المحاضر:</span> {group.instructorName}
                              </p>
                            </div>

                            <div>
                              <p>
                                <span className="font-medium">تاريخ البداية:</span>{' '}
                                {formatDate(group.startDate)}
                              </p>
                              <p>
                                <span className="font-medium">تاريخ النهاية:</span>{' '}
                                {formatDate(group.endDate)}
                              </p>
                            </div>

                            <div>
                              <p>
                                <span className="font-medium">عدد الطلاب:</span>{' '}
                                {group.studentsCount}
                              </p>
                              <p>
                                <span className="font-medium">التقدم:</span>{' '}
                                {group.completedSessions}/{group.sessionsCount} جلسة
                              </p>
                            </div>
                          </div>

                          {group.sessionsCount > 0 && (
                            <div className="mt-3">
                              <div className="flex items-center gap-2">
                                <div className="h-2 flex-1 rounded-full bg-gray-200">
                                  <div
                                    className="h-2 rounded-full bg-blue-600 transition-all duration-300"
                                    style={{ width: `${group.progress}%` }}
                                  ></div>
                                </div>
                                <span className="text-sm text-gray-600">{group.progress}%</span>
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="flex flex-col items-end gap-2 text-left">
                          <p className="text-lg font-bold text-green-600">
                            {group.price.toLocaleString()} ر.س
                          </p>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewDetails(group)}
                            className="flex items-center gap-2"
                          >
                            <Eye className="h-4 w-4" />
                            عرض التفاصيل
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="statistics" className="space-y-6">
          <TrainingStatistics groups={filteredGroups} statistics={statistics} />
        </TabsContent>
      </Tabs>

      {/* Group Details Modal */}
      <GroupDetailsModal
        group={selectedGroup}
        isOpen={isDetailsModalOpen}
        onClose={handleCloseDetails}
      />
    </div>
  )
}
