'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { useProjectManagement } from '@/hooks/useProjectManagement'
import { useChat } from '@/contexts/ChatContext'
import { ProjectTeamMember } from '@/hooks/useProjectManagement'
import { toast } from 'sonner'
import { ProjectStatus } from '@/types/shared.type'
import { PageUrl } from '@/configs/page.url'
import { FiArrowLeft, FiBarChart, FiUsers, FiMessageCircle, FiFolder, FiCalendar } from 'react-icons/fi'
import OverviewTab from './OverviewTab'
import TeamTab from './TeamTab'
import ChatTab from './ChatTab'
import FilesTab from './FilesTab'
import TimelineTab from './TimelineTab'
import AddMemberModal from './AddMemberModal'


export default function ProjectRoomPage() {
    const params = useParams()
    const router = useRouter()
    const { user, isLoading: authLoading } = useAuth()
    const projectId = params.id as string

    const [activeTab, setActiveTab] = useState<'overview' | 'team' | 'chat' | 'files' | 'timeline'>('overview')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
        joinConversation,
        setEnableSocket,
        loadMessages,
        loadConversations,
        isConnected
    } = useChat()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [projectConversation, setProjectConversation] = useState<any>(null)
    const [messageInput, setMessageInput] = useState('')
    const [isCreatingChat, setIsCreatingChat] = useState(false)

    useEffect(() => {
        if (!authLoading && user && projectId) {
            fetchProjectData()
        }
    }, [authLoading, user, projectId])

    // Enable socket connection when in project room
    useEffect(() => {
        console.log('Project Room: Enabling socket connection')
        setEnableSocket(true)
        return () => {
            console.log('Project Room: Disabling socket connection')
            setEnableSocket(false)
        }
    }, [setEnableSocket])

    useEffect(() => {
        if (teamMembers.length > 0 && user && isConnected) {
            console.log('Team members loaded, creating project chat', {
                teamMembersCount: teamMembers.length,
                userId: user.id,
                isConnected,
                conversationsCount: conversations.length
            })
            // Reload conversations first to ensure we have the latest data
            loadConversations().then(() => {
                createProjectChat()
            })
        }
    }, [teamMembers, user, isConnected])

    // Refresh conversation when team members change (for new members)
    useEffect(() => {
        if (teamMembers.length > 0 && user && isConnected && projectConversation) {
            const currentParticipantIds = teamMembers.map(member => member.developerId)
            if (user?.id && !currentParticipantIds.includes(user.id)) {
                currentParticipantIds.push(user.id)
            }

            const existingParticipantIds = projectConversation.participants || []
            
            // Check if there are new team members not in the conversation
            const newMembers = currentParticipantIds.filter(pid => !existingParticipantIds.includes(pid))
            
            if (newMembers.length > 0) {
                console.log('New team members detected, refreshing conversation:', newMembers)
                // Reload conversations first to get the updated conversation
                loadConversations().then(() => {
                    createProjectChat()
                })
            }
        }
    }, [teamMembers])


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
            setIsCreatingChat(true)
            console.log('Creating project chat for project:', projectId)
            console.log('Team members:', teamMembers)
            
            // Always try to create or find the conversation with all current team members
            // This ensures new members get access even if they weren't in the original conversation
            const participantIds = teamMembers.map(member => member.developerId)
            if (user?.id && !participantIds.includes(user.id)) {
                participantIds.push(user.id)
            }

            console.log('Creating/finding conversation with participants:', participantIds)
            const chat = await createConversation(participantIds, projectId)

            if (chat) {
                console.log('Got conversation:', chat.id)
                setProjectConversation(chat)
                setCurrentConversation(chat)
                console.log('Joining conversation:', chat.id)
                joinConversation(chat.id)
                // Load messages for the conversation
                console.log('Loading messages for conversation:', chat.id)
                await loadMessages(chat.id)
            }
            setIsCreatingChat(false)
        } catch (error) {
            console.error('Error creating project chat:', error)
            toast.error('Không thể tạo phòng chat cho dự án')
            setIsCreatingChat(false)
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

        console.log('Project Room: Attempting to send message:', {
            message: messageInput.trim(),
            conversationId: projectConversation.id,
            currentConversation: currentConversation?.id,
            isConnected,
            socketStatus: isConnected ? 'Connected' : 'Disconnected'
        })

        // Check if socket is connected
        if (!isConnected) {
            toast.error('Đang kết nối đến chat server...')
            return
        }

        try {
            await sendMessage(messageInput.trim())
            setMessageInput('')
            console.log('Message sent successfully')
        } catch (error) {
            console.error('Project Room: Error sending message:', error)
            toast.error('Không thể gửi tin nhắn')
        }
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

    const isProjectOwner = user?.id === project?.customerId
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
        router.push(PageUrl.LOGIN_PAGE)
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

    // Only check authorization after project data is loaded
    if (project && !isProjectOwner && !isTeamMember) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Không có quyền truy cập</h2>
                    <p className="text-gray-600 mb-4">Bạn không phải là chủ dự án hoặc thành viên của dự án này.</p>
                    <div className="text-sm text-gray-500 mb-4">
                        <p>User ID: {user?.id}</p>
                        <p>Project Customer ID: {project?.customerId}</p>
                        <p>Is Project Owner: {isProjectOwner ? 'Yes' : 'No'}</p>
                        <p>Is Team Member: {isTeamMember ? 'Yes' : 'No'}</p>
                    </div>
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
                                <FiArrowLeft className="w-5 h-5 mr-2" />
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
                                { id: 'overview', label: 'Tổng quan', icon: FiBarChart },
                                { id: 'team', label: 'Đội ngũ', icon: FiUsers },
                                { id: 'chat', label: 'Trò chuyện', icon: FiMessageCircle },
                                { id: 'files', label: 'Tài liệu', icon: FiFolder },
                                { id: 'timeline', label: 'Timeline', icon: FiCalendar }
                            ].map((tab) => (
                                <button
                                    key={tab.id}
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                    onClick={() => setActiveTab(tab.id as any)}
                                    className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                                        activeTab === tab.id
                                            ? 'border-blue-500 text-blue-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                                >
                                    <tab.icon className="w-4 h-4" />
                                    {tab.label}
                                </button>
                            ))}
                        </nav>
                    </div>
                </div>

                {/* Overview Tab */}
                {activeTab === 'overview' && (
                    <OverviewTab project={project} teamMembers={teamMembers} />
                )}

                {/* Team Tab */}
                {activeTab === 'team' && (
                    <TeamTab
                        teamMembers={teamMembers}
                        isLoadingTeamMembers={isLoadingTeamMembers}
                        isProjectOwner={isProjectOwner}
                        onShowAddMemberModal={() => setShowAddMemberModal(true)}
                        onRemoveMember={handleRemoveMember}
                    />
                )}

                {/* Chat Tab */}
                {activeTab === 'chat' && (
                    <ChatTab
                        isConnected={isConnected}
                        messages={messages}
                        teamMembers={teamMembers}
                        projectConversation={projectConversation}
                        isCreatingChat={isCreatingChat}
                        messageInput={messageInput}
                        setMessageInput={setMessageInput}
                        onSendMessage={handleSendMessage}
                        user={user}
                    />
                )}

                {/* Files Tab */}
                {activeTab === 'files' && (
                    <FilesTab 
                        projectId={projectId}
                    />
                )}

                {/* Timeline Tab */}
                {activeTab === 'timeline' && (
                    <TimelineTab projectId={projectId} />
                )}
            </div>

            {/* Add Member Modal */}
            <AddMemberModal
                isOpen={showAddMemberModal}
                newMemberData={newMemberData}
                isAddingMember={isAddingMember}
                onClose={() => setShowAddMemberModal(false)}
                onAddMember={handleAddMember}
                onUpdateMemberData={(data) => setNewMemberData(prev => ({ ...prev, ...data }))}
            />
        </div>
    )
}
