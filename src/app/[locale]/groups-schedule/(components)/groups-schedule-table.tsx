'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Calendar, Filter, Loader2 } from 'lucide-react'
import { getActiveGroups, getGroupStatuses, IGroupScheduleItem } from '../groups-schedule.action'
import { getBranches } from '../../branches/branch.action'
import { getCategories } from '../../categories/category.action'
import { IBranch } from '../../branches/(components)/branch.interface'
import { ICategory } from '../../categories/(components)/category.interface'
import { ICourseGroupStatus } from '../../course-groups/(components)/course-group.interface'

// Time slots for the schedule (24-hour format)
const TIME_SLOTS = [
  '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', 
  '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00'
]

// Days of the week
const WEEKDAYS = [
  { id: 1, name: 'الأحد', shortName: 'أحد' },
  { id: 2, name: 'الإثنين', shortName: 'إثنين' },
  { id: 3, name: 'الثلاثاء', shortName: 'ثلاثاء' },
  { id: 4, name: 'الأربعاء', shortName: 'أربعاء' },
  { id: 5, name: 'الخميس', shortName: 'خميس' },
  { id: 6, name: 'الجمعة', shortName: 'جمعة' },
  { id: 7, name: 'السبت', shortName: 'سبت' }
]

interface GroupsScheduleTableProps {
  initialGroups?: IGroupScheduleItem[]
}

