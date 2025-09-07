 'use client';

import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Calendar, Clock, BookOpen, Phone, Mail } from 'lucide-react';
import { GroupSummaryResponse } from '@/lib/api/groups.service';
import { axiosInstance } from '@/lib/axiosInstance'
import { apis } from '@/lib/const/api.enum'

interface GroupDetailsModalProps {
  group: GroupSummaryResponse | null;
  isOpen: boolean;
  onClose: () => void;
}

interface Student {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  isActive: boolean;
}

interface Session {
  id: number;
  startTime: string;
  sessionIndex: number;
  isCompleted: boolean;
  attendanceCount: number;
  totalStudents: number;
}

export default function GroupDetailsModal({ group, isOpen, onClose }: GroupDetailsModalProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [students, setStudents] = useState<Student[]>([])
  const [sessions, setSessions] = useState<Session[]>([])
  const [loadingDetails, setLoadingDetails] = useState(false)
  const [detailsError, setDetailsError] = useState<string | null>(null)

  useEffect(() => {
    // Fetch group details (students, sessions) when a group is opened
    if (!group) return

    let mounted = true
    const fetchDetails = async () => {
      try {
        setLoadingDetails(true)
        setDetailsError(null)

        // Try to fetch full group info
        const res = await axiosInstance.get(`${apis.receipts.replace('FinancialOperations','Groups')}/${group.id}`)
        // The above line tries to reuse the base apis constant path pattern. If API responds differently,
        // fall back to direct endpoint below.
        let groupDetail = res?.data?.data || res?.data || null

        // Fallback: direct Groups endpoint
        if (!groupDetail) {
          const r2 = await axiosInstance.get(`/api/Groups/${group.id}`)
          groupDetail = r2?.data?.data || r2?.data || null
        }

        // If groupDetail includes enrollments or students
          if (mounted && groupDetail) {
          const fetchedStudents = groupDetail.students || groupDetail.enrollments || []
          // Normalize students shape if enrollments provided
          const normalizedStudents = Array.isArray(fetchedStudents)
            ? fetchedStudents.map((s: any) => ({
                id: s.studentId ?? s.id,
                name: s.studentName ?? s.name ?? `${s.firstName || ''} ${s.lastName || ''}`.trim(),
                email: s.email,
                phone: s.phone,
                isActive: s.isActive ?? true,
              }))
            : []

          setStudents(normalizedStudents)

          const fetchedSessions = groupDetail.sessions || groupDetail.schedule || []
          const normalizedSessions = Array.isArray(fetchedSessions)
            ? fetchedSessions.map((ss: any, idx: number) => ({
                id: ss.id ?? idx,
                startTime: ss.startTime ?? ss.date ?? ss.start,
                sessionIndex: ss.sessionIndex ?? ss.index ?? idx + 1,
                isCompleted: ss.isCompleted !== undefined ? ss.isCompleted : (ss.completed ? !!ss.completed : (ss.startTime ? new Date(ss.startTime) < new Date() : false)),
                attendanceCount: ss.attendanceCount ?? ss.attendees?.length ?? 0,
                totalStudents: ss.totalStudents ?? ss.capacity ?? normalizedStudents.length,
              }))
            : []

          setSessions(normalizedSessions)
        }
      } catch (err: any) {
        setDetailsError(err?.response?.data?.message || err?.message || 'فشل في جلب تفاصيل المجموعة')
        console.error('Failed to load group details:', err)
      } finally {
        if (mounted) setLoadingDetails(false)
      }
    }

    fetchDetails()

    return () => {
      mounted = false
    }
  }, [group])

  if (!group) return null;

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'غير محدد';
    return new Date(dateString).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('ar-SA', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadgeColor = (statusName: string) => {
    const status = statusName?.toLowerCase();
    if (status?.includes('نشط') || status?.includes('active')) return 'bg-green-100 text-green-800';
    if (status?.includes('مكتمل') || status?.includes('completed')) return 'bg-blue-100 text-blue-800';
    if (status?.includes('متوقف') || status?.includes('paused')) return 'bg-yellow-100 text-yellow-800';
    if (status?.includes('ملغي') || status?.includes('cancelled')) return 'bg-red-100 text-red-800';
    return 'bg-gray-100 text-gray-800';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <span>{group.name}</span>
            <Badge className={getStatusBadgeColor(group.statusName)}>
              {group.statusName}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
            <TabsTrigger value="students">الطلاب</TabsTrigger>
            <TabsTrigger value="sessions">الجلسات</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    معلومات الدورة
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">اسم الدورة</p>
                    <p className="font-medium">{group.courseName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">المحاضر</p>
                    <p className="font-medium">{group.instructorName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">السعر</p>
                    <p className="font-medium text-green-600">{group.price.toLocaleString()} ر.س</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    التواريخ والأوقات
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">تاريخ البداية</p>
                    <p className="font-medium">{formatDate(group.startDate)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">تاريخ النهاية</p>
                    <p className="font-medium">{formatDate(group.endDate)}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    إحصائيات الطلاب
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">عدد الطلاب المسجلين</p>
                    <p className="font-medium text-blue-600">{group.studentsCount}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">الطلاب النشطين</p>
                    <p className="font-medium text-green-600">{students.filter(s => s.isActive).length}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    تقدم الجلسات
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">الجلسات المكتملة</p>
                    <p className="font-medium">{group.completedSessions} من {group.sessionsCount}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">نسبة التقدم</p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${group.progress}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium">{group.progress}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            </TabsContent>

            {/* Loading / Error for details */}
            {loadingDetails && (
              <div className="p-4 text-sm text-gray-600">جاري تحميل تفاصيل المجموعة...</div>
            )}
            {detailsError && (
              <div className="p-4 text-sm text-red-600">{detailsError}</div>
            )}

          <TabsContent value="students" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>قائمة الطلاب ({students.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {students.map((student) => (
                    <div key={student.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">{student.name}</h4>
                            <Badge variant={student.isActive ? 'default' : 'secondary'}>
                              {student.isActive ? 'نشط' : 'غير نشط'}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                            {student.email && (
                              <div className="flex items-center gap-1">
                                <Mail className="h-4 w-4" />
                                <span>{student.email}</span>
                              </div>
                            )}
                            {student.phone && (
                              <div className="flex items-center gap-1">
                                <Phone className="h-4 w-4" />
                                <span>{student.phone}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sessions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>جلسات المجموعة ({sessions.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {sessions.map((session) => (
                    <div key={session.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">الجلسة {session.sessionIndex}</h4>
                            <Badge variant={session.isCompleted ? 'default' : 'secondary'}>
                              {session.isCompleted ? 'مكتملة' : 'قادمة'}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              <span>{formatDate(session.startTime)}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              <span>{formatTime(session.startTime)}</span>
                            </div>
                            {session.isCompleted && (
                              <div className="flex items-center gap-1">
                                <Users className="h-4 w-4" />
                                <span>الحضور: {session.attendanceCount}/{session.totalStudents}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={onClose}>
            إغلاق
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}