'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Shield, User, Save, X } from 'lucide-react'
import { toast } from 'sonner'
import { axiosInstance } from '@/lib/axiosInstance'
import useSWR from 'swr'
import { axiosFetcher } from '@/lib/swr-fetchers'
import { useTranslations } from 'next-intl'

interface Role {
  id: number
  name: string
  description?: string
}

interface RoleAssignmentModalProps {
  employeeId: number
  employeeName: string
  currentRoleIds?: number[]
  onRoleUpdate?: () => void
}

export function RoleAssignmentModal({ 
  employeeId, 
  employeeName, 
  currentRoleIds = [], 
  onRoleUpdate 
}: RoleAssignmentModalProps) {
  const [open, setOpen] = useState(false)
  const [selectedRoleIds, setSelectedRoleIds] = useState<number[]>(currentRoleIds)
  const [isUpdating, setIsUpdating] = useState(false)

  // جلب جميع الأدوار المتاحة
  const { data: roles = [] as Role[], error: rolesError } = useSWR('/api/Roles', axiosFetcher)

  useEffect(() => {
    if (rolesError) {
      console.error('Failed to load roles:', rolesError)
      toast.error('فشل في تحميل قائمة الأدوار')
    }
  }, [rolesError])

  // تحديث الأدوار المحددة عند تغيير الأدوار الحالية
  useEffect(() => {
    setSelectedRoleIds(currentRoleIds)
  }, [currentRoleIds])

  const handleRoleToggle = (roleId: number) => {
    setSelectedRoleIds(prev => {
      if (prev.includes(roleId)) {
        return prev.filter(id => id !== roleId)
      } else {
        return [...prev, roleId]
      }
    })
  }

  const handleSave = async () => {
    try {
      setIsUpdating(true)
      
      // استخدام endpoint تحديث الأدوار
      await axiosInstance.put(`/api/Employees/${employeeId}/roles`, {
        roleIds: selectedRoleIds
      })

      toast.success('تم تحديث أدوار الموظف بنجاح')
      setOpen(false)
      
      // إشعار المكون الأب بالتحديث
      if (onRoleUpdate) {
        onRoleUpdate()
      }
    } catch (error: any) {
      console.error('Error updating employee roles:', error)
      
      if (error?.response?.status === 400) {
        toast.error('بيانات غير صحيحة. يرجى المحاولة مرة أخرى')
      } else if (error?.response?.status === 404) {
        toast.error('الموظف غير موجود')
      } else {
        toast.error('فشل في تحديث أدوار الموظف')
      }
    } finally {
      setIsUpdating(false)
    }
  }

  const selectedRoles = roles.filter(role => selectedRoleIds.includes(role.id))

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Shield className="h-4 w-4" />
          إدارة الأدوار
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            إدارة أدوار الموظف
          </DialogTitle>
          <p className="text-sm text-gray-600">
            الموظف: <span className="font-medium">{employeeName}</span>
          </p>
        </DialogHeader>

        <div className="space-y-4">
          {/* عرض الأدوار المحددة حالياً */}
          <div>
            <h4 className="text-sm font-medium mb-2">الأدوار المحددة:</h4>
            <div className="flex flex-wrap gap-2">
              {selectedRoles.length > 0 ? (
                selectedRoles.map(role => (
                  <Badge key={role.id} variant="default">
                    {role.name}
                  </Badge>
                ))
              ) : (
                <span className="text-sm text-gray-500">لا توجد أدوار محددة</span>
              )}
            </div>
          </div>

          {/* قائمة جميع الأدوار المتاحة */}
          <div>
            <h4 className="text-sm font-medium mb-2">الأدوار المتاحة:</h4>
            <div className="max-h-60 overflow-y-auto space-y-2">
              {roles.length > 0 ? (
                roles.map(role => (
                  <div key={role.id} className="flex items-center space-x-2 space-x-reverse">
                    <Checkbox
                      id={`role-${role.id}`}
                      checked={selectedRoleIds.includes(role.id) || false}
                      onCheckedChange={() => handleRoleToggle(role.id)}
                    />
                    <label 
                      htmlFor={`role-${role.id}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex-1"
                    >
                      {role.name}
                      {role.description && (
                        <span className="block text-xs text-gray-500 mt-1">
                          {role.description}
                        </span>
                      )}
                    </label>
                  </div>
                ))
              ) : (
                <div className="text-sm text-gray-500">لا توجد أدوار متاحة</div>
              )}
            </div>
          </div>
        </div>

        {/* أزرار الحفظ والإلغاء */}
        <div className="flex justify-end gap-2 mt-6">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isUpdating}
          >
            <X className="h-4 w-4 mr-2" />
            إلغاء
          </Button>
          <Button
            onClick={handleSave}
            disabled={isUpdating || roles.length === 0}
          >
            <Save className="h-4 w-4 mr-2" />
            {isUpdating ? 'جاري الحفظ...' : 'حفظ التغييرات'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
