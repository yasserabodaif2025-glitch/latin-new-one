import { axiosInstance } from '../axiosInstance'
import { apis } from '../const/api.enum'

export interface Permission {
  id: number
  code: string | null
  description: string | null
}

export interface Role {
  id: number
  name: string | null
  description: string | null
  usersCount: number
  createdAt: string
  updatedAt: string
  permissions: Permission[] | null
}

export interface RolePaginationResult {
  data: Role[] | null
  total: number
}

export interface PaginationParams {
  Page?: number
  Limit?: number
  SortField?: string
  IsDesc?: boolean
  FreeText?: string
  OnlyDeleted?: boolean
}

export interface CreateRoleDto {
  name: string | null
  description: string | null
  permissionIds?: number[] | null
}

export interface UpdateRoleDto {
  name: string | null
  description: string | null
  permissionIds?: number[] | null
}

export const rolesService = {
  // Get roles with pagination
  async getRoles(
    params: PaginationParams = {},
    serverHeaders?: Record<string, string>
  ): Promise<RolePaginationResult> {
    try {
      console.log('Fetching roles with params:', params)
      const queryParams = new URLSearchParams()

      if (params.Page !== undefined) queryParams.append('Page', params.Page.toString())
      if (params.Limit !== undefined) queryParams.append('Limit', params.Limit.toString())
      if (params.SortField) queryParams.append('SortField', params.SortField)
      if (params.IsDesc !== undefined) queryParams.append('IsDesc', params.IsDesc.toString())
      if (params.FreeText) queryParams.append('FreeText', params.FreeText)
      if (params.OnlyDeleted !== undefined)
        queryParams.append('OnlyDeleted', params.OnlyDeleted.toString())

      const fullUrl = `${apis.roles}/${apis.pagination}?${queryParams}`
      // Diagnostic: log whether a server header was provided and whether it contains Authorization
      if (serverHeaders) {
        console.log(
          'rolesService.getRoles: serverHeaders provided. has Authorization?',
          Boolean(serverHeaders['Authorization'] || serverHeaders['authorization'])
        )
      } else {
        console.log('rolesService.getRoles: no serverHeaders provided')
      }

      console.log('rolesService.getRoles: requesting URL ->', fullUrl)
      const response = await axiosInstance.get<RolePaginationResult>(
        fullUrl,
        serverHeaders ? { headers: serverHeaders } : undefined
      )
      console.log('Roles fetched successfully:', response.data)
      return response.data
    } catch (error: any) {
      console.error('Error fetching roles:', error)

      if (error.response) {
        console.error('Response data:', error.response.data)
        console.error('Response status:', error.response.status)
        throw new Error(error.response.data?.message || 'فشل جلب قائمة الأدوار')
      } else if (error.request) {
        console.error('No response received:', error.request)
        throw new Error('لا يوجد اتصال بالخادم. يرجى التحقق من اتصال الشبكة والمحاولة مرة أخرى.')
      } else {
        console.error('Error setting up request:', error.message)
        throw new Error('حدث خطأ أثناء إعداد الطلب. الرجاء المحاولة مرة أخرى.')
      }
    }
  },

  // Get role by ID
  async getRoleById(id: number): Promise<Role> {
    try {
      console.log(`Fetching role with ID ${id}...`)
      const response = await axiosInstance.get<Role>(`${apis.roles}/${id}`)
      console.log('Role fetched successfully:', response.data)
      return response.data
    } catch (error: any) {
      console.error(`Error fetching role ${id}:`, error)
      if (error.response) {
        throw new Error(error.response.data?.message || 'فشل جلب معلومات الدور')
      } else if (error.request) {
        throw new Error('لا يوجد اتصال بالخادم. يرجى التحقق من اتصال الشبكة والمحاولة مرة أخرى.')
      } else {
        throw new Error('حدث خطأ أثناء إعداد الطلب. الرجاء المحاولة مرة أخرى.')
      }
    }
  },

  // Create a new role
  async createRole(roleData: CreateRoleDto): Promise<number> {
    try {
      console.log('Creating role with data:', roleData)
      const response = await axiosInstance.post<number>(apis.roles, roleData)
      console.log('Role created successfully with ID:', response.data)
      return response.data
    } catch (error: any) {
      console.error('Error creating role:', error)
      if (error.response) {
        throw new Error(
          error.response.data?.message || 'فشل إنشاء الدور. الرجاء التحقق من البيانات المدخلة.'
        )
      } else if (error.request) {
        throw new Error('لا يوجد اتصال بالخادم. يرجى التحقق من اتصال الشبكة والمحاولة مرة أخرى.')
      } else {
        throw new Error('حدث خطأ أثناء إعداد الطلب. الرجاء المحاولة مرة أخرى.')
      }
    }
  },

  // Update an existing role
  async updateRole(id: number, roleData: UpdateRoleDto): Promise<void> {
    try {
      console.log(`Updating role ${id} with data:`, roleData)
      await axiosInstance.put(`${apis.roles}/${id}`, roleData)
      console.log('Role updated successfully')
    } catch (error: any) {
      console.error(`Error updating role ${id}:`, error)
      if (error.response) {
        throw new Error(
          error.response.data?.message || 'فشل تحديث الدور. الرجاء التحقق من البيانات المدخلة.'
        )
      } else if (error.request) {
        throw new Error('لا يوجد اتصال بالخادم. يرجى التحقق من اتصال الشبكة والمحاولة مرة أخرى.')
      } else {
        throw new Error('حدث خطأ أثناء إعداد الطلب. الرجاء المحاولة مرة أخرى.')
      }
    }
  },

  // Delete a role
  async deleteRole(id: number): Promise<void> {
    try {
      console.log(`Deleting role ${id}...`)
      await axiosInstance.delete(`${apis.roles}/${id}`)
      console.log('Role deleted successfully')
    } catch (error: any) {
      console.error(`Error deleting role ${id}:`, error)
      if (error.response) {
        throw new Error(error.response.data?.message || 'فشل حذف الدور')
      } else if (error.request) {
        throw new Error('لا يوجد اتصال بالخادم. يرجى التحقق من اتصال الشبكة والمحاولة مرة أخرى.')
      } else {
        throw new Error('حدث خطأ أثناء إعداد الطلب. الرجاء المحاولة مرة أخرى.')
      }
    }
  },

  // Restore a deleted role
  async restoreRole(id: number): Promise<void> {
    try {
      console.log(`Restoring role ${id}...`)
      await axiosInstance.put(`${apis.roles}/${apis.restore}/${id}`)
      console.log('Role restored successfully')
    } catch (error: any) {
      console.error(`Error restoring role ${id}:`, error)
      if (error.response) {
        throw new Error(error.response.data?.message || 'فشل استعادة الدور')
      } else if (error.request) {
        throw new Error('لا يوجد اتصال بالخادم. يرجى التحقق من اتصال الشبكة والمحاولة مرة أخرى.')
      } else {
        throw new Error('حدث خطأ أثناء إعداد الطلب. الرجاء المحاولة مرة أخرى.')
      }
    }
  },

  // Get all permissions
  async getAllPermissions(): Promise<Permission[]> {
    try {
      console.log('Fetching all permissions...')
      const response = await axiosInstance.get<Permission[]>(`${apis.roles}/permissions`)
      console.log('Permissions fetched successfully:', response.data)
      return response.data
    } catch (error: any) {
      console.error('Error fetching permissions:', error)
      if (error.response) {
        throw new Error(error.response.data?.message || 'فشل جلب قائمة الصلاحيات')
      } else if (error.request) {
        throw new Error('لا يوجد اتصال بالخادم. يرجى التحقق من اتصال الشبكة والمحاولة مرة أخرى.')
      } else {
        throw new Error('حدث خطأ أثناء إعداد الطلب. الرجاء المحاولة مرة أخرى.')
      }
    }
  },

  // Get role permissions
  async getRolePermissions(roleId: number): Promise<Permission[]> {
    try {
      console.log(`Fetching permissions for role ${roleId}...`)
      const response = await axiosInstance.get<Permission[]>(`${apis.roles}/${roleId}/permissions`)
      console.log('Role permissions fetched successfully:', response.data)
      return response.data
    } catch (error: any) {
      console.error(`Error fetching permissions for role ${roleId}:`, error)
      if (error.response) {
        throw new Error(error.response.data?.message || 'فشل جلب صلاحيات الدور')
      } else if (error.request) {
        throw new Error('لا يوجد اتصال بالخادم. يرجى التحقق من اتصال الشبكة والمحاولة مرة أخرى.')
      } else {
        throw new Error('حدث خطأ أثناء إعداد الطلب. الرجاء المحاولة مرة أخرى.')
      }
    }
  },

  // Update role permissions
  async updateRolePermissions(roleId: number, permissionIds: string[]): Promise<void> {
    try {
      console.log(`Updating permissions for role ${roleId}:`, permissionIds)
      await axiosInstance.put(`${apis.roles}/${roleId}/permissions`, { permissionIds })
      console.log('Role permissions updated successfully')
    } catch (error: any) {
      console.error(`Error updating permissions for role ${roleId}:`, error)
      if (error.response) {
        throw new Error(error.response.data?.message || 'فشل تحديث صلاحيات الدور')
      } else if (error.request) {
        throw new Error('لا يوجد اتصال بالخادم. يرجى التحقق من اتصال الشبكة والمحاولة مرة أخرى.')
      } else {
        throw new Error('حدث خطأ أثناء إعداد الطلب. الرجاء المحاولة مرة أخرى.')
      }
    }
  },
}
