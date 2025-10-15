'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import type { Project, ProjectTeam } from '@/types/project.type'
import { ProjectStatus } from '@/types/shared.type'
import { formatCurrency } from '@/lib/curency'
import { formatDate } from '@/lib/date'
import { useProjectManagement } from '@/hooks/useProjectManagement'
import useApplicationManagement, { ProjectApplication } from '@/hooks/useApplicationManagement'
import { ProjectTeamMember } from '@/hooks/useProjectManagement'
import { toast } from 'sonner'
import { ApplicationStatus } from '@/types/shared.type'
import { useAuth } from '@/contexts/AuthContext'
// import NavbarAuthenticated from '@/components/NavbarAuthenticated'


export default function ProjectDetailPage() {
    const params = useParams()
    const router = useRouter()
    const { user, isLoading: authLoading } = useAuth()
    const { 
        getProjectById, 
        addUserToProject, 
        removeUserFromProject,
        getProjectTeamMembers,
        addProjectTeamMember,
        removeProjectTeamMember,
        teamMembers,
        isLoading: isLoadingTeamMembers
    } = useProjectManagement()
    const { 
        applications, 
        isLoading: isLoadingApplications, 
        isUpdating, 
        getApplicationsByProject, 
        updateApplicationStatus, 
        deleteApplication 
    } = useApplicationManagement()
    
    const [project, setProject] = useState<Project | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isAddingMember, setIsAddingMember] = useState(false)
    const [showAddMemberModal, setShowAddMemberModal] = useState(false)
    const [showApplicationsModal, setShowApplicationsModal] = useState(false)
    const [newMemberData, setNewMemberData] = useState({
        userId: '',
        agreedRate: 0,
        contractUrl: ''
    })
    const [selectedApplication, setSelectedApplication] = useState<ProjectApplication | null>(null)
    const [showStatusModal, setShowStatusModal] = useState(false)
    const [statusUpdateData, setStatusUpdateData] = useState({
        status: ApplicationStatus.PENDING,
        notes: ''
    })
    const [isLoadingApplicationsButton, setIsLoadingApplicationsButton] = useState(false)

    const projectId = params.id as string

    useEffect(() => {
        if (!authLoading && user) {
            fetchProjectDetails()
        }
    }, [projectId, authLoading, user])

    const fetchProjectDetails = async () => {
        try {
            setIsLoading(true)
            const projectData = await getProjectById(projectId)
            setProject(projectData)
            
            // Fetch real team members data
            await getProjectTeamMembers(projectId)
        } catch (error) {
            toast.error('Không thể tải thông tin dự án')
            console.error('Error fetching project:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleAddMember = async () => {
        if (!newMemberData.userId) {
            toast.error('Vui lòng chọn thành viên')
            return
        }

        try {
            setIsAddingMember(true)
            await addProjectTeamMember({
                projectId,
                userId: newMemberData.userId,
                agreedRate: newMemberData.agreedRate,
                contractUrl: newMemberData.contractUrl
            })
            setShowAddMemberModal(false)
            setNewMemberData({ userId: '', agreedRate: 0, contractUrl: '' })
            fetchProjectDetails()
        } catch (error) {
            toast.error('Không thể thêm thành viên')
        } finally {
            setIsAddingMember(false)
        }
    }

    const handleRemoveMember = async (userId: string) => {
        if (!window.confirm('Bạn có chắc chắn muốn xóa thành viên này khỏi dự án?')) {
            return
        }

        try {
            await removeProjectTeamMember(projectId, userId)
            fetchProjectDetails()
        } catch (error) {
            toast.error('Không thể xóa thành viên')
        }
    }

    const handleViewApplications = async () => {
        try {
            setIsLoadingApplicationsButton(true)
            await getApplicationsByProject(projectId)
            setShowApplicationsModal(true)
        } catch (error) {
            toast.error('Không thể tải danh sách ứng tuyển')
        } finally {
            setIsLoadingApplicationsButton(false)
        }
    }

    const handleUpdateApplicationStatus = async () => {
        if (!selectedApplication) return

        try {
            await updateApplicationStatus(
                selectedApplication.id, 
                statusUpdateData.status, 
                statusUpdateData.notes,
                projectId,
                selectedApplication.developerId,
                selectedApplication.expectedRate
            )
            setShowStatusModal(false)
            setSelectedApplication(null)
            setStatusUpdateData({ status: ApplicationStatus.PENDING, notes: '' })
            
            // Refresh team members if application was accepted
            if (statusUpdateData.status === ApplicationStatus.ACCEPTED) {
                await getProjectTeamMembers(projectId)
            }
        } catch (error) {
            toast.error('Không thể cập nhật trạng thái')
        }
    }

    const handleDeleteApplication = async (applicationId: string) => {
        if (!window.confirm('Bạn có chắc chắn muốn xóa đơn ứng tuyển này?')) {
            return
        }

        try {
            await deleteApplication(applicationId)
        } catch (error) {
            toast.error('Không thể xóa đơn ứng tuyển')
        }
    }

    const openStatusModal = (application: ProjectApplication) => {
        setSelectedApplication(application)
        setStatusUpdateData({
            status: application.status,
            notes: application.notes || ''
        })
        setShowStatusModal(true)
    }

    const getStatusColor = (status: Project['status']) => {
        switch (status) {
            case ProjectStatus.OPEN_APPLYING: return 'bg-green-100 text-green-800'
            case ProjectStatus.IN_PROGRESS: return 'bg-blue-100 text-blue-800'
            case ProjectStatus.COMPLETED: return 'bg-gray-100 text-gray-800'
            case ProjectStatus.CANCELLED: return 'bg-red-100 text-red-800'
            case ProjectStatus.DRAFT: return 'bg-yellow-100 text-yellow-800'
            case ProjectStatus.CLOSED_APPLYING: return 'bg-orange-100 text-orange-800'
            default: return 'bg-gray-100 text-gray-800'
        }
    }

    const getStatusText = (status: Project['status']) => {
        switch (status) {
            case ProjectStatus.OPEN_APPLYING: return 'Đang tuyển'
            case ProjectStatus.IN_PROGRESS: return 'Đang thực hiện'
            case ProjectStatus.COMPLETED: return 'Hoàn thành'
            case ProjectStatus.CANCELLED: return 'Đã hủy'
            case ProjectStatus.DRAFT: return 'Bản nháp'
            case ProjectStatus.CLOSED_APPLYING: return 'Đã đóng đơn'
            default: return 'Không xác định'
        }
    }

    const getApplicationStatusColor = (status: ApplicationStatus) => {
        switch (status) {
            case ApplicationStatus.PENDING: return 'bg-yellow-100 text-yellow-800'
            case ApplicationStatus.ACCEPTED: return 'bg-green-100 text-green-800'
            case ApplicationStatus.REJECTED: return 'bg-red-100 text-red-800'
            default: return 'bg-gray-100 text-gray-800'
        }
    }

    const getApplicationStatusText = (status: ApplicationStatus) => {
        switch (status) {
            case ApplicationStatus.PENDING: return 'Chờ xét duyệt'
            case ApplicationStatus.ACCEPTED: return 'Đã chấp nhận'
            case ApplicationStatus.REJECTED: return 'Đã từ chối'
            default: return 'Không xác định'
        }
    }

    const formatDate = (date: Date | string | undefined) => {
        if (!date) return 'Chưa xác định'
        const dateObj = typeof date === 'string' ? new Date(date) : date
        return new Intl.DateTimeFormat('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(dateObj)
    }

    // Show loading while authentication is being checked
    if (authLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
            </div>
        )
    }

    // Redirect to login if not authenticated
    if (!user) {
        router.push('/login')
        return null
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
            </div>
        )
    }

    if (!project) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Không tìm thấy dự án</h2>
                    <button
                        onClick={() => router.back()}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Quay lại
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Quay lại
                    </button>
                    
                    <div className="flex items-center justify-between">
                        <h1 className="text-3xl font-bold text-gray-900">{project.title}</h1>
                        <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(project.status)}`}>
                            {getStatusText(project.status)}
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Project Image */}
                        {project.imageUrl && (
                            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                                <img
                                    src={project.imageUrl}
                                    alt={project.title}
                                    className="w-full h-64 object-cover"
                                />
                            </div>
                        )}

                        {/* Project Details */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Thông tin dự án</h2>
                            
                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500 mb-2">Mô tả</h3>
                                    <p className="text-gray-900 whitespace-pre-line">{project.description}</p>
                                </div>

                                <div>
                                    <h3 className="text-sm font-medium text-gray-500 mb-2">Kỹ năng yêu cầu</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {project.requiredSkills?.map((skill, index) => (
                                            <span key={index} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500 mb-2">Danh mục</h3>
                                        <p className="text-gray-900">{project.category || 'Chưa phân loại'}</p>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500 mb-2">Loại dự án</h3>
                                        <p className="text-gray-900">{project.projectType?.name || 'Chưa phân loại'}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500 mb-2">Ngày bắt đầu</h3>
                                        <p className="text-gray-900">{formatDate(project.startDate || new Date())}</p>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500 mb-2">Ngày kết thúc</h3>
                                        <p className="text-gray-900">{formatDate(project.endDate || new Date())}</p>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-sm font-medium text-gray-500 mb-2">Vị trí</h3>
                                    <div className="flex items-center">
                                        <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        <span className="text-gray-900">{project.location || 'Chưa xác định'}</span>
                                        {project.isRemote && (
                                            <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                                                Làm việc từ xa
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Team Management */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-semibold text-gray-900">Đội ngũ dự án</h2>
                                <button
                                    onClick={() => setShowAddMemberModal(true)}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
                                >
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                    Thêm thành viên
                                </button>
                            </div>

                            {teamMembers.length === 0 ? (
                                <div className="text-center py-8">
                                    <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                    <p className="text-gray-500">Chưa có thành viên nào trong dự án</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {teamMembers.map((member) => (
                                        <div key={member.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                                            <div className="flex items-center">
                                                <img
                                                    src={member.developerAvatar || 'https://via.placeholder.com/40'}
                                                    alt={member.developerName}
                                                    className="w-10 h-10 rounded-full mr-3"
                                                />
                                                <div>
                                                    <h3 className="font-medium text-gray-900">{member.developerName}</h3>
                                                    <p className="text-sm text-gray-500">{member.developerEmail}</p>
                                                    <div className="flex items-center mt-1">
                                                        <span className="text-sm text-gray-600">
                                                            {formatCurrency(member.agreedRate || 0)}/tháng
                                                        </span>
                                                        {member.contractUrl && (
                                                            <a
                                                                href={member.contractUrl}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="ml-3 text-sm text-blue-600 hover:text-blue-800"
                                                            >
                                                                Xem hợp đồng
                                                            </a>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <span className={`px-2 py-1 text-xs rounded-full ${
                                                    member.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                                }`}>
                                                    {member.isActive ? 'Hoạt động' : 'Không hoạt động'}
                                                </span>
                                                <button
                                                    onClick={() => handleRemoveMember(member.developerId)}
                                                    className="text-red-600 hover:text-red-800 p-1"
                                                    title="Xóa thành viên"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Budget Information */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Thông tin ngân sách</h2>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Ngân sách chính:</span>
                                    <span className="font-medium">{formatCurrency(project.budget || 0)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Ngân sách tối thiểu:</span>
                                    <span className="font-medium">{formatCurrency(project.minBudget || 0)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Ngân sách tối đa:</span>
                                    <span className="font-medium">{formatCurrency(project.maxBudget || 0)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Thời gian ước tính:</span>
                                    <span className="font-medium">{project.estimateDuration || 0} ngày</span>
                                </div>
                            </div>
                        </div>

                        {/* Project Stats */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Thống kê</h2>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Số thành viên:</span>
                                    <span className="font-medium">{teamMembers.length}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Ngày tạo:</span>
                                    <span className="font-medium">{formatDate(project.createdDate || new Date())}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Cập nhật cuối:</span>
                                    <span className="font-medium">{formatDate(project.updatedDate || new Date())}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Lượt xem:</span>
                                    <span className="font-medium">{project.views || 0}</span>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Thao tác</h2>
                            <div className="space-y-3">
                                {/* <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                                    Chỉnh sửa dự án
                                </button> */}
                                <button 
                                    onClick={handleViewApplications}
                                    disabled={isLoadingApplicationsButton}
                                    className="cursor-pointer w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    {isLoadingApplicationsButton ? (
                                        <div className="flex items-center justify-center">
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Đang tải...
                                        </div>
                                    ) : (
                                        `Đơn ứng tuyển`
                                    )}
                                </button>
                                <button 
                                    onClick={() => router.push(`/projects/room/${projectId}`)}
                                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                    Project Room
                                </button>
                                {/* <button className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700">
                                    Sao chép dự án
                                </button> */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Add Member Modal */}
            {showAddMemberModal && (
                <div className="fixed inset-0  bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg border border-gray-200 shadow-xl p-6 w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4">Thêm thành viên mới</h2>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    ID Người dùng *
                                </label>
                                <input
                                    type="text"
                                    value={newMemberData.userId}
                                    onChange={(e) => setNewMemberData(prev => ({ ...prev, userId: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Nhập ID người dùng"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Mức lương thỏa thuận (VND)
                                </label>
                                <input
                                    type="number"
                                    value={newMemberData.agreedRate}
                                    onChange={(e) => setNewMemberData(prev => ({ ...prev, agreedRate: parseInt(e.target.value) || 0 }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Nhập mức lương"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    URL Hợp đồng
                                </label>
                                <input
                                    type="url"
                                    value={newMemberData.contractUrl}
                                    onChange={(e) => setNewMemberData(prev => ({ ...prev, contractUrl: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="https://example.com/contract.pdf"
                                />
                            </div>
                        </div>
                        
                        <div className="flex justify-end space-x-3 mt-6">
                            <button
                                onClick={() => setShowAddMemberModal(false)}
                                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={handleAddMember}
                                disabled={isAddingMember}
                                className="cursor-pointer px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                            >
                                {isAddingMember ? 'Đang thêm...' : 'Thêm thành viên'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Applications Modal */}
            {showApplicationsModal && (
                <div className="fixed inset-0 bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg border border-gray-200 shadow-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold">Đơn ứng tuyển ({applications.length})</h2>
                            <button
                                onClick={() => setShowApplicationsModal(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {isLoadingApplications ? (
                            <div className="flex items-center justify-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                            </div>
                        ) : applications.length === 0 ? (
                            <div className="text-center py-8">
                                <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <p className="text-gray-500">Chưa có đơn ứng tuyển nào</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {applications.map((application) => (
                                    <div key={application.id} className="border border-gray-200 rounded-lg p-6">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex items-center">
                                                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                                                    <span className="text-blue-600 font-semibold">
                                                        {application.developer?.name?.charAt(0) || 'D'}
                                                    </span>
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <h3 className="font-semibold text-gray-900">
                                                            {application.developer?.name || 'Người dùng'}
                                                        </h3>
                                                        {teamMembers.some(member => member.developerId === application.developerId) && (
                                                            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                                                                Đã trong đội ngũ
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-sm text-gray-500">
                                                        {application.developer?.email || 'email@example.com'}
                                                    </p>
                                                    <p className="text-xs text-gray-400">
                                                        Ứng tuyển lúc: {formatDate(application.appliedDate)}
                                                    </p>
                                                </div>
                                            </div>
                                            <span className={`px-3 py-1 text-sm font-medium rounded-full ${getApplicationStatusColor(application.status)}`}>
                                                {getApplicationStatusText(application.status)}
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                            <div>
                                                <p className="text-sm font-medium text-gray-500">Mức lương mong muốn</p>
                                                <p className="text-gray-900">
                                                    {application.expectedRate ? formatCurrency(application.expectedRate) : 'Thỏa thuận'}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-500">Thời gian hoàn thành</p>
                                                <p className="text-gray-900">
                                                    {application.deliveryTime ? `${application.deliveryTime} ngày` : 'Chưa xác định'}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-500">Kỹ năng</p>
                                                <div className="flex flex-wrap gap-1">
                                                    {application.developer?.developerProfile?.skills?.slice(0, 3).map((skill, index) => (
                                                        <span key={index} className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs">
                                                            {typeof skill === 'string' ? skill : (skill?.name || 'Unknown Skill')}
                                                        </span>
                                                    ))}
                                                    {(application.developer?.developerProfile?.skills?.length || 0) > 3 && (
                                                        <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                                                            +{(application.developer?.developerProfile?.skills?.length || 0) - 3}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {application.coverLetter && (
                                            <div className="mb-4">
                                                <p className="text-sm font-medium text-gray-500 mb-2">Thư xin việc</p>
                                                <p className="text-gray-900 bg-gray-50 p-3 rounded-lg text-sm">
                                                    {application.coverLetter}
                                                </p>
                                            </div>
                                        )}

                                        {application.notes && (
                                            <div className="mb-4">
                                                <p className="text-sm font-medium text-gray-500 mb-2">Ghi chú</p>
                                                <p className="text-gray-900 bg-yellow-50 p-3 rounded-lg text-sm">
                                                    {application.notes}
                                                </p>
                                            </div>
                                        )}

                                        <div className="flex justify-end space-x-2">
                                            <button
                                                onClick={() => openStatusModal(application)}
                                                disabled={application.status === ApplicationStatus.ACCEPTED && teamMembers.some(member => member.developerId === application.developerId)}
                                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                                            >
                                                {application.status === ApplicationStatus.ACCEPTED && teamMembers.some(member => member.developerId === application.developerId) 
                                                    ? 'Đã chấp nhận' 
                                                    : 'Cập nhật trạng thái'
                                                }
                                            </button>
                                            <button
                                                onClick={() => handleDeleteApplication(application.id)}
                                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
                                            >
                                                Xóa
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Status Update Modal */}
            {showStatusModal && selectedApplication && (
                <div className="fixed inset-0 bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg border border-gray-200 shadow-xl p-6 w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4">Cập nhật trạng thái ứng tuyển</h2>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Trạng thái *
                                </label>
                                <select
                                    value={statusUpdateData.status}
                                    onChange={(e) => setStatusUpdateData(prev => ({ ...prev, status: e.target.value as ApplicationStatus }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value={ApplicationStatus.PENDING}>Chờ xét duyệt</option>
                                    <option value={ApplicationStatus.ACCEPTED}>Chấp nhận</option>
                                    <option value={ApplicationStatus.REJECTED}>Từ chối</option>
                                </select>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Ghi chú
                                </label>
                                <textarea
                                    value={statusUpdateData.notes}
                                    onChange={(e) => setStatusUpdateData(prev => ({ ...prev, notes: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    rows={3}
                                    placeholder="Nhập ghi chú (tùy chọn)"
                                />
                            </div>
                        </div>
                        
                        <div className="flex justify-end space-x-3 mt-6">
                            <button
                                onClick={() => setShowStatusModal(false)}
                                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={handleUpdateApplicationStatus}
                                disabled={isUpdating}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                            >
                                {isUpdating ? 'Đang cập nhật...' : 'Cập nhật'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
