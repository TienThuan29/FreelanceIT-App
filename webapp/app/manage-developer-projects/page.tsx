"use client";

// import React from "react";
// import ManageDeveloperProjects from '@/components/manage-developer-projects';
// import { ProtectedRoute } from '@/contexts/AuthContext';
import React, { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import type { Project } from '@/types'
import { useRouter } from 'next/navigation'
import { Role } from '@/types/user.type'

interface DeveloperProject extends Project {
  applicationStatus?: 'applied' | 'accepted' | 'in_progress' | 'completed' | 'rejected'
  applicationDate?: Date
  startDate?: Date
  completedDate?: Date
  earnings?: number
  rating?: number
  review?: string
  // Thêm client info
  clientName?: string
  clientLogo?: string
  clientIndustry?: string
  clientRating?: number
}

export default function ManageDeveloperProjectsPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [projects, setProjects] = useState<DeveloperProject[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'all' | 'applied' | 'in_progress' | 'completed' | 'rejected'>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<'date' | 'budget' | 'deadline'>('date')

  useEffect(() => {
    console.log('ManageDeveloperProjects - Component mounted')
    console.log('ManageDeveloperProjects - User:', user)
    console.log('ManageDeveloperProjects - User role:', user?.role)
    console.log('ManageDeveloperProjects - IsLoading:', isLoading)

    // Nếu đang loading thì chờ
    if (isLoading) {
      console.log('Auth is still loading, waiting...')
      return
    }

    // Nếu user không tồn tại (chưa login)
    if (!user) {
      console.log('No user found, redirecting to login')
      router.push('/login')
      return
    }

    // Nếu user có nhưng không phải developer thì redirect home
    if (user.role !== Role.DEVELOPER) {
      console.log('User role is not developer, redirecting to home. Current role:', user.role)
      router.push('/')
      return
    }

    console.log('User is valid developer, loading projects...')
    // Load projects liên quan đến developer này
    loadDeveloperProjects()
  }, [user, router, isLoading])

  const loadDeveloperProjects = () => {
    setTimeout(() => {
      // Mock data: tạo các dự án mà developer này đã apply/làm việc
      const developerProjects: DeveloperProject[] = [
        {
          ...mockProjects[0], // Website e-commerce
          applicationStatus: 'applied',
          applicationDate: new Date('2024-01-16'),
        },
        {
          ...mockProjects[1], // Mobile app Flutter
          applicationStatus: 'in_progress',
          applicationDate: new Date('2024-01-10'),
          startDate: new Date('2024-01-20'),
          earnings: 12500000,
        },
        {
          ...mockProjects[2], // AI chatbot
          applicationStatus: 'completed',
          applicationDate: new Date('2023-12-01'),
          startDate: new Date('2023-12-10'),
          completedDate: new Date('2024-01-05'),
          earnings: 8000000,
          rating: 4.9,
          review: 'Developer rất chuyên nghiệp, giao sản phẩm đúng hạn và chất lượng cao!'
        },
        {
          ...mockProjects[3], // WordPress website
          applicationStatus: 'accepted',
          applicationDate: new Date('2024-01-18'),
          startDate: new Date('2024-01-25'),
        },
        {
          ...mockProjects[4], // Data analysis
          applicationStatus: 'rejected',
          applicationDate: new Date('2024-01-12'),
        }
      ]

      setProjects(developerProjects)
      setLoading(false)
    }, 1000)
  }

  const getFilteredProjects = () => {
    let filtered = projects

    // Filter by tab
    if (activeTab !== 'all') {
      filtered = filtered.filter(project => project.applicationStatus === activeTab)
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(project =>
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (project.clientName && project.clientName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        project.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    // Sort projects
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'budget':
          return b.budget - a.budget
        case 'deadline':
          return new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
        case 'date':
        default:
          return new Date(b.applicationDate || b.createdAt).getTime() - new Date(a.applicationDate || a.createdAt).getTime()
      }
    })

    return filtered
  }

  const getStatusBadge = (status: string) => {
    const badges = {
      applied: 'bg-blue-100 text-blue-800',
      accepted: 'bg-green-100 text-green-800',
      in_progress: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-emerald-100 text-emerald-800',
      rejected: 'bg-red-100 text-red-800'
    }

    const labels = {
      applied: 'Đã ứng tuyển',
      accepted: 'Được chấp nhận',
      in_progress: 'Đang thực hiện',
      completed: 'Hoàn thành',
      rejected: 'Bị từ chối'
    }

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${badges[status as keyof typeof badges]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    )
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount)
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const getTabCount = (status: string) => {
    if (status === 'all') return projects.length
    return projects.filter(p => p.applicationStatus === status).length
  }

  const getTotalEarnings = () => {
    return projects
      .filter(p => p.applicationStatus === 'completed' && p.earnings)
      .reduce((total, p) => total + (p.earnings || 0), 0)
  }

  const getAverageRating = () => {
    const completedProjects = projects.filter(p => p.applicationStatus === 'completed' && p.rating)
    if (completedProjects.length === 0) return 0

    const totalRating = completedProjects.reduce((sum, p) => sum + (p.rating || 0), 0)
    return (totalRating / completedProjects.length).toFixed(1)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải dự án của bạn...</p>
          <p className="text-sm text-gray-500 mt-2">User: {user?.email || 'Not logged in'}</p>
          <p className="text-sm text-gray-500">Role: {user?.role || 'No role'}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Quản lý dự án</h1>
              <p className="text-gray-600 mt-1">Theo dõi và quản lý các dự án bạn đã ứng tuyển</p>
            </div>
            <button
              onClick={() => router.push('/post')}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Tìm dự án mới
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{projects.length}</p>
                <p className="text-gray-500 text-sm">Tổng dự án</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{getTabCount('completed')}</p>
                <p className="text-gray-500 text-sm">Hoàn thành</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(getTotalEarnings())}</p>
                <p className="text-gray-500 text-sm">Tổng thu nhập</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{getAverageRating()}</p>
                <p className="text-gray-500 text-sm">Đánh giá TB</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Search */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Tìm kiếm dự án..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Sort */}
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">Sắp xếp:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="date">Ngày ứng tuyển</option>
                <option value="budget">Ngân sách</option>
                <option value="deadline">Deadline</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { key: 'all', label: 'Tất cả' },
                { key: 'applied', label: 'Đã ứng tuyển' },
                { key: 'in_progress', label: 'Đang thực hiện' },
                { key: 'completed', label: 'Hoàn thành' },
                { key: 'rejected', label: 'Bị từ chối' }
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === tab.key
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                >
                  {tab.label} ({getTabCount(tab.key)})
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Projects List */}
        <div className="space-y-6">
          {getFilteredProjects().map(project => (
            <div key={project.id} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600 cursor-pointer">
                        {project.title}
                      </h3>
                      {getStatusBadge(project.applicationStatus!)}
                    </div>

                    <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-2m-14 0h2m-2 0h-2m3 0h7m-7 0v-9a2 2 0 012-2h2a2 2 0 012 2v9" />
                        </svg>
                        {project.clientName || 'Khách hàng'}
                      </span>
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                        </svg>
                        {formatCurrency(project.budget)}
                      </span>
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a4 4 0 118 0v4m-4 8l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        {formatDate(project.deadline)}
                      </span>
                    </div>

                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {project.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-3">
                      {project.skills.slice(0, 3).map(skill => (
                        <span key={skill} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                          {skill}
                        </span>
                      ))}
                      {project.skills.length > 3 && (
                        <span className="text-gray-500 text-xs">+{project.skills.length - 3} kỹ năng khác</span>
                      )}
                    </div>

                    {/* Project Timeline */}
                    {project.applicationDate && (
                      <div className="text-xs text-gray-500 space-y-1">
                        <div>Ứng tuyển: {formatDate(project.applicationDate)}</div>
                        {project.startDate && (
                          <div>Bắt đầu: {formatDate(project.startDate)}</div>
                        )}
                        {project.completedDate && (
                          <div>Hoàn thành: {formatDate(project.completedDate)}</div>
                        )}
                        {project.earnings && (
                          <div className="text-green-600 font-medium">
                            Thu nhập: {formatCurrency(project.earnings)}
                          </div>
                        )}
                        {project.rating && (
                          <div className="flex items-center">
                            <span>Đánh giá: </span>
                            <div className="flex items-center ml-1">
                              {[...Array(5)].map((_, i) => (
                                <svg
                                  key={i}
                                  className={`w-4 h-4 ${i < Math.floor(project.rating!) ? 'text-yellow-400' : 'text-gray-300'}`}
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                </svg>
                              ))}
                              <span className="ml-1 text-gray-600">({project.rating})</span>
                            </div>
                          </div>
                        )}
                        {project.review && (
                          <div className="italic text-gray-600 bg-gray-50 p-2 rounded text-sm mt-2">
                            "{project.review}"
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col space-y-2 ml-4">
                    <button
                      onClick={() => router.push(`/detail-post/${project.id}`)}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      Xem chi tiết
                    </button>

                    {project.applicationStatus === 'in_progress' && (
                      <button
                        onClick={() => router.push(`/chatbox?projectId=${project.id}`)}
                        className="text-green-600 hover:text-green-800 text-sm font-medium"
                      >
                        Nhắn tin
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {getFilteredProjects().length === 0 && (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có dự án nào</h3>
              <p className="text-gray-500 mb-4">
                {activeTab === 'all'
                  ? 'Bạn chưa ứng tuyển dự án nào. Hãy tìm kiếm và ứng tuyển các dự án phù hợp!'
                  : `Không có dự án nào ở trạng thái "${activeTab}"`
                }
              </p>
              <button
                onClick={() => router.push('/post')}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Tìm dự án mới
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
  // return (
  //   <ProtectedRoute requiredRole="developer">
  //     <ManageDeveloperProjects />
  //   </ProtectedRoute>
  // );
}