export function GroupsScheduleTable({ initialGroups = [] }: GroupsScheduleTableProps) {
  const [groups, setGroups] = useState<IGroupScheduleItem[]>(initialGroups)
  const [filteredGroups, setFilteredGroups] = useState<IGroupScheduleItem[]>(initialGroups)
  
  useEffect(() => {
    console.log('🔄 Component render:', {
      groupsCount: groups.length,
      filteredGroupsCount: filteredGroups.length,
      initialGroupsCount: initialGroups.length,
      groupsData: groups.slice(0, 2), // Show first 2 groups for debugging
      filters: { selectedStatus, selectedBranch, selectedCategory, searchTerm },
      firstGroupDetails: groups[0] ? {
        name: groups[0].name,
        room: groups[0].room,
        roomName: groups[0].roomName,
        instructor: groups[0].instructor,
        instructorName: groups[0].instructorName,
        allProperties: Object.keys(groups[0])
      } : null
    })
  })

  const [loading, setLoading] = useState(false)
  const [statuses, setStatuses] = useState<ICourseGroupStatus[]>([])
  const [branches, setBranches] = useState<IBranch[]>([])
  const [categories, setCategories] = useState<ICategory[]>([])
  
  // Filter states
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [selectedBranch, setSelectedBranch] = useState<string>('all')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')

  // Load initial data
  useEffect(() => {
    loadData()
  }, [])

  const applyFilters = useCallback(() => {
    console.log('🔍 Applying filters:', {
      totalGroups: groups.length,
      selectedStatus,
      selectedBranch,
      selectedCategory,
      searchTerm
    })

    let filtered = [...groups]

    if (selectedStatus && selectedStatus !== 'all') {
      const beforeCount = filtered.length
      filtered = filtered.filter(group => group.statusId.toString() === selectedStatus)
      console.log(`Status filter: ${beforeCount} -> ${filtered.length}`)
    }

    if (selectedBranch && selectedBranch !== 'all') {
      const beforeCount = filtered.length
      filtered = filtered.filter(group => group.branchId.toString() === selectedBranch)
      console.log(`Branch filter: ${beforeCount} -> ${filtered.length}`)
    }

    if (selectedCategory && selectedCategory !== 'all') {
      const beforeCount = filtered.length
      filtered = filtered.filter(group => group.course?.categoryId?.toString() === selectedCategory)
      console.log(`Category filter: ${beforeCount} -> ${filtered.length}`)
    }

    if (searchTerm) {
      const beforeCount = filtered.length
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(group => 
        group.name.toLowerCase().includes(term) ||
        group.instructorName?.toLowerCase().includes(term) ||
        group.course?.name?.toLowerCase().includes(term) ||
        group.roomName?.toLowerCase().includes(term)
      )
      console.log(`Search filter: ${beforeCount} -> ${filtered.length}`)
    }

    console.log(`✅ Final filtered groups: ${filtered.length}`)
    setFilteredGroups(filtered)
  }, [groups, selectedStatus, selectedBranch, selectedCategory, searchTerm])

  // Apply filters
  useEffect(() => {
    applyFilters()
  }, [applyFilters])

  const loadData = async () => {
    setLoading(true)
    try {
      console.log('🔄 Loading initial data...')
      
      const [groupsRes, statusesRes, branchesRes, categoriesRes] = await Promise.all([
        getActiveGroups(),
        getGroupStatuses(),
        getBranches(),
        getCategories()
      ])
      
      console.log('📊 Groups response:', {
        success: !!groupsRes,
        dataLength: groupsRes?.data?.length || 0,
        firstGroup: groupsRes?.data?.[0]
      })
      
      console.log('📊 Loaded data:', {
        groupsCount: (groupsRes.data || []).length,
        statusesCount: (statusesRes || []).length,
        branchesCount: (branchesRes.data || []).length,
        categoriesCount: (categoriesRes.data || []).length
      })
      
      if (groupsRes?.data) {
        setGroups(groupsRes.data)
        setFilteredGroups(groupsRes.data)
      }
      
      setStatuses(statusesRes || [])
      setBranches(branchesRes.data || [])
      setCategories(categoriesRes.data || [])
    } catch (error) {
      console.error('❌ Error loading initial data:', error)
    } finally {
      setLoading(false)
    }
  }

  const clearFilters = () => {
    setSelectedStatus('all')
    setSelectedBranch('all')
    setSelectedCategory('all')
    setSearchTerm('')
  }

  const getGroupsForTimeSlot = (day: number, timeSlot: string) => {
    const matchingGroups = filteredGroups.filter(group => {
      // Check if group has this day - handle both array and string formats
      let groupDays: number[] = []

      // First check if we have a processed daysArray
      if (Array.isArray(group.daysArray)) {
        groupDays = group.daysArray
      } else if (typeof group.days === 'string') {
        // Handle comma-separated day numbers or day names
        groupDays = group.days.split(',').map((d: string) => parseInt(d.trim()))
      } else if (Array.isArray(group.days)) {
        groupDays = group.days
      }

      // Check if these are bit flags (powers of 2) and convert to day numbers
      if (groupDays.length > 0 && groupDays.every(d => d > 0 && (d & (d - 1)) === 0)) {
        const dayNumbers = []
        for (let i = 0; i < 7; i++) {
          if (groupDays.includes(Math.pow(2, i))) {
            dayNumbers.push(i + 1) // Convert to 1-7 (Sunday=1, Monday=2, etc.)
          }
        }
        groupDays = dayNumbers
      }
      
      // If no conversion happened and we have regular day numbers, use them as is
      if (!groupDays.includes(day)) {
        return false
      }

      // Check if group starts exactly at this time slot
      const groupStartTime = group.startTime
      
      if (!groupStartTime) {
        return false
      }

      const normalizeTime = (time: string) => {
        if (time.includes(':')) {
          const parts = time.split(':')
          return `${parts[0].padStart(2, '0')}:${parts[1].padStart(2, '0')}`
        }
        return time
      }

      const normalizedStartTime = normalizeTime(groupStartTime)
      const slotTime = timeSlot
      
      // Only show group at its exact start time slot
      return normalizedStartTime === slotTime
    })

    if (matchingGroups.length > 0) {
      console.log(`📅 Found ${matchingGroups.length} groups for day ${day} at ${timeSlot}:`, matchingGroups.map(g => g.name))
    }
    
    return matchingGroups
  }

  const getStatusColor = (statusId: number) => {
    switch (statusId) {
      case 1: return 'bg-green-100 text-green-800 border-green-200'
      case 2: return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 3: return 'bg-red-100 text-red-800 border-red-200'
      case 4: return 'bg-blue-100 text-blue-800 border-blue-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusName = (statusId: number) => {
    const status = statuses.find(s => s.id === statusId)
    return status?.name || 'غير محدد'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="mr-2">جاري تحميل جدول المجموعات...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            فلاتر البحث
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div>
              <Label>البحث</Label>
              <Input
                placeholder="ابحث في اسم المجموعة، المحاضر، الدورة..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div>
              <Label>حالة المجموعة</Label>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر الحالة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الحالات</SelectItem>
                  {statuses.map(status => (
                    <SelectItem key={status.id} value={status.id.toString()}>
                      {status.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>الفرع</Label>
              <Select value={selectedBranch} onValueChange={setSelectedBranch}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر الفرع" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الفروع</SelectItem>
                  {branches.map(branch => (
                    <SelectItem key={branch.id} value={branch.id.toString()}>
                      {branch.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>القسم</Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر القسم" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الأقسام</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <Button variant="outline" onClick={clearFilters}>
              مسح الفلاتر
            </Button>
            <div className="text-sm text-muted-foreground">
              عدد المجموعات: {filteredGroups.length}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Schedule Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            جدول المجموعات الأسبوعي
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <div className="min-w-[800px]">
              {/* Header */}
              <div className="grid grid-cols-8 gap-1 mb-2">
                <div className="p-2 bg-gray-50 rounded font-medium text-center">
                  التوقيت
                </div>
                {WEEKDAYS.map(day => (
                  <div key={day.id} className="p-2 bg-gray-50 rounded font-medium text-center">
                    {day.name}
                  </div>
                ))}
              </div>

              {/* Time slots */}
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr>
                    <th className="border border-gray-300 p-2 bg-gray-50 font-medium text-center">
                      التوقيت
                    </th>
                    {WEEKDAYS.map(day => (
                      <th key={day.id} className="border border-gray-300 p-2 bg-gray-50 font-medium text-center">
                        {day.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {TIME_SLOTS.map(timeSlot => (
                    <tr key={timeSlot}>
                      <td className="border border-gray-300 p-2 bg-gray-50 text-center font-medium text-sm">
                        {timeSlot}
                      </td>
                      {WEEKDAYS.map(day => {
                        const groupsInSlot = getGroupsForTimeSlot(day.id, timeSlot)
                        return (
                          <td key={`${day.id}-${timeSlot}`} className="border border-gray-300 p-2 text-center min-h-[60px] align-top">
                            <div className="flex flex-wrap gap-2 justify-center">
                              {groupsInSlot.map(group => (
                                <div key={group.id} className="flex-shrink-0 min-w-[180px]">
                                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 text-xs">
                                    <div className="font-semibold text-blue-900 mb-1">{group.name}</div>
                                    <div className="text-blue-700">
                                    <div>الغرفة: {group.roomName || group.room?.name || 'غير محدد'}</div>
                                    <div>المدرس: {group.instructorName || group.instructor?.name || 'غير محدد'}</div>
                                    <div>الجلسات: {Array.isArray(group.sessions) ? group.sessions.length : group.sessions || 0}</div>
                                      <div>
                                        <span className={`inline-block px-2 py-1 rounded-full text-xs ${getStatusColor(group.statusId)}`}>
                                          {getStatusName(group.statusId)}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
