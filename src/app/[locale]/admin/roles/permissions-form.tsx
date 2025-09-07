'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form'
import { Checkbox } from '@/components/ui/checkbox'
import { ScrollArea } from '@/components/ui/scroll-area'
import { rolesService, Permission as ApiPermission } from '@/lib/api/roles.service'

type Permission = {
  id: string
  name: string
  description: string
  category: string
}

const formSchema = z.object({
  permissions: z.array(z.string()).default([]),
})

type FormValues = z.infer<typeof formSchema>

interface PermissionsFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
  roleId: number
  roleName: string
}

export function PermissionsForm({
  open,
  onOpenChange,
  onSuccess,
  roleId,
  roleName,
}: PermissionsFormProps) {
  const t = useTranslations('roles')
  const [loading, setLoading] = useState(false)
  const [groupedPermissions, setGroupedPermissions] = useState<Record<string, Permission[]>>({})

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      permissions: [],
    },
  })

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const data = await rolesService.getAllPermissions()

        // Group permissions by category - create mock categories since API doesn't provide them
        const grouped = data.reduce((acc: Record<string, Permission[]>, permission: ApiPermission) => {
          // Use permission code as category or default to 'General'
          const category = permission.code?.split('_')[0] || 'General'
          if (!acc[category]) {
            acc[category] = []
          }
          acc[category].push({
            id: permission.id.toString(),
            name: permission.code || 'Unknown Permission',
            description: permission.description || '',
            category
          })
          return acc
        }, {})

        setGroupedPermissions(grouped)
      } catch (error) {
        console.error('Error fetching permissions:', error)
      }
    }

    const fetchRolePermissions = async () => {
      try {
        const rolePermissions = await rolesService.getRolePermissions(roleId)
        form.setValue(
          'permissions',
          rolePermissions.map((p: ApiPermission) => p.id.toString())
        )
      } catch (error) {
        console.error('Error fetching role permissions:', error)
      }
    }

    if (open) {
      fetchPermissions()
      if (roleId) {
        fetchRolePermissions()
      }
    }
  }, [open, roleId, form])

  const onSubmit = async (values: FormValues) => {
    try {
      setLoading(true)
      await rolesService.updateRolePermissions(roleId, values.permissions)
      onSuccess()
      onOpenChange(false)
    } catch (error) {
      console.error('Error updating permissions:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[80vh] max-w-3xl flex-col">
        <DialogHeader>
          <DialogTitle>
            {t('managePermissions')} - {roleName}
          </DialogTitle>
          <DialogDescription>{t('managePermissionsDescription')}</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-1 flex-col">
            <ScrollArea className="flex-1 pr-4">
              <div className="space-y-6 py-2">
                {Object.entries(groupedPermissions).map(([category, categoryPermissions]) => (
                  <div key={category} className="space-y-2">
                    <h3 className="font-medium">{category}</h3>
                    <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                      {categoryPermissions.map((permission) => (
                        <FormField
                          key={permission.id}
                          control={form.control}
                          name="permissions"
                          render={({ field }) => (
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(permission.id) || false}
                                  onCheckedChange={(checked) => {
                                    const currentValue = field.value || []
                                    return checked
                                      ? field.onChange([...currentValue, permission.id])
                                      : field.onChange(
                                          currentValue.filter((value) => value !== permission.id)
                                        )
                                  }}
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel className="cursor-pointer font-normal">
                                  {permission.name}
                                </FormLabel>
                                {permission.description && (
                                  <p className="text-sm text-muted-foreground">
                                    {permission.description}
                                  </p>
                                )}
                              </div>
                            </FormItem>
                          )}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <DialogFooter className="mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={loading}
              >
                {t('cancel')}
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? t('saving') : t('save')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
