'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useProjectManagement } from '@/hooks/useProjectManagement'
import useApplicationManagement, { ProjectApplication } from '@/hooks/useApplicationManagement'
import { useAllProjects } from '@/hooks/useAllProjects'
import { ProjectTeamMember } from '@/hooks/useProjectManagement'
import { ProjectStatus, ApplicationStatus } from '@/types/shared.type'
import { formatCurrency } from '@/lib/curency'
import { formatDate } from '@/lib/date'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

export default function DeveloperProjectsPage() {
    const { user, isLoading: authLoading } = useAuth()
    const router = useRouter()
    const [activeTab, setActiveTab] = useState<'current-projects' | 'applications'>('current-projects')
    const [isLoading, setIsLoading] = useState(true)
    const [currentProjects, setCurrentProjects] = useState<ProjectTeamMember[]>([])
    const [applications, setApplications] = useState<ProjectApplication[]>([])
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [projectDetails, setProjectDetails] = useState<{[key: string]: any}>({})

    const { 
        getDeveloperProjects,
        isLoading: isLoadingProjects 
    } = useProjectManagement()

    const { 
        getApplicationsByDeveloper,
        isLoading: isLoadingApplications 
    } = useApplicationManagement()

    const { 
        getProjectById 
    } = useAllProjects()

    const fetchProjectDetails = useCallback(async (projectIds: string[]) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const projectDetailsMap: {[key: string]: any} = {}
        
        // Fetch project details for all unique project IDs
        const uniqueProjectIds = [...new Set(projectIds)]
        
        await Promise.all(
            uniqueProjectIds.map(async (projectId) => {
                try {
                    const project = await getProjectById(projectId)
                    if (project) {
                        projectDetailsMap[projectId] = project
                    }
                } catch (error) {
                    console.error(`Error fetching project ${projectId}:`, error)
                }
            })
        )
        
        return projectDetailsMap
    }, [getProjectById])

    useEffect(() => {
        if (!authLoading && user) {
            fetchData()
        }
    }, [authLoading, user, fetchProjectDetails])

    const fetchData = async () => {
        try {
            setIsLoading(true)
            
            // Fetch current projects (team memberships) - uses current authenticated user
            const projects = await getDeveloperProjects()
            setCurrentProjects(projects)
            
            // Fetch applications (uses current authenticated user)
            const devApplications = await getApplicationsByDeveloper()
            setApplications(devApplications)
            
            // Collect all project IDs
            const projectIds = [
                ...projects.map(p => p.projectId),
                ...devApplications.map(a => a.projectId)
            ]
            
            // Fetch project details for all projects
            const details = await fetchProjectDetails(projectIds)
            setProjectDetails(details)
            
        } catch (error) {
            toast.error('Không thể tải dữ liệu')
            console.error('Error fetching developer data:', error)
        } finally {
            setIsLoading(false)
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

    const handleViewProject = (projectId: string) => {
        router.push(`/posts-cus/${projectId}`)
    }

    // Show loading while authentication is being checked
    if (authLoading || isLoading) {
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

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Dự án của tôi</h1>
                    <p className="text-gray-600">Quản lý dự án và đơn ứng tuyển</p>
                </div>

                {/* Tabs */}
                <div className="mb-8">
                    <div className="border-b border-gray-200">
                        <nav className="-mb-px flex space-x-8">
                            <button
                                onClick={() => setActiveTab('current-projects')}
                                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                                    activeTab === 'current-projects'
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                            >
                                Dự án hiện tại ({currentProjects.length})
                            </button>
                            <button
                                onClick={() => setActiveTab('applications')}
                                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                                    activeTab === 'applications'
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                            >
                                Đơn ứng tuyển ({applications.length})
                            </button>
                        </nav>
                    </div>
                </div>

                {/* Current Projects Tab */}
                {activeTab === 'current-projects' && (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-semibold text-gray-900">Dự án đang tham gia</h2>
                            <button
                                onClick={() => router.push('/posts-cus')}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                                Tìm dự án mới
                            </button>
                        </div>

                        {isLoadingProjects ? (
                            <div className="flex items-center justify-center py-12">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                            </div>
                        ) : currentProjects.length === 0 ? (
                            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                                <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                </svg>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có dự án nào</h3>
                                <p className="text-gray-500 mb-4">Bạn chưa tham gia dự án nào. Hãy ứng tuyển vào các dự án phù hợp!</p>
                                <button
                                    onClick={() => router.push('/posts-cus')}
                                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                >
                                    Khám phá dự án
                                </button>
                            </div>
                        ) : (
                            <div className="grid gap-6">
                                {currentProjects.map((project) => (
                                    <div key={project.id} className="bg-white rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 overflow-hidden">
                                        {/* Header Section */}
                                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-100">
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <h3 className="text-xl font-bold text-gray-900 line-clamp-1">
                                                            {projectDetails[project.projectId]?.title || `Dự án #${project.projectId}`}
                                                        </h3>
                                                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                                                            project.isActive ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-gray-100 text-gray-800 border border-gray-200'
                                                        }`}>
                                                            {project.isActive ? 'Đang hoạt động' : 'Không hoạt động'}
                                                        </span>
                                                    </div>
                                                    {projectDetails[project.projectId]?.status && (
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-sm text-gray-600">Trạng thái dự án:</span>
                                                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getProjectStatusColor(projectDetails[project.projectId].status)}`}>
                                                                {getProjectStatusText(projectDetails[project.projectId].status)}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleViewProject(project.projectId)}
                                                        className="px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200 text-sm font-medium shadow-sm"
                                                    >
                                                        Xem dự án
                                                    </button>
                                                    <button
                                                        onClick={() => router.push(`/projects/room/${project.projectId}`)}
                                                        className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm font-medium shadow-sm flex items-center gap-1"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                                        </svg>
                                                        Room
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Content Section */}
                                        <div className="p-6">
                                            {/* Description */}
                                            <div className="mb-6">
                                                <p className="text-gray-700 leading-relaxed">
                                                    {projectDetails[project.projectId]?.description || `Dự án ID: ${project.projectId}`}
                                                </p>
                                            </div>

                                            {/* Project Stats */}
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                                <div className="bg-gray-50 rounded-lg p-4">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a4 4 0 118 0v4m-4 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                                                        </svg>
                                                        <span className="text-sm font-medium text-gray-600">Tham gia</span>
                                                    </div>
                                                    <p className="text-lg font-semibold text-gray-900">
                                                        {formatDate(project.joinedDate || new Date())}
                                                    </p>
                                                </div>

                                                {project.agreedRate && (
                                                    <div className="bg-green-50 rounded-lg p-4">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                                            </svg>
                                                            <span className="text-sm font-medium text-gray-600">Lương thỏa thuận</span>
                                                        </div>
                                                        <p className="text-lg font-semibold text-green-700">
                                                            {formatCurrency(project.agreedRate)}/tháng
                                                        </p>
                                                    </div>
                                                )}

                                                {projectDetails[project.projectId]?.budget && (
                                                    <div className="bg-purple-50 rounded-lg p-4">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                                            </svg>
                                                            <span className="text-sm font-medium text-gray-600">Ngân sách dự án</span>
                                                        </div>
                                                        <p className="text-lg font-semibold text-purple-700">
                                                            {formatCurrency(projectDetails[project.projectId].budget)}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Skills Section */}
                                            {project.developerProfile?.skills && project.developerProfile.skills.length > 0 && (
                                                <div className="mb-6">
                                                    <h4 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                                        <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                                        </svg>
                                                        Kỹ năng đang sử dụng
                                                    </h4>
                                                    <div className="flex flex-wrap gap-2">
                                                        {project.developerProfile.skills.slice(0, 6).map((skill, index) => (
                                                            <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium border border-blue-200">
                                                                {typeof skill === 'string' ? skill : (skill?.name || 'Unknown Skill')}
                                                            </span>
                                                        ))}
                                                        {project.developerProfile.skills.length > 6 && (
                                                            <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm font-medium border border-gray-200">
                                                                +{project.developerProfile.skills.length - 6} khác
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Contract Section */}
                                            {project.contractUrl && (
                                                <div className="pt-4 border-t border-gray-100">
                                                    <a
                                                        href={project.contractUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                        </svg>
                                                        Xem hợp đồng
                                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6l6 6-6 6" />
                                                        </svg>
                                                    </a>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Applications Tab */}
                {activeTab === 'applications' && (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-semibold text-gray-900">Đơn ứng tuyển</h2>
                            <button
                                onClick={() => router.push('/posts-cus')}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                            >
                                Ứng tuyển mới
                            </button>
                        </div>

                        {isLoadingApplications ? (
                            <div className="flex items-center justify-center py-12">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                            </div>
                        ) : applications.length === 0 ? (
                            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                                <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có đơn ứng tuyển nào</h3>
                                <p className="text-gray-500 mb-4">Bạn chưa ứng tuyển vào dự án nào. Hãy tìm dự án phù hợp và ứng tuyển ngay!</p>
                                <button
                                    onClick={() => router.push('/posts-cus')}
                                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                                >
                                    Ứng tuyển ngay
                                </button>
                            </div>
                        ) : (
                            <div className="grid gap-6">
                                {applications.map((application) => (
                                    <div key={application.id} className="bg-white rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 overflow-hidden">
                                        {/* Header Section */}
                                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-4 border-b border-gray-100">
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <h3 className="text-xl font-bold text-gray-900 line-clamp-1">
                                                            {projectDetails[application.projectId]?.title || `Dự án #${application.projectId}`}
                                                        </h3>
                                                        <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${getApplicationStatusColor(application.status)}`}>
                                                            {getApplicationStatusText(application.status)}
                                                        </span>
                                                    </div>
                                                    {projectDetails[application.projectId]?.status && (
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-sm text-gray-600">Trạng thái dự án:</span>
                                                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getProjectStatusColor(projectDetails[application.projectId].status)}`}>
                                                                {getProjectStatusText(projectDetails[application.projectId].status)}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleViewProject(application.projectId)}
                                                        className="px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200 text-sm font-medium shadow-sm"
                                                    >
                                                        Xem dự án
                                                    </button>
                                                    {application.status === ApplicationStatus.ACCEPTED && (
                                                        <button
                                                            onClick={() => router.push(`/projects/room/${application.projectId}`)}
                                                            className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 text-sm font-medium shadow-sm flex items-center gap-1"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                                            </svg>
                                                            Room
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Content Section */}
                                        <div className="p-6">
                                            {/* Description */}
                                            <div className="mb-6">
                                                <p className="text-gray-700 leading-relaxed">
                                                    {projectDetails[application.projectId]?.description || `Dự án ID: ${application.projectId}`}
                                                </p>
                                            </div>

                                            {/* Application Stats */}
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                                <div className="bg-green-50 rounded-lg p-4">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                                        </svg>
                                                        <span className="text-sm font-medium text-gray-600">Lương mong muốn</span>
                                                    </div>
                                                    <p className="text-lg font-semibold text-green-700">
                                                        {application.expectedRate ? formatCurrency(application.expectedRate) : 'Thỏa thuận'}
                                                    </p>
                                                </div>

                                                <div className="bg-blue-50 rounded-lg p-4">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                        <span className="text-sm font-medium text-gray-600">Thời gian hoàn thành</span>
                                                    </div>
                                                    <p className="text-lg font-semibold text-blue-700">
                                                        {application.deliveryTime ? `${application.deliveryTime} ngày` : 'Chưa xác định'}
                                                    </p>
                                                </div>

                                                <div className="bg-purple-50 rounded-lg p-4">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a4 4 0 118 0v4m-4 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                                                        </svg>
                                                        <span className="text-sm font-medium text-gray-600">Ngày ứng tuyển</span>
                                                    </div>
                                                    <p className="text-lg font-semibold text-purple-700">
                                                        {formatDate(application.appliedDate || new Date())}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Cover Letter */}
                                            {application.coverLetter && (
                                                <div className="mb-6">
                                                    <h4 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                                        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                        </svg>
                                                        Thư xin việc
                                                    </h4>
                                                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                                        <p className="text-gray-800 leading-relaxed">
                                                            {application.coverLetter}
                                                        </p>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Notes from Employer */}
                                            {application.notes && (
                                                <div className="mb-6">
                                                    <h4 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                                        <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                        </svg>
                                                        Ghi chú từ nhà tuyển dụng
                                                    </h4>
                                                    <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                                                        <p className="text-gray-800 leading-relaxed">
                                                            {application.notes}
                                                        </p>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Review Date */}
                                            {application.reviewedDate && (
                                                <div className="pt-4 border-t border-gray-100">
                                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                        <span>Đánh giá lúc: {formatDate(application.reviewedDate)}</span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
