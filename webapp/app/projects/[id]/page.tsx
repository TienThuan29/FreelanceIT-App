'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import type { Project, ProjectTeam } from '@/types/project.type'
import { ProjectStatus } from '@/types/shared.type'
import { formatCurrency } from '@/lib/curency'
import { formatDate } from '@/lib/date'
import { useProjectManagement } from '@/hooks/useProjectManagement'
import { toast } from 'sonner'
// import NavbarAuthenticated from '@/components/NavbarAuthenticated'

interface ProjectTeamMember {
    id: string
    developerId: string
    developerName: string
    developerEmail: string
    developerAvatar?: string
    agreedRate?: number
    contractUrl?: string
    joinedDate?: Date
    isActive: boolean
}

export default function ProjectDetailPage() {
    const params = useParams()
    const router = useRouter()
    const { getProjectById, addUserToProject, removeUserFromProject } = useProjectManagement()
    
    const [project, setProject] = useState<Project | null>(null)
    const [teamMembers, setTeamMembers] = useState<ProjectTeamMember[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isAddingMember, setIsAddingMember] = useState(false)
    const [showAddMemberModal, setShowAddMemberModal] = useState(false)
    const [newMemberData, setNewMemberData] = useState({
        userId: '',
        agreedRate: 0,
        contractUrl: ''
    })

    const projectId = params.id as string

    useEffect(() => {
        fetchProjectDetails()
    }, [projectId])

    const fetchProjectDetails = async () => {
        try {
            setIsLoading(true)
            const projectData = await getProjectById(projectId)
            setProject(projectData)
            
            // Mock team members data - replace with actual API call
            setTeamMembers([
                {
                    id: '1',
                    developerId: 'dev1',
                    developerName: 'Nguyễn Văn A',
                    developerEmail: 'nguyenvana@email.com',
                    developerAvatar: 'https://via.placeholder.com/40',
                    agreedRate: 5000000,
                    contractUrl: 'https://example.com/contract1.pdf',
                    joinedDate: new Date('2024-01-15'),
                    isActive: true
                },
                {
                    id: '2',
                    developerId: 'dev2',
                    developerName: 'Trần Thị B',
                    developerEmail: 'tranthib@email.com',
                    developerAvatar: 'https://via.placeholder.com/40',
                    agreedRate: 4500000,
                    contractUrl: 'https://example.com/contract2.pdf',
                    joinedDate: new Date('2024-02-01'),
                    isActive: true
                }
            ])
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
            await addUserToProject({
                projectId,
                userId: newMemberData.userId,
                agreedRate: newMemberData.agreedRate,
                contractUrl: newMemberData.contractUrl
            })
            toast.success('Thêm thành viên thành công')
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
            await removeUserFromProject(projectId, userId)
            toast.success('Xóa thành viên thành công')
            fetchProjectDetails()
        } catch (error) {
            toast.error('Không thể xóa thành viên')
        }
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
                                <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                                    Chỉnh sửa dự án
                                </button>
                                <button className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                                    Xuất báo cáo
                                </button>
                                <button className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700">
                                    Sao chép dự án
                                </button>
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
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                            >
                                {isAddingMember ? 'Đang thêm...' : 'Thêm thành viên'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
