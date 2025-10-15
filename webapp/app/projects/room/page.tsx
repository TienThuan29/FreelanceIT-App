'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { useProjectManagement } from '@/hooks/useProjectManagement'
import { useChat } from '@/contexts/ChatContext'
import { ProjectTeamMember } from '@/hooks/useProjectManagement'
import { formatCurrency } from '@/lib/curency'
import { formatDate } from '@/lib/date'
import { toast } from 'sonner'
import { ProjectStatus } from '@/types/shared.type'

export default function ProjectRoomPage() {
    const params = useParams()
    const router = useRouter()
    const { user, isLoading: authLoading } = useAuth()
    const projectId = params.id as string

    const [activeTab, setActiveTab] = useState<'overview' | 'team' | 'chat' | 'files' | 'timeline'>('overview')
    const [project, setProject] = useState<any>(null)
    const [teamMembers, setTeamMembers] = useState<ProjectTeamMember[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [showAddMemberModal, setShowAddMemberModal] = useState(false)
    const [newMemberData, setNewMemberData] = useState({
        userId: '',
        agreedRate: 0,
        contractUrl: ''
    })
    const [isAddingMember, setIsAddingMember] = useState(false)

    const {
        getProjectById,
        getProjectTeamMembers,
        addProjectTeamMember,
        removeProjectTeamMember,
        isLoading: isLoadingTeamMembers
    } = useProjectManagement()

    const {
        conversations,
        createConversation,
        sendMessage,
        currentConversation,
        messages,
        setCurrentConversation,
        joinConversation
    } = useChat()

    const [projectConversation, setProjectConversation] = useState<any>(null)
    const [messageInput, setMessageInput] = useState('')
    const messagesEndRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!authLoading && user && projectId) {
            fetchProjectData()
        }
    }, [authLoading, user, projectId])

    useEffect(() => {
        if (teamMembers.length > 0) {
            createProjectChat()
        }
    }, [teamMembers])

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const fetchProjectData = async () => {
        try {
            setIsLoading(true)
            
            // Fetch project details
            const projectData = await getProjectById(projectId)
            setProject(projectData)
            
            // Fetch team members
            const members = await getProjectTeamMembers(projectId)
            setTeamMembers(members)
        } catch (error) {
            toast.error('Không thể tải thông tin dự án')
            console.error('Error fetching project data:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const createProjectChat = async () => {
        try {
            // Check if project chat already exists
            const existingChat = conversations.find(conv => 
                conv.projectId === projectId && conv.name?.includes('Project Chat')
            )
            
            if (existingChat) {
                setProjectConversation(existingChat)
                setCurrentConversation(existingChat)
                joinConversation(existingChat.id)
                return
            }

            // Create new project chat with all team members
            const participantIds = teamMembers.map(member => member.developerId)
            if (user?.id && !participantIds.includes(user.id)) {
                participantIds.push(user.id)
            }

            const chat = await createConversation(participantIds, projectId)

            if (chat) {
                setProjectConversation(chat)
                setCurrentConversation(chat)
                joinConversation(chat.id)
            }
        } catch (error) {
            console.error('Error creating project chat:', error)
        }
    }

    const handleAddMember = async () => {
        if (!newMemberData.userId) {
            toast.error('Vui lòng nhập ID người dùng')
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
            
            // Refresh team members
            const members = await getProjectTeamMembers(projectId)
            setTeamMembers(members)
            
            toast.success('Đã thêm thành viên vào dự án')
        } catch (error) {
            toast.error('Không thể thêm thành viên')
        } finally {
            setIsAddingMember(false)
        }
    }

    const handleRemoveMember = async (developerId: string) => {
        if (!window.confirm('Bạn có chắc chắn muốn xóa thành viên này khỏi dự án?')) {
            return
        }

        try {
            await removeProjectTeamMember(projectId, developerId)
            
            // Refresh team members
            const members = await getProjectTeamMembers(projectId)
            setTeamMembers(members)
            
            toast.success('Đã xóa thành viên khỏi dự án')
        } catch (error) {
            toast.error('Không thể xóa thành viên')
        }
    }

    const handleSendMessage = async () => {
        if (!messageInput.trim() || !projectConversation) return

        try {
            await sendMessage(messageInput.trim())
            setMessageInput('')
        } catch (error) {
            toast.error('Không thể gửi tin nhắn')
        }
    }

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    const getProjectStatusColor = (status: ProjectStatus) => {
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

    const getProjectStatusText = (status: ProjectStatus) => {
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

    const isProjectOwner = user?.id === project?.ownerId
    const isTeamMember = teamMembers.some(member => member.developerId === user?.id)

    // Show loading while authentication is being checked
    if (authLoading || isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
            </div>
        )
    }

    // Redirect if not authenticated or not authorized
    if (!user) {
        router.push('/login')
        return null
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

    if (!isProjectOwner && !isTeamMember) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Không có quyền truy cập</h2>
                    <p className="text-gray-600 mb-4">Bạn không phải là chủ dự án hoặc thành viên của dự án này.</p>
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
            {/* Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => router.back()}
                                className="flex items-center text-gray-600 hover:text-gray-900"
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                                Quay lại
                            </button>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">{project.title}</h1>
                                <div className="flex items-center gap-3 mt-1">
                                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getProjectStatusColor(project.status)}`}>
                                        {getProjectStatusText(project.status)}
                                    </span>
                                    <span className="text-sm text-gray-500">
                                        {teamMembers.length} thành viên
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            {isProjectOwner && (
                                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                                    Chủ dự án
                                </span>
                            )}
                            {isTeamMember && !isProjectOwner && (
                                <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                                    Thành viên
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {/* Tabs */}
                <div className="mb-6">
                    <div className="border-b border-gray-200">
                        <nav className="-mb-px flex space-x-8">
                            {[
                                { id: 'overview', label: 'Tổng quan', icon: '📊' },
                                { id: 'team', label: 'Đội ngũ', icon: '👥' },
                                { id: 'chat', label: 'Trò chuyện', icon: '💬' },
                                { id: 'files', label: 'Tài liệu', icon: '📁' },
                                { id: 'timeline', label: 'Timeline', icon: '📅' }
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id as any)}
                                    className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                                        activeTab === tab.id
                                            ? 'border-blue-500 text-blue-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                                >
                                    <span>{tab.icon}</span>
                                    {tab.label}
                                </button>
                            ))}
                        </nav>
                    </div>
                </div>

                {/* Overview Tab */}
                {activeTab === 'overview' && (
                    <div className="space-y-6">
                        {/* Project Info */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Thông tin dự án</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500 mb-2">Mô tả</h3>
                                    <p className="text-gray-900 leading-relaxed">{project.description}</p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500 mb-2">Kỹ năng yêu cầu</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {project.requiredSkills?.map((skill: string, index: number) => (
                                            <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Project Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-100 rounded-lg">
                                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Thành viên</p>
                                        <p className="text-2xl font-bold text-gray-900">{teamMembers.length}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-green-100 rounded-lg">
                                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Ngân sách</p>
                                        <p className="text-2xl font-bold text-gray-900">{formatCurrency(project.budget || 0)}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-purple-100 rounded-lg">
                                        <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Thời gian ước tính</p>
                                        <p className="text-2xl font-bold text-gray-900">{project.estimateDuration || 0} ngày</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-yellow-100 rounded-lg">
                                        <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a4 4 0 118 0v4m-4 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Ngày tạo</p>
                                        <p className="text-2xl font-bold text-gray-900">{formatDate(project.createdDate)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Team Tab */}
                {activeTab === 'team' && (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-semibold text-gray-900">Đội ngũ dự án</h2>
                            {isProjectOwner && (
                                <button
                                    onClick={() => setShowAddMemberModal(true)}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                    Thêm thành viên
                                </button>
                            )}
                        </div>

                        {isLoadingTeamMembers ? (
                            <div className="flex items-center justify-center py-12">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                            </div>
                        ) : teamMembers.length === 0 ? (
                            <div className="text-center py-12 bg-white rounded-xl shadow-sm">
                                <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có thành viên nào</h3>
                                <p className="text-gray-500">Dự án chưa có thành viên nào. Hãy thêm thành viên để bắt đầu!</p>
                            </div>
                        ) : (
                            <div className="grid gap-4">
                                {teamMembers.map((member) => (
                                    <div key={member.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                                    <span className="text-blue-600 font-semibold text-lg">
                                                        {member.developerName?.charAt(0) || 'D'}
                                                    </span>
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-gray-900">{member.developerName}</h3>
                                                    <p className="text-sm text-gray-500">{member.developerEmail}</p>
                                                    <div className="flex items-center gap-4 mt-1">
                                                        {member.agreedRate && (
                                                            <span className="text-sm text-green-600 font-medium">
                                                                {formatCurrency(member.agreedRate)}/tháng
                                                            </span>
                                                        )}
                                                        <span className={`px-2 py-1 text-xs rounded-full ${
                                                            member.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                                        }`}>
                                                            {member.isActive ? 'Hoạt động' : 'Không hoạt động'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {member.contractUrl && (
                                                    <a
                                                        href={member.contractUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="px-3 py-1 text-blue-600 hover:text-blue-800 text-sm border border-blue-200 rounded-lg"
                                                    >
                                                        Hợp đồng
                                                    </a>
                                                )}
                                                {isProjectOwner && (
                                                    <button
                                                        onClick={() => handleRemoveMember(member.developerId)}
                                                        className="px-3 py-1 text-red-600 hover:text-red-800 text-sm border border-red-200 rounded-lg"
                                                    >
                                                        Xóa
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Chat Tab */}
                {activeTab === 'chat' && (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-semibold text-gray-900">Trò chuyện nhóm</h2>
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-500">
                                    {messages?.length || 0} tin nhắn
                                </span>
                                <span className="text-sm text-gray-500">•</span>
                                <span className="text-sm text-gray-500">
                                    {teamMembers.length} thành viên
                                </span>
                            </div>
                        </div>

                        {projectConversation ? (
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 h-96 flex flex-col">
                                {/* Messages */}
                                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                    {messages?.map((message: any, index: number) => (
                                        <div
                                            key={index}
                                            className={`flex ${message.senderId === user?.id ? 'justify-end' : 'justify-start'}`}
                                        >
                                            <div
                                                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                                                    message.senderId === user?.id
                                                        ? 'bg-blue-600 text-white'
                                                        : 'bg-gray-100 text-gray-900'
                                                }`}
                                            >
                                                <p className="text-sm">{message.content}</p>
                                                <p className={`text-xs mt-1 ${
                                                    message.senderId === user?.id ? 'text-blue-100' : 'text-gray-500'
                                                }`}>
                                                    {formatDate(message.createdAt)}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                    <div ref={messagesEndRef} />
                                </div>

                                {/* Message Input */}
                                <div className="border-t border-gray-200 p-4">
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={messageInput}
                                            onChange={(e) => setMessageInput(e.target.value)}
                                            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                            placeholder="Nhập tin nhắn..."
                                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        <button
                                            onClick={handleSendMessage}
                                            disabled={!messageInput.trim()}
                                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-12 bg-white rounded-xl shadow-sm">
                                <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">Đang tạo phòng chat...</h3>
                                <p className="text-gray-500">Hệ thống đang thiết lập phòng trò chuyện cho nhóm dự án.</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Files Tab */}
                {activeTab === 'files' && (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-semibold text-gray-900">Tài liệu dự án</h2>
                            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                Tải lên
                            </button>
                        </div>

                        <div className="text-center py-12 bg-white rounded-xl shadow-sm">
                            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có tài liệu nào</h3>
                            <p className="text-gray-500">Tải lên tài liệu để chia sẻ với nhóm dự án.</p>
                        </div>
                    </div>
                )}

                {/* Timeline Tab */}
                {activeTab === 'timeline' && (
                    <div className="space-y-6">
                        <h2 className="text-xl font-semibold text-gray-900">Timeline dự án</h2>

                        <div className="text-center py-12 bg-white rounded-xl shadow-sm">
                            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Timeline chưa được thiết lập</h3>
                            <p className="text-gray-500">Timeline dự án sẽ hiển thị các mốc thời gian quan trọng.</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Add Member Modal */}
            {showAddMemberModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
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
