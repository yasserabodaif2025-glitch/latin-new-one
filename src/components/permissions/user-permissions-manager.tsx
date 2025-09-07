'use client'

import React, { useState, useEffect } from 'react'
import useSWR from 'swr'
import { axiosFetcher } from '@/lib/swr-fetchers'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { ShieldCheck, User, Settings } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'

interface Permission {
  id: number
  code: string
  description: string
}

interface Role {
  id: number
  name: string
  permissions?: Permission[]
}

interface Employee {
  id: number
  name: string
  email: string
  roleId?: number
}

interface UserPermissionsManagerProps {
  employee: Employee
  onPermissionsUpdated?: () => void
}

export const UserPermissionsManager = ({ employee, onPermissionsUpdated }: UserPermissionsManagerProps) => {
  const [open, setOpen] = useState(false)
  const [selectedRoles, setSelectedRoles] = useState<number[]>([])
  const [loading, setLoading] = useState(false)

  // Fetch available roles only when dialog is open
  const { data: roles = [] as Role[] } = useSWR(
    open ? '/api/Roles' : null, 
    axiosFetcher
  )
  
  // Fetch available permissions only when dialog is open
  const { data: permissions = [] as Permission[] } = useSWR(
    open ? '/api/HelpTables/Permission' : null, 
    axiosFetcher
  )

  // Initialize selected roles
  useEffect(() => {
    if (employee.roleId) {
      setSelectedRoles([employee.roleId])
    }
  }, [employee.roleId])

  const handleRoleToggle = (roleId: number) => {
    setSelectedRoles(prev => 
      prev.includes(roleId) 
        ? prev.filter(id => id !== roleId)
        : [...prev, roleId]
    )
  }

  const handleSavePermissions = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/Employees/${employee.id}/roles`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          roleIds: selectedRoles
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to update permissions')
      }

      toast.success('تم تحديث الصلاحيات بنجاح')
      setOpen(false)
      onPermissionsUpdated?.()
    } catch (error) {
      console.error('Error updating permissions:', error)
      toast.error('فشل في تحديث الصلاحيات')
    } finally {
      setLoading(false)
    }
  }

  const getAllPermissionsFromSelectedRoles = () => {
    const allPermissions = new Set<string>()
    roles
      .filter((role: Role) => selectedRoles.includes(role.id))
      .forEach((role: Role) => {
        role.permissions?.forEach((permission: Permission) => {
          allPermissions.add(permission.code)
        })
      })
    return Array.from(allPermissions)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <ShieldCheck className="h-4 w-4" />
          إدارة الصلاحيات
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            إدارة صلاحيات المستخدم
          </DialogTitle>
          <DialogDescription>
            إدارة الصلاحيات لـ <strong>{employee.name}</strong> ({employee.email})
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Roles Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                الأدوار
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                اختر الأدوار المناسبة للمستخدم
              </p>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[300px]">
                <div className="space-y-3">
                  {roles.map((role: Role) => (
                    <div key={role.id} className="flex items-start space-x-3 space-x-reverse">
                      <Checkbox
                        id={`role-${role.id}`}
                        checked={selectedRoles.includes(role.id)}
                        onCheckedChange={() => handleRoleToggle(role.id)}
                      />
                      <div className="grid gap-1.5 leading-none">
                        <Label
                          htmlFor={`role-${role.id}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {role.name}
                        </Label>
                        {role.permissions && role.permissions.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {role.permissions.slice(0, 3).map((permission: Permission) => (
                              <Badge key={permission.id} variant="secondary" className="text-xs">
                                {permission.code}
                              </Badge>
                            ))}
                            {role.permissions.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{role.permissions.length - 3} المزيد
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Permissions Preview Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4" />
                الصلاحيات الفعالة
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                معاينة الصلاحيات التي سيحصل عليها المستخدم
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Selected Roles */}
                <div>
                  <Label className="text-sm font-medium">
                    الأدوار المحددة:
                  </Label>
                  <div className="mt-1">
                    {selectedRoles.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {roles
                          .filter((role: Role) => selectedRoles.includes(role.id))
                          .map((role: Role) => (
                            <Badge key={role.id} variant="default">
                              {role.name}
                            </Badge>
                          ))
                        }
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        لم يتم تحديد أي أدوار
                      </p>
                    )}
                  </div>
                </div>

                <Separator />

                {/* Effective Permissions */}
                <div>
                  <Label className="text-sm font-medium">
                    الصلاحيات:
                  </Label>
                  <ScrollArea className="h-[200px] mt-1">
                    <div className="space-y-2">
                      {getAllPermissionsFromSelectedRoles().length > 0 ? (
                        getAllPermissionsFromSelectedRoles().map((permissionCode) => {
                          const permission = permissions.find((p: Permission) => p.code === permissionCode)
                          return (
                            <div key={permissionCode} className="flex items-center justify-between p-2 rounded-md bg-muted/50">
                              <span className="text-sm font-mono">{permissionCode}</span>
                              {permission?.description && (
                                <span className="text-xs text-muted-foreground">
                                  {permission.description}
                                </span>
                              )}
                            </div>
                          )
                        })
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          لا توجد صلاحيات
                        </p>
                      )}
                    </div>
                  </ScrollArea>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button variant="outline" onClick={() => setOpen(false)}>
            إلغاء
          </Button>
          <Button onClick={handleSavePermissions} disabled={loading}>
            {loading ? 'جاري الحفظ...' : 'حفظ الصلاحيات'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default UserPermissionsManager
