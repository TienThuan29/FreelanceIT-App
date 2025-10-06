"use client";

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import type { Project } from '@/types'
import { mockProjects } from '@/data/mockProjects'
import { generateAvatar } from '@/utils/imageUtils'
import { useAuth } from '@/contexts/AuthContext';
import NavbarAuthenticated from '@/components/NavbarAuthenticated'
import Footer from '@/components/Footer'

interface Application {
  id: string
  freelancerId: string
  freelancerName: string
  freelancerAvatar: string
  coverLetter: string
  proposedBudget: number
  estimatedDuration: string
  status: 'pending' | 'accepted' | 'rejected'
  appliedAt: Date
  portfolio: string[]
  skills: string[]
}

interface DetailPostPageProps {
  params: {
    id: string;
  };
}

export default function DetailPostPage({ params }: DetailPostPageProps) {
  const { user } = useAuth()
  const router = useRouter()
  const { id } = useParams<{ id: string }>()
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [applications, setApplications] = useState<Application[]>([])
  const [activeTab, setActiveTab] = useState<'description' | 'applications'>('description')

  // Mock applications data
  const mockApplications: Application[] = [
    {
      id: 'app1',
      freelancerId: 'freelancer1',
      freelancerName: 'Nguyễn Văn A',
      freelancerAvatar: 'https://via.placeholder.com/50',
      coverLetter: 'Tôi có 3 năm kinh nghiệm phát triển React và Node.js. Tôi đã thực hiện nhiều dự án tương tự và cam kết hoàn thành đúng thời hạn.',
      proposedBudget: 18000000,
      estimatedDuration: '4 tuần',
      status: 'pending',
      appliedAt: new Date('2024-01-15'),
      portfolio: ['https://example.com/project1', 'https://example.com/project2'],
      skills: ['React', 'Node.js', 'MongoDB', 'TypeScript']
    },
    {
      id: 'app2',
      freelancerId: 'freelancer2',
      freelancerName: 'Trần Thị B',
      freelancerAvatar: 'https://via.placeholder.com/50',
      coverLetter: 'Tôi có kinh nghiệm 5 năm trong lĩnh vực frontend development. Tôi thành thạo React, Vue.js và có khả năng làm việc độc lập.',
      proposedBudget: 22000000,
      estimatedDuration: '3 tuần',
      status: 'accepted',
      appliedAt: new Date('2024-01-10'),
      portfolio: ['https://example.com/project3', 'https://example.com/project4'],
      skills: ['React', 'Vue.js', 'Tailwind CSS', 'JavaScript']
    }
  ]

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const foundProject = mockProjects.find(p => p.id === id)
      if (foundProject) {
        setProject(foundProject)
        setApplications(mockApplications)
      }
      setLoading(false)
    }, 1000)
  }, [id])

  const handleApply = (applicationData: any) => {
    // Simulate API call
    const newApplication: Application = {
      id: `app${Date.now()}`,
      freelancerId: user?.id || 'current_user',
      freelancerName: user?.fullname || 'Current User',
      freelancerAvatar: user?.avatarUrl || generateAvatar(user?.fullname || 'Anonymous', '3B82F6'),
      ...applicationData,
      status: 'pending',
      appliedAt: new Date()
    }

    setApplications(prev => [...prev, newApplication])
    alert('Apply thành công! Nhà tuyển dụng sẽ xem xét và phản hồi sớm.')
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

  const getApplicationStatusColor = (status: Application['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'accepted': return 'bg-green-100 text-green-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getApplicationStatusText = (status: Application['status']) => {
    switch (status) {
      case 'pending': return 'Chờ xử lý'
      case 'accepted': return 'Đã chấp nhận'
      case 'rejected': return 'Đã từ chối'
      default: return 'Không xác định'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải chi tiết dự án...</p>
        </div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-400 text-6xl mb-4">📋</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Không tìm thấy dự án
          </h3>
          <p className="text-gray-500 mb-4">
            Dự án này có thể đã bị xóa hoặc không tồn tại
          </p>
          <button
            onClick={() => router.push('/post')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Quay lại danh sách
          </button>
        </div>
      </div>
    )
  }

  const isProjectOwner = user?.id === project.clientId
  const hasApplied = applications.some(app => app.freelancerId === user?.id)
  const userApplication = applications.find(app => app.freelancerId === user?.id)

  return (
    <>
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Replace custom header with NavbarAuthenticated component */}
      <NavbarAuthenticated />

      <div className="flex-grow">
        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Back Button */}
          <div className="mb-6">
            <button
              onClick={() => router.push('/post')}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>Quay lại danh sách dự án</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Project Header */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h1 className="text-2xl font-bold text-gray-900 mb-3">
                      {project.title}
                    </h1>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4h.586A2 2 0 0118 9v8a2 2 0 01-2 2h-8a2 2 0 01-2-2V9a2 2 0 012-2H8z" />
                        </svg>
                        Đăng: {formatDate(project.createdAt)}
                      </span>
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Deadline: {formatDate(project.deadline)}
                      </span>
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        {applications.length} ứng viên
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(project.status)}`}>
                      {getStatusText(project.status)}
                    </span>
                    <div className="text-2xl font-bold text-blue-600">
                      {formatCurrency(project.budget)}
                    </div>
                  </div>
                </div>

                {/* Skills */}
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Kỹ năng yêu cầu:</h3>
                  <div className="flex flex-wrap gap-2">
                    {project.skills.map(skill => (
                      <span key={skill} className="px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* User Status */}
                {hasApplied && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2">
                      <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div>
                        <p className="font-medium text-yellow-800">
                          Bạn đã apply vào dự án này
                        </p>
                        <p className="text-sm text-yellow-600">
                          Trạng thái: {getApplicationStatusText(userApplication?.status || 'pending')}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Navigation Tabs */}
              <div className="bg-white rounded-lg shadow-sm">
                <div className="border-b border-gray-200">
                  <nav className="flex space-x-8 px-6">
                    <button
                      onClick={() => setActiveTab('description')}
                      className={`py-4 text-sm font-medium border-b-2 ${activeTab === 'description'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                    >
                      Mô tả dự án
                    </button>
                    <button
                      onClick={() => setActiveTab('applications')}
                      className={`py-4 text-sm font-medium border-b-2 ${activeTab === 'applications'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                    >
                      Ứng viên ({applications.length})
                    </button>
                  </nav>
                </div>

                <div className="p-6">
                  {activeTab === 'description' && (
                    <div className="prose max-w-none">
                      <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                        {project.description}
                      </div>

                      <div className="mt-8 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-medium text-gray-900 mb-2">Thông tin dự án</h4>
                            <ul className="space-y-1 text-sm text-gray-600">
                              <li>• Loại dự án: {project.type || 'Freelance'}</li>
                              <li>• Thời gian: {project.duration || 'Linh hoạt'}</li>
                              <li>• Địa điểm: {project.location || 'Remote'}</li>
                              <li>• Mức độ: {project.level || 'Intermediate'}</li>
                            </ul>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900 mb-2">Yêu cầu</h4>
                            <ul className="space-y-1 text-sm text-gray-600">
                              <li>• Kinh nghiệm: {project.experience || '2+ năm'}</li>
                              <li>• Ngôn ngữ: {project.language || 'Tiếng Việt'}</li>
                              <li>• Làm việc: {project.workType || 'Remote'}</li>
                              <li>• Cam kết: {project.commitment || 'Part-time'}</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'applications' && (
                    <div className="space-y-4">
                      {applications.length === 0 ? (
                        <div className="text-center py-12">
                          <div className="text-gray-400 text-6xl mb-4">👥</div>
                          <h3 className="text-lg font-medium text-gray-900 mb-2">
                            Chưa có ứng viên nào
                          </h3>
                          <p className="text-gray-500">
                            Hãy là người đầu tiên apply vào dự án này
                          </p>
                        </div>
                      ) : (
                        applications.map(application => (
                          <div key={application.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                            <div className="flex items-start space-x-4">
                              <img
                                src={application.freelancerAvatar}
                                alt={application.freelancerName}
                                className="w-12 h-12 rounded-full object-cover"
                              />
                              <div className="flex-1">
                                <div className="flex items-center justify-between mb-2">
                                  <h4 className="font-medium text-gray-900">
                                    {application.freelancerName}
                                  </h4>
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getApplicationStatusColor(application.status)}`}>
                                    {getApplicationStatusText(application.status)}
                                  </span>
                                </div>
                                <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                                  <span>💰 {formatCurrency(application.proposedBudget)}</span>
                                  <span>⏱️ {application.estimatedDuration}</span>
                                  <span>📅 {formatDate(application.appliedAt)}</span>
                                </div>
                                <p className="text-sm text-gray-700 mb-3">
                                  {application.coverLetter}
                                </p>
                                <div className="flex flex-wrap gap-2 mb-3">
                                  {application.skills.map(skill => (
                                    <span key={skill} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                                      {skill}
                                    </span>
                                  ))}
                                </div>
                                {application.portfolio.length > 0 && (
                                  <div className="text-sm">
                                    <span className="font-medium text-gray-700">Portfolio: </span>
                                    {application.portfolio.map((link, index) => (
                                      <a
                                        key={index}
                                        href={link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:underline mr-2"
                                      >
                                        Link {index + 1}
                                      </a>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Apply Card */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="text-center mb-4">
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    {formatCurrency(project.budget)}
                  </div>
                  <p className="text-sm text-gray-600">Ngân sách dự án</p>
                </div>

                {project.status === 'open' && !hasApplied && !isProjectOwner && (
                  <button
                    onClick={() => router.push(`/apply/${id}`)}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium mb-4"
                  >
                    Apply ngay
                  </button>
                )}

                {hasApplied && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                    <div className="flex items-center space-x-2 mb-3">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-green-800 font-medium">Đã apply</span>
                    </div>
                    <button
                      onClick={() => router.push(`/chatbox?projectId=${id}&clientId=${project.clientId}`)}
                      className="w-full bg-white text-green-700 py-2 px-4 rounded-lg hover:bg-green-50 transition-colors text-sm font-medium border border-green-200 mb-2"
                    >
                      💬 Chat với nhà tuyển dụng
                    </button>
                    <button
                      onClick={() => router.push(`/nda-contracts?projectId=${id}&type=project&partnerId=${project.clientId}`)}
                      className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                    >
                      📋 Tạo hợp đồng NDA
                    </button>
                  </div>
                )}

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Trạng thái:</span>
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(project.status)}`}>
                      {getStatusText(project.status)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Số ứng viên:</span>
                    <span className="font-medium">{applications.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Deadline:</span>
                    <span className="font-medium">{formatDate(project.deadline)}</span>
                  </div>
                </div>
              </div>

              {/* Client Info */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Về nhà tuyển dụng
                </h3>

                <div className="flex items-center space-x-3 mb-4">
                  <img
                    src={(project as any).clientLogo || 'https://via.placeholder.com/50'}
                    alt={`Logo ${(project as any).clientName || 'Client'}`}
                    className="w-12 h-12 rounded-lg object-cover border border-gray-200"
                  />
                  <div>
                    <div className="flex items-center space-x-2">
                      <p className="font-medium text-gray-900">{(project as any).clientName || 'Client Name'}</p>
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                        ✓ Đã xác minh
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{(project as any).clientIndustry || 'Technology'}</p>
                  </div>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      Đánh giá:
                    </span>
                    <span className="font-medium">4.8/5 ⭐</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                      Dự án đã đăng:
                    </span>
                    <span className="font-medium">24</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Dự án hoàn thành:
                    </span>
                    <span className="font-medium">22</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                      Tỷ lệ hoàn thành:
                    </span>
                    <span className="font-medium text-green-600">92%</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Địa điểm:
                    </span>
                    <span className="font-medium">Hồ Chí Minh</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-2m-2 0H7m10 0v-2a2 2 0 00-2-2h-2a2 2 0 00-2 2v2m2-6V9a2 2 0 012-2h2a2 2 0 012 2v2M9 7h6m-6 4h6m-6 4h6" />
                      </svg>
                      Quy mô:
                    </span>
                    <span className="font-medium">50-100 nhân viên</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Thành viên từ:
                    </span>
                    <span className="font-medium">2020</span>
                  </div>
                </div>


                {/* Action Buttons */}
                <div className="mt-6 space-y-2">
                  <button
                    onClick={() => router.push(`/chatbox`)}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center justify-center space-x-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <span>💬 Chat với nhà tuyển dụng</span>
                  </button>

                  <button
                    onClick={() => router.push(`/profile-employer`)}
                    className="w-full px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors text-sm font-medium"
                  >
                    Xem profile nhà tuyển dụng
                  </button>

                  {(project as any).clientWebsite && (
                    <a
                      href={(project as any).clientWebsite}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium text-center block"
                    >
                      🌐 Trang web công ty
                    </a>
                  )}
                </div>

                {/* Social Links */}
                {((project as any).clientSocialLinks?.linkedin || (project as any).clientSocialLinks?.facebook) && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Liên kết</h4>
                    <div className="flex space-x-3">
                      {(project as any).clientSocialLinks?.linkedin && (
                        <a
                          href={(project as any).clientSocialLinks.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                          </svg>
                        </a>
                      )}

                      {(project as any).clientSocialLinks?.facebook && (
                        <a
                          href={(project as any).clientSocialLinks.facebook}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                          </svg>
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Similar Projects */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Dự án tương tự
                </h3>
                <div className="space-y-3">
                  {mockProjects.slice(0, 3).map(similarProject => (
                    <div
                      key={similarProject.id}
                      className="border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => router.push(`/detail-post/${similarProject.id}`)}
                    >
                      <h4 className="font-medium text-gray-900 text-sm mb-1 line-clamp-2">
                        {similarProject.title}
                      </h4>
                      <p className="text-xs text-gray-600 mb-2">
                        {formatCurrency(similarProject.budget)}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {similarProject.skills.slice(0, 2).map(skill => (
                          <span key={skill} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
     <Footer />
     </>
  )
}
