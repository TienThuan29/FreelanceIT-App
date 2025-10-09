import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Project } from '@/types/project.type'
import { ProjectStatus } from '@/types/shared.type'
import { formatCurrency } from '@/lib/curency'
import { formatDate } from '@/lib/date'

interface ProjectTabProps {
    projects: Project[]
    filteredAndSortedProjects: Project[]
    setShowCreateModal: (show: boolean) => void
    handleBackToProfile: () => void
    setEditingProject: (project: Project) => void
    handleDeleteProject: (projectId: string) => void
}

export default function ProjectTab({
    projects,
    filteredAndSortedProjects,
    setShowCreateModal,
    handleBackToProfile,
    setEditingProject,
    handleDeleteProject
}: ProjectTabProps) {
    const router = useRouter()
    const [deletingId, setDeletingId] = useState<string | null>(null)

    const handleDelete = async (projectId: string) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa dự án này?')) {
            setDeletingId(projectId)
            try {
                await handleDeleteProject(projectId)
            } finally {
                setDeletingId(null)
            }
        }
    }

    const handleViewDetail = (projectId: string) => {
        router.push(`/projects/${projectId}`)
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

    return (
        <>
            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-sm text-gray-600">
                                {projects.filter(p => p.status === ProjectStatus.OPEN_APPLYING).length} dự án đang tuyển
                            </span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <span className="text-sm text-gray-600">
                                {projects.filter(p => p.status === ProjectStatus.IN_PROGRESS).length} dự án đang thực hiện
                            </span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                            <span className="text-sm text-gray-600">
                                {projects.filter(p => p.status === ProjectStatus.COMPLETED).length} dự án hoàn thành
                            </span>
                        </div>
                    </div>
                    {/* <div className="text-sm text-gray-500">
                        Tổng giá trị: {formatCurrency(projects.reduce((sum, p) => sum + (p.budget || 0), 0))}
                    </div> */}
                </div>
            </div>

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
                                            <div className="flex items-start space-x-3 max-w-sm">
                                                {/* Project Image */}
                                                <div className="flex-shrink-0">
                                                    {project.imageUrl ? (
                                                        <img
                                                            src={project.imageUrl}
                                                            alt={project.title}
                                                            className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                                                            onError={(e) => {
                                                                const target = e.target as HTMLImageElement;
                                                                target.style.display = 'none';
                                                                target.nextElementSibling?.classList.remove('hidden');
                                                            }}
                                                        />
                                                    ) : null}
                                                    <div className={`w-16 h-16 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center ${project.imageUrl ? 'hidden' : ''}`}>
                                                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                        </svg>
                                                    </div>
                                                </div>
                                                
                                                {/* Project Info */}
                                                <div className="flex-1 min-w-0">
                                                    <div className="text-sm font-medium text-gray-900 truncate">
                                                        {project.title}
                                                    </div>
                                                    <div className="text-sm text-gray-500 line-clamp-2">
                                                        {project.description}
                                                    </div>
                                                    <div className="flex flex-wrap gap-1 mt-2">
                                                        {project.requiredSkills?.slice(0, 3).map(skill => (
                                                            <span key={skill} className="inline-block px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded">
                                                                {skill}
                                                            </span>
                                                        ))}
                                                        {(project.requiredSkills?.length || 0) > 3 && (
                                                            <span className="text-xs text-gray-500">+{(project.requiredSkills?.length || 0) - 3}</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">
                                                {formatCurrency(project.budget || 0)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(project.status)}`}>
                                                {getStatusText(project.status)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {formatDate(project.endDate || new Date())}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            <span className="text-gray-400">Chưa có</span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex justify-end space-x-2">
                                                <button
                                                    onClick={() => handleViewDetail(project.id)}
                                                    className="text-green-600 hover:text-green-900 p-1 rounded cursor-pointer"
                                                    title="Xem chi tiết"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                    </svg>
                                                </button>
                                                <button
                                                    onClick={() => setEditingProject(project)}
                                                    className="text-blue-600 hover:text-blue-900 p-1 rounded cursor-pointer"
                                                    title="Chỉnh sửa"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(project.id)}
                                                    disabled={deletingId === project.id}
                                                    className="text-red-600 hover:text-red-900 p-1 rounded disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                                                    title="Xóa"
                                                >
                                                    {deletingId === project.id ? (
                                                        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                        </svg>
                                                    ) : (
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    )}
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
        </>
    )
}