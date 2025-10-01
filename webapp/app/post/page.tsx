"use client";

// import Post from '@/components/post';
// import { ProtectedRoute } from '@/contexts/AuthContext';
import React, { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import type { Project } from '@/types'
import { mockProjects } from '@/data/mockProjects'
import { useRouter } from 'next/navigation'

export default function PostPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState({
    search: '',
    skills: '',
    budget: '',
    status: 'open'
  })

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setProjects(mockProjects)
      setLoading(false)
    }, 1000)
  }, [])

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(filter.search.toLowerCase()) ||
      project.description.toLowerCase().includes(filter.search.toLowerCase())
    const matchesSkills = filter.skills === '' ||
      project.skills.some(skill => skill.toLowerCase().includes(filter.skills.toLowerCase()))
    const matchesStatus = filter.status === 'all' || project.status === filter.status

    return matchesSearch && matchesSkills && matchesStatus
  })

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
      month: 'long',
      day: 'numeric'
    }).format(date)
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
        {/* Sidebar Filter */}
        <div className="w-72 bg-white shadow-sm border-r border-gray-200 h-screen sticky top-0">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Bộ lọc dự án</h2>

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
              </select>
            </div>

            {/* Clear Filters */}
            <button
              onClick={() => setFilter({ search: '', skills: '', budget: '', status: 'open' })}
              className="w-full px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Xóa bộ lọc
            </button>

            {/* Quick Stats */}
            <div className="mt-8 bg-gray-50 rounded-lg p-4">
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
                  <span className="text-gray-600">Có thể apply:</span>
                  <span className="font-medium text-blue-600">{filteredProjects.filter(p => p.status === 'open').length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Dự án Freelance IT
            </h1>
            <p className="text-gray-600">
              Tìm kiếm và apply vào {filteredProjects.length} dự án phù hợp với kỹ năng của bạn
            </p>
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {filteredProjects.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">🔍</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Không tìm thấy dự án nào
                </h3>
                <p className="text-gray-500">
                  Thử thay đổi bộ lọc hoặc tìm kiếm với từ khóa khác
                </p>
              </div>
            ) : (
              filteredProjects.map(project => (
                <div key={project.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                          {project.title}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                          <span>📅 {formatDate(project.deadline)}</span>
                          <span>🕒 {formatDate(project.createdAt)}</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end space-y-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                          {getStatusText(project.status)}
                        </span>
                        <div className="text-right">
                          <div className="text-xl font-bold text-blue-600">
                            {formatCurrency(project.budget)}
                          </div>
                        </div>
                      </div>
                    </div>

                    <p className="text-gray-700 mb-4 line-clamp-3 text-sm">
                      {project.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.skills.map(skill => (
                        <span key={skill} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-md">
                          {skill}
                        </span>
                      ))}
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="text-sm text-gray-500">
                        {project.freelancerId ?
                          `🧑‍💻 ${project.freelancerId}` :
                          '🔍 Chưa có freelancer'
                        }
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => router.push(`/detail-post/${project.id}`)}
                          className="px-3 py-1 text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 transition-colors text-sm"
                        >
                          Xem chi tiết
                        </button>
                        {project.status === 'open' && (
                          <button
                            onClick={() => router.push(`/detail-post/${project.id}`)}
                            className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
                          >
                            Apply ngay
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
  // return (
  //   <ProtectedRoute requiredRole="employer">
  //     <Post />
  //   </ProtectedRoute>
  // );
}
