'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Calendar, 
  Clock, 
  BookOpen,
  Target,
  Award
} from 'lucide-react';
import { GroupSummaryResponse, GroupStatistics } from '@/lib/api/groups.service';

interface TrainingStatisticsProps {
  groups: GroupSummaryResponse[];
  statistics: GroupStatistics;
}

interface InstructorStats {
  id: number;
  name: string;
  groupsCount: number;
  studentsCount: number;
  averageProgress: number;
}

interface CourseStats {
  name: string;
  groupsCount: number;
  studentsCount: number;
  averageProgress: number;
}

export default function TrainingStatistics({ groups, statistics }: TrainingStatisticsProps) {
  
  const getInstructorStats = (): InstructorStats[] => {
    const instructorMap = new Map<number, InstructorStats>();
    
    groups.forEach(group => {
      const existing = instructorMap.get(group.instructorId);
      if (existing) {
        existing.groupsCount++;
        existing.studentsCount += group.studentsCount;
        existing.averageProgress = Math.round(
          (existing.averageProgress * (existing.groupsCount - 1) + group.progress) / existing.groupsCount
        );
      } else {
        instructorMap.set(group.instructorId, {
          id: group.instructorId,
          name: group.instructorName,
          groupsCount: 1,
          studentsCount: group.studentsCount,
          averageProgress: group.progress
        });
      }
    });
    
    return Array.from(instructorMap.values())
      .sort((a, b) => b.groupsCount - a.groupsCount)
      .slice(0, 5);
  };

  const getCourseStats = (): CourseStats[] => {
    const courseMap = new Map<string, CourseStats>();
    
    groups.forEach(group => {
      const existing = courseMap.get(group.courseName);
      if (existing) {
        existing.groupsCount++;
        existing.studentsCount += group.studentsCount;
        existing.averageProgress = Math.round(
          (existing.averageProgress * (existing.groupsCount - 1) + group.progress) / existing.groupsCount
        );
      } else {
        courseMap.set(group.courseName, {
          name: group.courseName,
          groupsCount: 1,
          studentsCount: group.studentsCount,
          averageProgress: group.progress
        });
      }
    });
    
    return Array.from(courseMap.values())
      .sort((a, b) => b.studentsCount - a.studentsCount)
      .slice(0, 5);
  };

  const getCompletionRate = () => {
    const totalSessions = groups.reduce((sum, g) => sum + g.sessionsCount, 0);
    const completedSessions = groups.reduce((sum, g) => sum + g.completedSessions, 0);
    return totalSessions > 0 ? Math.round((completedSessions / totalSessions) * 100) : 0;
  };

  const getUpcomingSessions = () => {
    return groups.reduce((sum, g) => sum + (g.sessionsCount - g.completedSessions), 0);
  };

  const instructorStats = getInstructorStats();
  const courseStats = getCourseStats();
  const completionRate = getCompletionRate();
  const upcomingSessions = getUpcomingSessions();

  return (
    <div className="space-y-6">
      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">معدل الإكمال</p>
                <p className="text-2xl font-bold text-blue-600">{completionRate}%</p>
              </div>
              <Target className="h-8 w-8 text-blue-600" />
            </div>
            <Progress value={completionRate} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">الجلسات القادمة</p>
                <p className="text-2xl font-bold text-orange-600">{upcomingSessions}</p>
              </div>
              <Calendar className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">متوسط الطلاب/مجموعة</p>
                <p className="text-2xl font-bold text-purple-600">
                  {statistics.totalGroups > 0 ? Math.round(statistics.totalStudents / statistics.totalGroups) : 0}
                </p>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">معدل النجاح</p>
                <p className="text-2xl font-bold text-green-600">
                  {statistics.totalGroups > 0 ? Math.round((statistics.completedGroups / statistics.totalGroups) * 100) : 0}%
                </p>
              </div>
              <Award className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Instructors */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              أفضل المحاضرين
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {instructorStats.map((instructor, index) => (
                <div key={instructor.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{instructor.name}</p>
                      <p className="text-sm text-gray-600">
                        {instructor.groupsCount} مجموعة • {instructor.studentsCount} طالب
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline">
                      {instructor.averageProgress}% تقدم
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Courses */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              أكثر الدورات طلباً
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {courseStats.map((course, index) => (
                <div key={course.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 bg-green-100 text-green-600 rounded-full font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{course.name}</p>
                      <p className="text-sm text-gray-600">
                        {course.groupsCount} مجموعة • {course.studentsCount} طالب
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline">
                      {course.averageProgress}% تقدم
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            توزيع التقدم
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { label: 'لم تبدأ (0%)', count: groups.filter(g => g.progress === 0).length, color: 'bg-gray-500' },
              { label: 'في البداية (1-25%)', count: groups.filter(g => g.progress > 0 && g.progress <= 25).length, color: 'bg-red-500' },
              { label: 'في المنتصف (26-75%)', count: groups.filter(g => g.progress > 25 && g.progress <= 75).length, color: 'bg-yellow-500' },
              { label: 'قريب من الانتهاء (76-100%)', count: groups.filter(g => g.progress > 75).length, color: 'bg-green-500' }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className={`w-full h-20 ${item.color} rounded-lg flex items-center justify-center text-white font-bold text-2xl mb-2`}>
                  {item.count}
                </div>
                <p className="text-sm text-gray-600">{item.label}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}