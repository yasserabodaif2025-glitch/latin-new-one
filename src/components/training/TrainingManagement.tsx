'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Clock, Filter, Search, AlertCircle, Eye, BarChart3 } from 'lucide-react';
import { DatePickerWithRange } from '@/components/ui/date-picker-with-range';
import { useTrainingManagement } from '@/lib/hooks/useTrainingManagement';
import { GroupDetailsModal, TrainingStatistics } from '@/components/training';
import { GroupSummaryResponse } from '@/lib/api/groups.service';

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
    refreshData
  } = useTrainingManagement();

  const [selectedGroup, setSelectedGroup] = useState<GroupSummaryResponse | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const handleViewDetails = (group: GroupSummaryResponse) => {
    setSelectedGroup(group);
    setIsDetailsModalOpen(true);
  };

  const handleCloseDetails = () => {
    setSelectedGroup(null);
    setIsDetailsModalOpen(false);
  };

  const getStatusBadgeColor = (statusName: string) => {
    const status = statusName?.toLowerCase();
    if (status?.includes('نشط') || status?.includes('active')) return 'bg-green-100 text-green-800';
    if (status?.includes('مكتمل') || status?.includes('completed')) return 'bg-blue-100 text-blue-800';
    if (status?.includes('متوقف') || status?.includes('paused')) return 'bg-yellow-100 text-yellow-800';
    if (status?.includes('ملغي') || status?.includes('cancelled')) return 'bg-red-100 text-red-800';
    return 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'غير محدد';
    return new Date(dateString).toLocaleDateString('ar-SA');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={refreshData}>إعادة المحاولة</Button>
        </div>
      </div>
    );
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
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
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
              <div className="h-5 w-5 bg-green-500 rounded-full"></div>
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
              <div className="h-5 w-5 bg-blue-500 rounded-full"></div>
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
                <p className="text-2xl font-bold text-orange-600">{statistics.averageProgress}%</p>
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Date Range Filter */}
            <div>
              <label className="text-sm font-medium mb-2 block">الفترة الزمنية</label>
              <DatePickerWithRange
                date={dateRange}
                handleSelect={setDateRange}
              />
            </div>

            {/* Status Filter */}
            <div>
              <label className="text-sm font-medium mb-2 block">حالة المجموعة</label>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر الحالة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الحالات</SelectItem>
                  {statuses.filter(status => status.id && status.id.toString().trim()).map((status) => (
                    <SelectItem key={status.id} value={status.id.toString()}>
                      {status.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Instructor Filter */}
            <div>
              <label className="text-sm font-medium mb-2 block">المحاضر</label>
              <Select value={selectedInstructor} onValueChange={setSelectedInstructor}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر المحاضر" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع المحاضرين</SelectItem>
                  {instructors.filter(instructor => instructor.id && instructor.id.toString().trim()).map((instructor) => (
                    <SelectItem key={instructor.id} value={instructor.id.toString()}>
                      {instructor.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Search */}
            <div>
              <label className="text-sm font-medium mb-2 block">البحث</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="ابحث في المجموعات..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-4">
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
              <div className="text-center py-8 text-gray-500">
                لا توجد مجموعات تطابق المعايير المحددة
              </div>
            ) : (
              filteredGroups.map((group) => (
                <div key={group.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg">{group.name}</h3>
                        <Badge className={getStatusBadgeColor(group.statusName)}>
                          {group.statusName}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                        <div>
                          <p><span className="font-medium">الدورة:</span> {group.courseName}</p>
                          <p><span className="font-medium">المحاضر:</span> {group.instructorName}</p>
                        </div>
                        
                        <div>
                          <p><span className="font-medium">تاريخ البداية:</span> {formatDate(group.startDate)}</p>
                          <p><span className="font-medium">تاريخ النهاية:</span> {formatDate(group.endDate)}</p>
                        </div>
                        
                        <div>
                          <p><span className="font-medium">عدد الطلاب:</span> {group.studentsCount}</p>
                          <p><span className="font-medium">التقدم:</span> {group.completedSessions}/{group.sessionsCount} جلسة</p>
                        </div>
                      </div>
                      
                      {group.sessionsCount > 0 && (
                        <div className="mt-3">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${group.progress}%` }}
                              ></div>
                            </div>
                            <span className="text-sm text-gray-600">
                              {group.progress}%
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="text-left flex flex-col items-end gap-2">
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
          <TrainingStatistics 
            groups={filteredGroups} 
            statistics={statistics}
          />
        </TabsContent>
      </Tabs>

      {/* Group Details Modal */}
      <GroupDetailsModal
        group={selectedGroup}
        isOpen={isDetailsModalOpen}
        onClose={handleCloseDetails}
      />
    </div>
  );
}