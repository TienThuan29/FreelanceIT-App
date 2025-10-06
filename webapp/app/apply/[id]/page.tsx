"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
// import Apply from '@/components/apply';
import { ProtectedRoute, useAuth } from '@/contexts/AuthContext';
import { Role } from "@/types/user.type";
import type { Project } from '@/types'

interface ApplicationData {
  coverLetter: string
  proposedBudget: number
  proposedDuration: string
  availableStartDate: string
  workingHours: string
  experience: string
  portfolio: string[]
  whyChooseMe: string
  questions: string
}

interface ApplyPageProps {
  params: {
    id: string;
  };
}

export default function ApplyPage({ params }: ApplyPageProps) {
  const { user } = useAuth()
  const router = useRouter()
  const { id } = useParams<{ id: string }>()

  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)

  const [formData, setFormData] = useState<ApplicationData>({
    coverLetter: '',
    proposedBudget: 0,
    proposedDuration: '',
    availableStartDate: '',
    workingHours: '',
    experience: '',
    portfolio: [''],
    whyChooseMe: '',
    questions: ''
  })

  useEffect(() => {
    // Simulate API call to get project details
    setTimeout(() => {
      const foundProject = mockProjects.find(p => p.id === id)
      if (foundProject) {
        setProject(foundProject)
        setFormData(prev => ({
          ...prev,
          proposedBudget: foundProject.budget
        }))
      }
      setLoading(false)
    }, 1000)
  }, [id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Save application data (would be API call in real app)
      const applicationData = {
        ...formData,
        portfolio: formData.portfolio.filter(link => link.trim() !== ''),
        projectId: id,
        freelancerId: user?.id,
        appliedAt: new Date()
      }

      console.log('Application submitted:', applicationData)
      setShowSuccessModal(true)

    } catch (error) {
      console.error('Error submitting application:', error)
      alert('Có lỗi xảy ra khi gửi đơn ứng tuyển. Vui lòng thử lại.')
    } finally {
      setSubmitting(false)
    }
  }

  const addPortfolioLink = () => {
    setFormData(prev => ({ ...prev, portfolio: [...prev.portfolio, ''] }))
  }

  const removePortfolioLink = (index: number) => {
    setFormData(prev => ({
      ...prev,
      portfolio: prev.portfolio.filter((_, i) => i !== index)
    }))
  }

  const updatePortfolioLink = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      portfolio: prev.portfolio.map((link, i) => i === index ? value : link)
    }))
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải thông tin dự án...</p>
        </div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-400 text-6xl mb-4">❌</div>
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
            Quay lại danh sách dự án
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <button
              onClick={() => router.back()}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>Quay lại trang trước</span>
            </button>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Apply vào dự án
          </h1>
          <p className="text-gray-600">
            Điền thông tin để ứng tuyển vào dự án "{project.title}"
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Cover Letter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Thư xin việc *
                  </label>
                  <textarea
                    rows={5}
                    value={formData.coverLetter}
                    onChange={(e) => setFormData(prev => ({ ...prev, coverLetter: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Giới thiệu ngắn gọn về bản thân và lý do bạn quan tâm đến dự án này..."
                    required
                  />
                </div>

                {/* Budget and Duration */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ngân sách đề xuất *
                    </label>
                    <input
                      type="number"
                      value={formData.proposedBudget}
                      onChange={(e) => setFormData(prev => ({ ...prev, proposedBudget: Number(e.target.value) }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min="0"
                      required
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Ngân sách gốc: {formatCurrency(project.budget)}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Thời gian hoàn thành *
                    </label>
                    <select
                      value={formData.proposedDuration}
                      onChange={(e) => setFormData(prev => ({ ...prev, proposedDuration: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Chọn thời gian</option>
                      <option value="1-2 tuần">1-2 tuần</option>
                      <option value="3-4 tuần">3-4 tuần</option>
                      <option value="1-2 tháng">1-2 tháng</option>
                      <option value="2-3 tháng">2-3 tháng</option>
                      <option value="3-6 tháng">3-6 tháng</option>
                      <option value="6+ tháng">6+ tháng</option>
                    </select>
                  </div>
                </div>

                {/* Start Date and Working Hours */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Có thể bắt đầu từ *
                    </label>
                    <input
                      type="date"
                      value={formData.availableStartDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, availableStartDate: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Thời gian làm việc *
                    </label>
                    <select
                      value={formData.workingHours}
                      onChange={(e) => setFormData(prev => ({ ...prev, workingHours: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Chọn thời gian</option>
                      <option value="Part-time (20-30h/tuần)">Part-time (20-30h/tuần)</option>
                      <option value="Full-time (40h/tuần)">Full-time (40h/tuần)</option>
                      <option value="Flexible">Linh hoạt</option>
                    </select>
                  </div>
                </div>

                {/* Experience */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kinh nghiệm liên quan *
                  </label>
                  <textarea
                    rows={4}
                    value={formData.experience}
                    onChange={(e) => setFormData(prev => ({ ...prev, experience: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Mô tả kinh nghiệm của bạn với các công nghệ/kỹ năng yêu cầu trong dự án này..."
                    required
                  />
                </div>

                {/* Portfolio */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Link portfolio/demo
                  </label>
                  {formData.portfolio.map((link, index) => (
                    <div key={index} className="flex items-center space-x-2 mb-2">
                      <input
                        type="url"
                        value={link}
                        onChange={(e) => updatePortfolioLink(index, e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="https://github.com/username/project"
                      />
                      <button
                        type="button"
                        onClick={() => removePortfolioLink(index)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        disabled={formData.portfolio.length === 1}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addPortfolioLink}
                    className="text-blue-600 hover:text-blue-800 text-sm flex items-center space-x-1"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span>Thêm link</span>
                  </button>
                </div>

                {/* Why Choose Me */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tại sao nên chọn tôi? *
                  </label>
                  <textarea
                    rows={3}
                    value={formData.whyChooseMe}
                    onChange={(e) => setFormData(prev => ({ ...prev, whyChooseMe: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Những điểm mạnh, lợi thế của bạn so với các ứng viên khác..."
                    required
                  />
                </div>

                {/* Questions */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Câu hỏi về dự án (tùy chọn)
                  </label>
                  <textarea
                    rows={3}
                    value={formData.questions}
                    onChange={(e) => setFormData(prev => ({ ...prev, questions: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Những câu hỏi bạn muốn tìm hiểu thêm về dự án..."
                  />
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => router.back()}
                    className="px-6 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? (
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Đang gửi...</span>
                      </div>
                    ) : (
                      'Gửi đơn ứng tuyển'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Thông tin dự án
              </h3>

              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">{project.title}</h4>
                  <p className="text-sm text-gray-600 line-clamp-3">{project.description}</p>
                </div>

                <div className="text-center py-4 border-t border-gray-200">
                  <div className="text-2xl font-bold text-blue-600 mb-1">
                    {formatCurrency(project.budget)}
                  </div>
                  <p className="text-sm text-gray-600">Ngân sách</p>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Thời gian:</span>
                    <span className="font-medium">{project.duration}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Địa điểm:</span>
                    <span className="font-medium">{project.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Mức độ:</span>
                    <span className="font-medium">{project.level}</span>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <h4 className="font-medium text-gray-900 mb-2">Kỹ năng yêu cầu</h4>
                  <div className="flex flex-wrap gap-2">
                    {project.skills.map(skill => (
                      <span key={skill} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>

              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Apply thành công!
              </h3>

              <p className="text-sm text-gray-600 mb-6">
                Đơn ứng tuyển của bạn đã được gửi đến nhà tuyển dụng.
                Bạn sẽ nhận được thông báo khi có phản hồi.
              </p>

              <div className="flex flex-col space-y-3">
                <button
                  onClick={() => router.push(`/chatbox?projectId=${id}&clientId=${project?.clientId}`)}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <span>💬 Chat với nhà tuyển dụng</span>
                </button>

                <button
                  onClick={() => router.push('/post')}
                  className="w-full text-blue-600 border border-blue-600 py-2 px-4 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  Tìm dự án khác
                </button>

                <button
                  onClick={() => router.back()}
                  className="w-full text-gray-600 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Quay lại trang trước
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
  // return (
  //   <ProtectedRoute requiredRole={Role.DEVELOPER}>
  //     <Apply id={params.id} />
  //   </ProtectedRoute>
  // );
}
