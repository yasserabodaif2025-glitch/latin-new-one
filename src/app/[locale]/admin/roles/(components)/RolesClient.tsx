'use client'

import { useEffect, useState, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { Role, rolesService } from '@/lib/api/roles.service'
import { DataTable } from '@/components/ui/data-table'
import { columns } from '../columns'
import { useToast } from '@/components/ui/use-toast'
import { RoleForm } from '../role-form'
import { PermissionsForm } from '../permissions-form'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

type Props = {
  initialData: Role[]
  forceFetch?: boolean
}

export default function RolesClient({ initialData, forceFetch }: Props) {
  const t = useTranslations('roles')
  const { toast } = useToast()
  const [roles, setRoles] = useState<Role[]>(initialData || [])
  const [loading, setLoading] = useState(false)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isPermissionsFormOpen, setIsPermissionsFormOpen] = useState(false)
  const [selectedRole, setSelectedRole] = useState<Role | null>(null)

  const fetchRoles = useCallback(async () => {
    setLoading(true)
    try {
      const response = await rolesService.getRoles()
      setRoles(response.data || [])
    } catch {
      console.error('Error fetching roles (client)')
      toast({ title: t('error'), description: t('fetchError'), variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }, [t, toast])

  useEffect(() => {
    if (forceFetch) {
      // Force fetching on the client so browser cookies are sent to the API.
      void fetchRoles()
    }
  }, [fetchRoles, forceFetch])

  const handleEdit = (role: Role) => {
    setSelectedRole(role)
    setIsFormOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm(t('confirmDelete'))) return

    try {
      await rolesService.deleteRole(id)
      toast({ title: t('success'), description: t('deleteSuccess') })
      fetchRoles()
    } catch (err) {
      toast({ title: t('error'), description: t('deleteError'), variant: 'destructive' })
    }
  }

  const handleSuccess = () => {
    setIsFormOpen(false)
    setSelectedRole(null)
    fetchRoles()
  }

  const handleManagePermissions = (role: Role) => {
    setSelectedRole(role)
    setIsPermissionsFormOpen(true)
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t('title')}</h1>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          {t('addRole')}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('rolesList')}</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns(handleEdit, handleDelete, handleManagePermissions)}
            data={roles}
            loading={loading}
          />
        </CardContent>
      </Card>

      <RoleForm
        open={isFormOpen}
        onOpenChange={(open) => {
          if (!open) setSelectedRole(null)
          setIsFormOpen(open)
        }}
        onSuccess={handleSuccess}
        role={selectedRole}
      />

      {selectedRole && selectedRole.name && (
        <PermissionsForm
          open={isPermissionsFormOpen}
          onOpenChange={(open) => {
            if (!open) setSelectedRole(null)
            setIsPermissionsFormOpen(open)
          }}
          onSuccess={handleSuccess}
          roleId={selectedRole.id}
          roleName={selectedRole.name}
        />
      )}
    </div>
  )
}
