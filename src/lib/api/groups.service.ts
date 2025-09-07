import { AbstractApi } from '../AbstractApi';

export interface GroupSummaryFilters {
  startDate?: string;
  endDate?: string;
  statusId?: number;
  instructorId?: number;
  searchTerm?: string;
  page?: number;
  limit?: number;
}

export interface GroupSummaryResponse {
  id: number;
  name: string;
  startDate: string | null;
  endDate: string | null;
  instructorId: number;
  instructorName: string;
  statusId: number;
  statusName: string;
  courseName: string;
  studentsCount: number;
  sessionsCount: number;
  completedSessions: number;
  price: number;
  progress: number;
}

export interface GroupStatistics {
  totalGroups: number;
  activeGroups: number;
  completedGroups: number;
  totalStudents: number;
  averageProgress: number;
}

export interface Group {
  id: number;
  name: string;
  startDate: string | null;
  endDate: string | null;
  instructorId: number;
  statusId: number;
  courseName: string;
  price: number;
}

export interface CreateGroupData {
  name: string;
  startDate?: string;
  endDate?: string;
  instructorId: number;
  statusId: number;
  courseName: string;
  price?: number;
}

class GroupsService extends AbstractApi<Group, CreateGroupData> {
  constructor() {
    super('/api/Groups');
  }

  async getGroupsSummary(filters?: GroupSummaryFilters) {
    const params = new URLSearchParams();
    
    if (filters?.page) params.append('Page', filters.page.toString());
    if (filters?.limit) params.append('Limit', filters.limit.toString());
    if (filters?.searchTerm) params.append('FreeText', filters.searchTerm);
    
    const response = await this.get(`/pagination?${params.toString()}`);
    
    // Transform the response to include calculated fields
    const transformedData = response.data?.map((group: any) => ({
      id: group.id,
      name: group.name,
      startDate: group.startDate,
      endDate: group.endDate,
      instructorId: group.instructorId,
      instructorName: group.instructorName,
      statusId: group.statusId,
      statusName: group.statusName,
      courseName: group.courseName,
      studentsCount: group.students?.length || 0,
      sessionsCount: group.sessions?.length || 0,
      completedSessions: group.sessions?.filter((s: any) => 
        new Date(s.startTime) < new Date()
      ).length || 0,
      price: group.price || 0,
      progress: group.sessions?.length > 0 
        ? Math.round((group.sessions.filter((s: any) => 
            new Date(s.startTime) < new Date()
          ).length / group.sessions.length) * 100)
        : 0
    })) || [];

    return {
      ...response,
      data: transformedData
    };
  }

  async getGroupStatistics(filters?: GroupSummaryFilters): Promise<GroupStatistics> {
    const groupsData = await this.getGroupsSummary(filters);
    const groups = groupsData.data || [];

    const totalGroups = groups.length;
    const activeGroups = groups.filter((g: GroupSummaryResponse) => 
      g.statusName?.toLowerCase().includes('نشط') || 
      g.statusName?.toLowerCase().includes('active')
    ).length;
    
    const completedGroups = groups.filter((g: GroupSummaryResponse) => 
      g.statusName?.toLowerCase().includes('مكتمل') || 
      g.statusName?.toLowerCase().includes('completed')
    ).length;
    
    const totalStudents = groups.reduce((sum: number, g: GroupSummaryResponse) => 
      sum + g.studentsCount, 0
    );
    
    const averageProgress = groups.length > 0 
      ? Math.round(groups.reduce((sum: number, g: GroupSummaryResponse) => 
          sum + g.progress, 0
        ) / groups.length)
      : 0;

    return {
      totalGroups,
      activeGroups,
      completedGroups,
      totalStudents,
      averageProgress
    };
  }

  async getGroupStatuses() {
    return await this.get('/api/HelpTables/GroupStatus');
  }

  async getInstructors() {
    const response = await this.get('/api/Instructors/pagination?Page=1&Limit=100');
    return response.data?.map((instructor: any) => ({
      id: instructor.id,
      name: instructor.name
    })) || [];
  }

  async getGroupById(id: number) {
    return await this.get(`/${id}`);
  }

  async getGroupEnrollments(groupId: number) {
    return await this.get(`/enrollments/${groupId}`);
  }

  async activateGroup(groupId: number, enrollments: any[]) {
    return await this.post('/activate', {
      groupId,
      enrollments
    });
  }

  async deactivateGroup(groupId: number) {
    return await this.post(`/deactivate/${groupId}`);
  }

  async closeGroup(groupId: number) {
    return await this.post('/close-group', {
      groupId
    });
  }

  async addExtraSession(groupId: number, sessionData: any) {
    return await this.post('/add-extra-session', {
      groupId,
      ...sessionData
    });
  }
}

export const groupsService = new GroupsService();