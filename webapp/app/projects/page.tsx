"use client";

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter, useSearchParams } from 'next/navigation'
import type { Project, ProjectType } from '@/types/project.type'
import { ProjectStatus } from '@/types/shared.type'
import ProjectModal from './ProjectCreationModal';
import { PageUrl } from '@/configs/page.url';
import { formatCurrency } from '@/lib/curency';
import ProjectTypeTab from './ProjectTypeTab';
import ProjectTab from './ProjectTab';
import ProjectTypeModal from './ProjectTypeCreationModal';
import { useProjectTypeManagement } from '@/hooks/useProjectTypeManagement';
import { useProjectManagement } from '@/hooks/useProjectManagement';
import NavbarAuthenticated from '@/components/NavbarAuthenticated';

export default function CustomerProjectsPage() {
  const { user } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [projects, setProjects] = useState<Project[]>([])
  const [projectsLoading, setProjectsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'projects' | 'project-types'>('projects')
  const [filter, setFilter] = useState({
    search: '',
    status: 'all',
    dateRange: 'all',
    budget: 'all',
    skills: ''
  })

  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showProjectTypeModal, setShowProjectTypeModal] = useState(false)
  const [editingProjectType, setEditingProjectType] = useState<ProjectType | null>(null)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [sortBy, setSortBy] = useState('createdAt')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  // Use the Project management hook
  const {
    projects: apiProjects,
    isLoading: projectsApiLoading,
    error: projectsApiError,
    createProject,
    getProjects,
    updateProject,
    deleteProject,
    refreshProjects,
    clearError: clearProjectsError
  } = useProjectManagement()

  // Fetch projects when user is available
  useEffect(() => {
    if (user?.id) {
      const fetchProjects = async () => {
        setProjectsLoading(true)
        try {
          const fetchedProjects = await getProjects()
          if (fetchedProjects) {
            setProjects(fetchedProjects)
          }
        } catch (error) {
          console.error('Error fetching projects:', error)
        } finally {
          setProjectsLoading(false)
        }
      }
      
      fetchProjects()
    }
  }, [user, getProjects])

  // Sync API projects with local state
  useEffect(() => {
    if (apiProjects) {
      setProjects(apiProjects)
      setProjectsLoading(false)
    }
  }, [apiProjects])

  // Use the ProjectType management hook
  const {
    projectTypes,
    loading: projectTypesLoading,
    error: projectTypesError,
    createProjectType,
    getProjectTypes,
    updateProjectType,
    deleteProjectType,
    refreshProjectTypes,
    clearError
  } = useProjectTypeManagement()

  // Load project types on component mount
  useEffect(() => {
    getProjectTypes()
  }, [getProjectTypes])

  // ProjectType CRUD operations using API
  const handleCreateProjectType = async (projectTypeData: Partial<ProjectType>) => {
    if (!projectTypeData.name) return

    const result = await createProjectType({ name: projectTypeData.name })
    if (result) {
      setShowProjectTypeModal(false)
    }
  }

  const handleUpdateProjectType = async (projectTypeId: string, updates: Partial<ProjectType>) => {
    if (!updates.name) return

    const result = await updateProjectType({ id: projectTypeId, name: updates.name })
    if (result) {
      setEditingProjectType(null)
    }
  }

  useEffect(() => {
    // Handle URL parameters
    const action = searchParams.get('action')
    const editId = searchParams.get('edit')

    if (action === 'create') {
      setShowCreateModal(true)
    } else if (editId) {
      const projectToEdit = projects.find(p => p.id === editId)
      if (projectToEdit) {
        setEditingProject(projectToEdit)
      }
    }
  }, [searchParams, projects])

  const filteredAndSortedProjects = projects
    .filter(project => {
      const matchesSearch = project.title.toLowerCase().includes(filter.search.toLowerCase()) ||
        (project.description || '').toLowerCase().includes(filter.search.toLowerCase())
      const matchesStatus = filter.status === 'all' || project.status === filter.status
      const matchesSkills = filter.skills === '' ||
        project.requiredSkills?.some(skill => skill.toLowerCase().includes(filter.skills.toLowerCase()))

      let matchesBudget = true
      if (filter.budget !== 'all' && project.budget) {
        if (filter.budget === 'low') matchesBudget = project.budget < 10000000
        else if (filter.budget === 'medium') matchesBudget = project.budget >= 10000000 && project.budget < 25000000
        else if (filter.budget === 'high') matchesBudget = project.budget >= 25000000
      }

      let matchesDate = true
      if (filter.dateRange !== 'all') {
        const now = new Date()
        const daysDiff = Math.floor((now.getTime() - (project.createdDate || new Date()).getTime()) / (1000 * 60 * 60 * 24))
        if (filter.dateRange === 'week') matchesDate = daysDiff <= 7
        else if (filter.dateRange === 'month') matchesDate = daysDiff <= 30
        else if (filter.dateRange === 'quarter') matchesDate = daysDiff <= 90
      }

      return matchesSearch && matchesStatus && matchesSkills && matchesBudget && matchesDate
    })
    .sort((a, b) => {
      let aValue = a[sortBy as keyof Project]
      let bValue = b[sortBy as keyof Project]

      if (aValue instanceof Date && bValue instanceof Date) {
        return sortOrder === 'asc' ? aValue.getTime() - bValue.getTime() : bValue.getTime() - aValue.getTime()
      }

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortOrder === 'asc' ? aValue - bValue : bValue - aValue
      }

      return sortOrder === 'asc' ?
        String(aValue).localeCompare(String(bValue)) :
        String(bValue).localeCompare(String(aValue))
    })

  const handleCreateProject = async (projectData: any) => {
    try {
      const result = await createProject(projectData)
      if (result) {
        setShowCreateModal(false)
        // Projects will be automatically updated via the hook
      }
    } catch (error) {
      console.error('Error creating project:', error)
    }
  }

  const handleUpdateProject = async (projectId: string, updates: any) => {
    try {
      const result = await updateProject({ id: projectId, ...updates })
      if (result) {
        setEditingProject(null)
        // Projects will be automatically updated via the hook
      }
    } catch (error) {
      console.error('Error updating project:', error)
    }
  }

  const handleDeleteProject = async (projectId: string) => {
    if (window.confirm(' xóa dự án này?')) {
      try {
        const result = await deleteProject(projectId)
        if (result) {
          // Projects will be automatically updated via the hook
        }
      } catch (error) {
        console.error('Error deleting project:', error)
      }
    }
  }



  const getStatusColor = (status: Project['status']) => {
    switch (status) {
      case ProjectStatus.OPEN_APPLYING: return 'bg-green-100 text-green-800'
      case ProjectStatus.IN_PROGRESS: return 'bg-blue-100 text-blue-800'
      case ProjectStatus.COMPLETED: return 'bg-gray-100 text-gray-800'
      case ProjectStatus.CANCELLED: return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: Project['status']) => {
    switch (status) {
      case ProjectStatus.OPEN_APPLYING: return 'Đang tuyển'
      case ProjectStatus.IN_PROGRESS: return 'Đang thực hiện'
      case ProjectStatus.COMPLETED: return 'Hoàn thành'
      case ProjectStatus.CANCELLED: return 'Đã hủy'
      default: return 'Không xác định'
    }
  }

  const resetFilters = () => {
    setFilter({
      search: '',
      status: 'all',
      dateRange: 'all',
      budget: 'all',
      skills: ''
    })
  }

  const handleBackToProfile = () => {
    router.push('/profile-employer')
  }

  if (projectsLoading || projectsApiLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* <NavbarAuthenticated /> */}
      <div className="flex">
        {/* Sidebar */}
        <div className="w-80 bg-white shadow-sm border-r border-gray-200 h-screen sticky top-0">
          <div className="p-6">
            {/* Back to Profile Button */}
            <div className="mb-6">
              <button
                onClick={handleBackToProfile}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 text-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span>Quay lại trang chủ</span>
              </button>
            </div>

            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Bộ lọc</h2>
              <button
                onClick={resetFilters}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Đặt lại
              </button>
            </div>

            {/* Company Info Card */}
            {/* <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-2m-2 0H7m10 0v-2a2 2 0 00-2-2h-2a2 2 0 00-2 2v2m2-6V9a2 2 0 012-2h2a2 2 0 012 2v2M9 7h6m-6 4h6m-6 4h6" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">TechViet Solutions</p>
                  <p className="text-xs text-gray-500">Nhà tuyển dụng</p>
                </div>
              </div>
            </div> */}

            {/* Search */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tìm kiếm
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Tìm kiếm dự án..."
                  value={filter.search}
                  onChange={(e) => setFilter(prev => ({ ...prev, search: e.target.value }))}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <svg className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* Status Filter */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Trạng thái
              </label>
              <select
                value={filter.status}
                onChange={(e) => setFilter(prev => ({ ...prev, status: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Tất cả</option>
                <option value={ProjectStatus.OPEN_APPLYING}>Đang tuyển</option>
                <option value={ProjectStatus.IN_PROGRESS}>Đang thực hiện</option>
                <option value={ProjectStatus.COMPLETED}>Hoàn thành</option>
                <option value={ProjectStatus.CANCELLED}>Đã hủy</option>
              </select>
            </div>

            {/* Budget Filter */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ngân sách
              </label>
              <select
                value={filter.budget}
                onChange={(e) => setFilter(prev => ({ ...prev, budget: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Tất cả</option>
                <option value="low">Dưới 10 triệu</option>
                <option value="medium">10-25 triệu</option>
                <option value="high">Trên 25 triệu</option>
              </select>
            </div>

            {/* Date Range Filter */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Thời gian đăng
              </label>
              <select
                value={filter.dateRange}
                onChange={(e) => setFilter(prev => ({ ...prev, dateRange: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Tất cả</option>
                <option value="week">7 ngày qua</option>
                <option value="month">30 ngày qua</option>
                <option value="quarter">90 ngày qua</option>
              </select>
            </div>

            {/* Skills Filter */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kỹ năng
              </label>
              <input
                type="text"
                placeholder="React, Node.js..."
                value={filter.skills}
                onChange={(e) => setFilter(prev => ({ ...prev, skills: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Sort Options */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sắp xếp theo
              </label>
              <div className="space-y-2">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="createdDate">Ngày tạo</option>
                  <option value="updatedDate">Ngày cập nhật</option>
                  <option value="endDate">Deadline</option>
                  <option value="budget">Ngân sách</option>
                  <option value="title">Tên dự án</option>
                </select>
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="desc">Giảm dần</option>
                  <option value="asc">Tăng dần</option>
                </select>
              </div>
            </div>

            {/* Stats */}
            {/* <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Thống kê</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tổng dự án:</span>
                  <span className="font-medium">{projects.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Đang tuyển:</span>
                  <span className="font-medium text-green-600">{projects.filter(p => p.status === ProjectStatus.OPEN_APPLYING).length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Đang thực hiện:</span>
                  <span className="font-medium text-blue-600">{projects.filter(p => p.status === ProjectStatus.IN_PROGRESS).length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Hoàn thành:</span>
                  <span className="font-medium text-gray-600">{projects.filter(p => p.status === ProjectStatus.COMPLETED).length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tổng giá trị:</span>
                  <span className="font-medium text-purple-600">
                    {formatCurrency(projects.reduce((sum, p) => sum + (p.budget || 0), 0))}
                  </span>
                </div>
              </div>
            </div> */}

          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Quản lý dự án</h1>
              <p className="text-gray-600">
                {activeTab === 'projects'
                  ? `Quản lý ${filteredAndSortedProjects.length} dự án của bạn`
                  : `Quản lý ${(projectTypes || []).filter(pt => !pt.isDeleted).length} loại dự án`
                }
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={handleBackToProfile}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2 cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>Xem Profile</span>
              </button>
              {activeTab === 'projects' ? (
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 cursor-pointer"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span>Đăng dự án mới</span>
                </button>
              ) :
                (
                  <button
                    onClick={() => {
                      console.log('Button clicked, setting showProjectTypeModal to true')
                      setShowProjectTypeModal(true)
                    }}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 cursor-pointer"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span>Thêm loại dự án</span>
                  </button>
                )
              }
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="bg-white rounded-lg shadow-sm mb-6">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6">
                <button
                  onClick={() => setActiveTab('projects')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === 'projects'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                >
                  Dự án ({projects.length})
                </button>
                <button
                  onClick={() => setActiveTab('project-types')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === 'project-types'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                >
                  Loại dự án ({(projectTypes || []).filter(pt => !pt.isDeleted).length})
                </button>
              </nav>
            </div>
          </div>

          {/* Content based on active tab */}
          {activeTab === 'projects' ? (
            <ProjectTab
              projects={projects}
              filteredAndSortedProjects={filteredAndSortedProjects}
              setShowCreateModal={setShowCreateModal}
              handleBackToProfile={handleBackToProfile}
              setEditingProject={setEditingProject}
              handleDeleteProject={handleDeleteProject}
            />
          ) : (
            <ProjectTypeTab
              showProjectTypeModal={showProjectTypeModal}
              setShowProjectTypeModal={setShowProjectTypeModal}
              projectTypes={projectTypes || []}
              loading={projectTypesLoading}
              error={projectTypesError}
              deleteProjectType={deleteProjectType}
              clearError={clearError}
              refreshProjectTypes={refreshProjectTypes}
              setEditingProjectType={setEditingProjectType}
            />
          )}
        </div>
      </div>

      {/* Create/Edit Project Modal */}
      {(showCreateModal || editingProject) && (
        <ProjectModal
          project={editingProject}
          onClose={() => {
            setShowCreateModal(false)
            setEditingProject(null)
            // Clear URL params
            router.push(PageUrl.Customer.PROJECTS_PAGE)
          }}
          onSave={editingProject ?
            (updates) => handleUpdateProject(editingProject.id, updates) :
            handleCreateProject
          }
        />
      )}

      {/* Create/Edit ProjectType Modal */}
      {
        (showProjectTypeModal || editingProjectType) && (
          <ProjectTypeModal
            projectType={editingProjectType}
            onClose={() => {
              // console.log('Modal onClose called')
              setShowProjectTypeModal(false)
              setEditingProjectType(null)
            }}
            onSave={editingProjectType ?
              (updates: Partial<ProjectType>) => handleUpdateProjectType(editingProjectType.id, updates) :
              handleCreateProjectType
            }
          />
        )
      }
    </div>
  )
}


