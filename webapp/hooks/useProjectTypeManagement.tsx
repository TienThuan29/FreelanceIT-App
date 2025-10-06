import { useState, useCallback } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import useAxios from './useAxios'
import { Api } from '@/configs/api'
import type { ProjectType } from '@/types/project.type'

interface ProjectTypeCreateRequest {
  name: string
}

interface ProjectTypeUpdateRequest {
  id: string
  name: string
}

interface UseProjectTypeManagementReturn {
  projectTypes: ProjectType[]
  loading: boolean
  error: string | null

  createProjectType: (data: ProjectTypeCreateRequest) => Promise<ProjectType | null>
  getProjectTypes: () => Promise<ProjectType[] | null>
  getProjectTypeById: (id: string) => Promise<ProjectType | null>
  updateProjectType: (data: ProjectTypeUpdateRequest) => Promise<ProjectType | null>
  deleteProjectType: (id: string) => Promise<boolean>

  refreshProjectTypes: () => Promise<void>
  clearError: () => void
}

export const useProjectTypeManagement = (): UseProjectTypeManagementReturn => {
  const { user } = useAuth()
  const api = useAxios()

  const [projectTypes, setProjectTypes] = useState<ProjectType[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Clear error function
  const clearError = useCallback(() => {
    setError(null)
  }, [])

  // Create ProjectType
  const createProjectType = useCallback(async (data: ProjectTypeCreateRequest): Promise<ProjectType | null> => {
    if (!user) {
      setError('User not authenticated')
      return null
    }

    setLoading(true)
    setError(null)

    try {
      const response = await api.post(Api.Project.CREATE_PROJECT_TYPE, data)

      if (response.data.success) {
        const newProjectType = response.data.dataResponse
        setProjectTypes(prev => [newProjectType, ...prev])
        return newProjectType
      } else {
        setError(response.data.message || 'Failed to create project type')
        return null
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to create project type'
      setError(errorMessage)
      return null
    } finally {
      setLoading(false)
    }
  }, [user, api])

  // Get all ProjectTypes by user ID
  const getProjectTypes = useCallback(async (): Promise<ProjectType[] | null> => {
    if (!user) {
      setError('User not authenticated')
      return null
    }

    setLoading(true)
    setError(null)

    try {
      const response = await api.get(Api.Project.GET_PROJECT_TYPES_BY_USER)
      console.log('response', response)

      if (response.data.success) {
        const types = response.data.dataResponse || []
        setProjectTypes(types)
        return types
      } else {
        setError(response.data.message || 'Failed to fetch project types')
        return null
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch project types'
      setError(errorMessage)
      return null
    } finally {
      setLoading(false)
    }
  }, [user, api])

  // Get ProjectType by ID
  const getProjectTypeById = useCallback(async (id: string): Promise<ProjectType | null> => {
    if (!user) {
      setError('User not authenticated')
      return null
    }

    setLoading(true)
    setError(null)

    try {
      const response = await api.get(`${Api.Project.GET_PROJECT_TYPE_BY_ID}/${id}`)

      if (response.data.success) {
        return response.data.dataResponse
      } else {
        setError(response.data.message || 'Project type not found')
        return null
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch project type'
      setError(errorMessage)
      return null
    } finally {
      setLoading(false)
    }
  }, [user, api])

  // Update ProjectType
  const updateProjectType = useCallback(async (data: ProjectTypeUpdateRequest): Promise<ProjectType | null> => {
    if (!user) {
      setError('User not authenticated')
      return null
    }

    setLoading(true)
    setError(null)

    try {
      const response = await api.put(`${Api.Project.UPDATE_PROJECT_TYPE}/${data.id}`, {
        name: data.name
      })

      if (response.data.success) {
        const updatedProjectType = response.data.dataResponse
        setProjectTypes(prev =>
          prev.map(type =>
            type.id === data.id ? updatedProjectType : type
          )
        )
        return updatedProjectType
      } else {
        setError(response.data.message || 'Failed to update project type')
        return null
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to update project type'
      setError(errorMessage)
      return null
    } finally {
      setLoading(false)
    }
  }, [user, api])

  // Delete ProjectType
  const deleteProjectType = useCallback(async (id: string): Promise<boolean> => {
    if (!user) {
      setError('User not authenticated')
      return false
    }

    setLoading(true)
    setError(null)

    try {
      const response = await api.delete(`${Api.Project.DELETE_PROJECT_TYPE}/${id}`)

      if (response.data.success) {
        setProjectTypes(prev => prev.filter(type => type.id !== id))
        return true
      } else {
        setError(response.data.message || 'Failed to delete project type')
        return false
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to delete project type'
      setError(errorMessage)
      return false
    } finally {
      setLoading(false)
    }
  }, [user, api])

  // Refresh ProjectTypes
  const refreshProjectTypes = useCallback(async (): Promise<void> => {
    await getProjectTypes()
  }, [getProjectTypes])

  return {
    // State
    projectTypes,
    loading,
    error,

    // ProjectType CRUD operations
    createProjectType,
    getProjectTypes,
    getProjectTypeById,
    updateProjectType,
    deleteProjectType,

    // Utility functions
    refreshProjectTypes,
    clearError
  }
}

export default useProjectTypeManagement