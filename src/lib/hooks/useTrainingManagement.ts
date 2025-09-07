import { useState, useEffect, useCallback } from 'react';
import { groupsService, GroupSummaryFilters, GroupSummaryResponse, GroupStatistics } from '../api/groups.service';
import { DateRange } from 'react-day-picker';

interface UseTrainingManagementReturn {
  groups: GroupSummaryResponse[];
  filteredGroups: GroupSummaryResponse[];
  statistics: GroupStatistics;
  statuses: Array<{ id: number; name: string }>;
  instructors: Array<{ id: number; name: string }>;
  loading: boolean;
  error: string | null;
  
  // Filters
  dateRange: DateRange | undefined;
  selectedStatus: string;
  selectedInstructor: string;
  searchTerm: string;
  
  // Actions
  setDateRange: (range: DateRange | undefined) => void;
  setSelectedStatus: (status: string) => void;
  setSelectedInstructor: (instructor: string) => void;
  setSearchTerm: (term: string) => void;
  clearFilters: () => void;
  refreshData: () => Promise<void>;
}

export function useTrainingManagement(): UseTrainingManagementReturn {
  const [groups, setGroups] = useState<GroupSummaryResponse[]>([]);
  const [filteredGroups, setFilteredGroups] = useState<GroupSummaryResponse[]>([]);
  const [statistics, setStatistics] = useState<GroupStatistics>({
    totalGroups: 0,
    activeGroups: 0,
    completedGroups: 0,
    totalStudents: 0,
    averageProgress: 0
  });
  const [statuses, setStatuses] = useState<Array<{ id: number; name: string }>>([]);
  const [instructors, setInstructors] = useState<Array<{ id: number; name: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedInstructor, setSelectedInstructor] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Mock data for development
      const mockGroups = [
        {
          id: 1,
          name: 'مجموعة البرمجة المتقدمة',
          startDate: '2024-01-15',
          endDate: '2024-03-15',
          instructorId: 1,
          instructorName: 'أحمد محمد',
          statusId: 1,
          statusName: 'نشط',
          courseName: 'البرمجة بـ React',
          studentsCount: 15,
          sessionsCount: 20,
          completedSessions: 12,
          price: 2500,
          progress: 60
        },
        {
          id: 2,
          name: 'مجموعة تصميم المواقع',
          startDate: '2024-02-01',
          endDate: '2024-04-01',
          instructorId: 2,
          instructorName: 'فاطمة علي',
          statusId: 2,
          statusName: 'مكتمل',
          courseName: 'تصميم UI/UX',
          studentsCount: 12,
          sessionsCount: 16,
          completedSessions: 16,
          price: 2000,
          progress: 100
        }
      ];

      const mockStatuses = [
        { id: 1, name: 'نشط' },
        { id: 2, name: 'مكتمل' },
        { id: 3, name: 'متوقف' }
      ];

      const mockInstructors = [
        { id: 1, name: 'أحمد محمد' },
        { id: 2, name: 'فاطمة علي' },
        { id: 3, name: 'محمد سالم' }
      ];

      setGroups(mockGroups);
      setStatuses(mockStatuses);
      setInstructors(mockInstructors);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ في تحميل البيانات');
      console.error('Error fetching training data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const applyFilters = useCallback(() => {
    let filtered = [...groups];

    // Date range filter
    if (dateRange?.from && dateRange?.to) {
      filtered = filtered.filter(group => {
        if (!group.startDate) return false;
        const groupStart = new Date(group.startDate);
        return groupStart >= dateRange.from! && groupStart <= dateRange.to!;
      });
    }

    // Status filter
    if (selectedStatus !== 'all' && selectedStatus !== '-1') {
      filtered = filtered.filter(group => group.statusId.toString() === selectedStatus);
    }

    // Instructor filter
    if (selectedInstructor !== 'all' && selectedInstructor !== '-1') {
      filtered = filtered.filter(group => group.instructorId.toString() === selectedInstructor);
    }

    // Search filter
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(group =>
        group.name.toLowerCase().includes(searchLower) ||
        group.courseName.toLowerCase().includes(searchLower) ||
        group.instructorName.toLowerCase().includes(searchLower)
      );
    }

    setFilteredGroups(filtered);
    calculateStatistics(filtered);
  }, [groups, dateRange, selectedStatus, selectedInstructor, searchTerm]);

  const calculateStatistics = useCallback((groupsData: GroupSummaryResponse[]) => {
    const totalGroups = groupsData.length;
    const activeGroups = groupsData.filter(g => 
      g.statusName?.toLowerCase().includes('نشط') || 
      g.statusName?.toLowerCase().includes('active')
    ).length;
    
    const completedGroups = groupsData.filter(g => 
      g.statusName?.toLowerCase().includes('مكتمل') || 
      g.statusName?.toLowerCase().includes('completed')
    ).length;
    
    const totalStudents = groupsData.reduce((sum, g) => sum + g.studentsCount, 0);
    const averageProgress = groupsData.length > 0 
      ? Math.round(groupsData.reduce((sum, g) => sum + g.progress, 0) / groupsData.length)
      : 0;

    setStatistics({
      totalGroups,
      activeGroups,
      completedGroups,
      totalStudents,
      averageProgress
    });
  }, []);

  const clearFilters = useCallback(() => {
    setDateRange(undefined);
    setSelectedStatus('all');
    setSelectedInstructor('all');
    setSearchTerm('');
  }, []);

  const refreshData = useCallback(async () => {
    await fetchData();
  }, [fetchData]);

  // Initial data fetch
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Apply filters when dependencies change
  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  return {
    groups,
    filteredGroups,
    statistics,
    statuses,
    instructors,
    loading,
    error,
    
    // Filters
    dateRange,
    selectedStatus,
    selectedInstructor,
    searchTerm,
    
    // Actions
    setDateRange,
    setSelectedStatus,
    setSelectedInstructor,
    setSearchTerm,
    clearFilters,
    refreshData
  };
}