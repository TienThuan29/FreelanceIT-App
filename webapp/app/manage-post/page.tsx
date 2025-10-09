"use client";

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter, useSearchParams } from 'next/navigation'
import type { Project } from '@/types'

export default function ManagePostPage() {
  const { user } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState({
    search: '',
    status: 'all',
    dateRange: 'all',
    budget: 'all',
    skills: ''
  })
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [sortBy, setSortBy] = useState('createdAt')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      // Filter projects by current user as client
      const userProjects = mockProjects.filter(project =>
        project.clientId === (user?.id || 'client1')
      )
      setProjects(userProjects)
      setLoading(false)
    }, 1000)
  }, [user])

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
        project.description.toLowerCase().includes(filter.search.toLowerCase())
      const matchesStatus = filter.status === 'all' || project.status === filter.status
      const matchesSkills = filter.skills === '' ||
        project.skills.some(skill => skill.toLowerCase().includes(filter.skills.toLowerCase()))

      let matchesBudget = true
      if (filter.budget !== 'all') {
        if (filter.budget === 'low') matchesBudget = project.budget < 10000000
        else if (filter.budget === 'medium') matchesBudget = project.budget >= 10000000 && project.budget < 25000000
        else if (filter.budget === 'high') matchesBudget = project.budget >= 25000000
      }

      let matchesDate = true
      if (filter.dateRange !== 'all') {
        const now = new Date()
        const daysDiff = Math.floor((now.getTime() - project.createdAt.getTime()) / (1000 * 60 * 60 * 24))
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

  const handleCreateProject = (projectData: Partial<Project>) => {
    const newProject: Project = {
      id: Date.now().toString(),
      title: projectData.title || '',
      description: projectData.description || '',
      budget: projectData.budget || 0,
      deadline: projectData.deadline || new Date(),
      status: 'open',
      clientId: user?.id || '',
      skills: projectData.skills || [],
      createdAt: new Date(),
      updatedAt: new Date()
    }

    setProjects(prev => [newProject, ...prev])
    setShowCreateModal(false)
  }

  const handleUpdateProject = (projectId: string, updates: Partial<Project>) => {
    setProjects(prev => prev.map(project =>
      project.id === projectId
        ? { ...project, ...updates, updatedAt: new Date() }
        : project
    ))
    setEditingProject(null)
  }

  const handleDeleteProject = (projectId: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa dự án này?')) {
      setProjects(prev => prev.filter(project => project.id !== projectId))
    }
  }

  const getStatusColor = (status: Project['status']) => {
    switch (status) {
      case 'open': return 'bg-green-100 text-green-800'
      case 'in_progress': return 'bg-blue-100 text-blue-800'
      case 'completed': return 'bg-gray-100 text-gray-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: Project['status']) => {
    switch (status) {
      case 'open': return 'Đang tuyển'
      case 'in_progress': return 'Đang thực hiện'
      case 'completed': return 'Hoàn thành'
      case 'cancelled': return 'Đã hủy'
      default: return 'Không xác định'
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount)
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('vi-VN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date)
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

  if (loading) {
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
                <span>Quay lại Profile</span>
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
                <option value="open">Đang tuyển</option>
                <option value="in_progress">Đang thực hiện</option>
                <option value="completed">Hoàn thành</option>
                <option value="cancelled">Đã hủy</option>
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
                  <option value="createdAt">Ngày tạo</option>
                  <option value="updatedAt">Ngày cập nhật</option>
                  <option value="deadline">Deadline</option>
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
                  <span className="font-medium text-green-600">{projects.filter(p => p.status === 'open').length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Đang thực hiện:</span>
                  <span className="font-medium text-blue-600">{projects.filter(p => p.status === 'in_progress').length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Hoàn thành:</span>
                  <span className="font-medium text-gray-600">{projects.filter(p => p.status === 'completed').length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tổng giá trị:</span>
                  <span className="font-medium text-purple-600">
                    {formatCurrency(projects.reduce((sum, p) => sum + p.budget, 0))}
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
                Quản lý {filteredAndSortedProjects.length} dự án của bạn
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={handleBackToProfile}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>Xem Profile</span>
              </button>
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span>Đăng dự án mới</span>
              </button>
            </div>
          </div>

          {/* Quick Actions */}
          {/* <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">
                    {projects.filter(p => p.status === 'open').length} dự án đang tuyển
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">
                    {projects.filter(p => p.status === 'in_progress').length} dự án đang thực hiện
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">
                    {projects.filter(p => p.status === 'completed').length} dự án hoàn thành
                  </span>
                </div>
              </div>
              <div className="text-sm text-gray-500">
                Tổng giá trị: {formatCurrency(projects.reduce((sum, p) => sum + p.budget, 0))}
              </div>
            </div>
          </div> */}

          {/* Projects List */}
          <div className="bg-white rounded-lg shadow-sm">
            {filteredAndSortedProjects.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Không tìm thấy dự án nào
                </h3>
                <p className="text-gray-500 mb-4">
                  Thử thay đổi bộ lọc hoặc tạo dự án mới
                </p>
                <div className="space-x-3">
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Tạo dự án mới
                  </button>
                  <button
                    onClick={handleBackToProfile}
                    className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Quay lại Profile
                  </button>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/3">
                        Dự án
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ngân sách
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Trạng thái
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Deadline
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Freelancer
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Thao tác
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredAndSortedProjects.map(project => (
                      <tr key={project.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="max-w-sm">
                            <div className="text-sm font-medium text-gray-900 truncate">
                              {project.title}
                            </div>
                            <div className="text-sm text-gray-500 line-clamp-2">
                              {project.description}
                            </div>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {project.skills.slice(0, 3).map(skill => (
                                <span key={skill} className="inline-block px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded">
                                  {skill}
                                </span>
                              ))}
                              {project.skills.length > 3 && (
                                <span className="text-xs text-gray-500">+{project.skills.length - 3}</span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {formatCurrency(project.budget)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(project.status)}`}>
                            {getStatusText(project.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatDate(project.deadline)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {project.freelancerId ? (
                            <span className="text-blue-600">{project.freelancerId}</span>
                          ) : (
                            <span className="text-gray-400">Chưa có</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => setEditingProject(project)}
                              className="text-blue-600 hover:text-blue-900 p-1 rounded"
                              title="Chỉnh sửa"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleDeleteProject(project.id)}
                              className="text-red-600 hover:text-red-900 p-1 rounded"
                              title="Xóa"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Create/Edit Modal */}
      {(showCreateModal || editingProject) && (
        <ProjectModal
          project={editingProject}
          onClose={() => {
            setShowCreateModal(false)
            setEditingProject(null)
            // Clear URL params
            router.push('/manage-post')
          }}
          onSave={editingProject ?
            (updates) => handleUpdateProject(editingProject.id, updates) :
            handleCreateProject
          }
        />
      )}
    </div>
  )
  // return (
  //   <ProtectedRoute requiredRole="employer">
  //     <ManagePost />
  //   </ProtectedRoute>
  // );
}


// Project Modal Component
interface ProjectModalProps {
  project?: Project | null
  onClose: () => void
  onSave: (project: Partial<Project>) => void
}

const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: project?.title || '',
    description: project?.description || '',
    budget: project?.budget || 0,
    deadline: project?.deadline ? project.deadline.toISOString().split('T')[0] : '',
    skills: project?.skills.join(', ') || '',
    status: project?.status || 'open'
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      ...formData,
      deadline: new Date(formData.deadline),
      skills: formData.skills.split(',').map(s => s.trim()).filter(s => s)
    })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            {project ? 'Chỉnh sửa dự án' : 'Tạo dự án mới'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tiêu đề dự án *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mô tả chi tiết *
            </label>
            <textarea
              required
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ngân sách (VND) *
              </label>
              <input
                type="number"
                required
                value={formData.budget}
                onChange={(e) => setFormData(prev => ({ ...prev, budget: parseInt(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Deadline *
              </label>
              <input
                type="date"
                required
                value={formData.deadline}
                onChange={(e) => setFormData(prev => ({ ...prev, deadline: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Kỹ năng yêu cầu *
            </label>
            <input
              type="text"
              required
              placeholder="React, Node.js, MongoDB (phân cách bằng dấu phẩy)"
              value={formData.skills}
              onChange={(e) => setFormData(prev => ({ ...prev, skills: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {project && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Trạng thái
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as Project['status'] }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="open">Đang tuyển</option>
                <option value="in_progress">Đang thực hiện</option>
                <option value="completed">Hoàn thành</option>
                <option value="cancelled">Đã hủy</option>
              </select>
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              {project ? 'Cập nhật' : 'Tạo dự án'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
