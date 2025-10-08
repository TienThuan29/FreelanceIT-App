import { formatDate } from "@/lib/date"
import { ProjectType } from "@/types"
import { useState } from "react"
import ProjectTypeModal from "./ProjectTypeCreationModal"

interface ProjectTypeTabProps {
    showProjectTypeModal: boolean;
    setShowProjectTypeModal: (show: boolean) => void;
    projectTypes: ProjectType[];
    loading: boolean;
    error: string | null;
    deleteProjectType: (id: string) => Promise<boolean>;
    clearError: () => void;
    refreshProjectTypes: () => Promise<void>;
    setEditingProjectType: (projectType: ProjectType | null) => void;
}

export default function ProjectTypeTab({
    showProjectTypeModal,
    setShowProjectTypeModal,
    projectTypes,
    loading,
    error,
    deleteProjectType,
    clearError,
    refreshProjectTypes,
    setEditingProjectType
}: ProjectTypeTabProps) {
    const [deletingId, setDeletingId] = useState<string | null>(null)

    const handleDeleteProjectType = async (projectTypeId: string) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa loại dự án này?')) {
            setDeletingId(projectTypeId)
            try {
                await deleteProjectType(projectTypeId)
            } finally {
                setDeletingId(null)
            }
        }
    }

    // Show loading state
    if (loading) {
        return (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Đang tải loại dự án...</p>
            </div>
        )
    }

    // Show error state
    if (error) {
        return (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <div className="text-red-500 text-6xl mb-4"></div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Có lỗi xảy ra</h3>
                <p className="text-gray-500 mb-4">{error}</p>
                <div className="space-x-3">
                    <button
                        onClick={clearError}
                        className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        Thử lại
                    </button>
                    <button
                        onClick={refreshProjectTypes}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Làm mới
                    </button>
                </div>
            </div>
        )
    }

    return (
        /* Project Types Management */
        <div className="bg-white rounded-lg shadow-sm">
            {projectTypes?.filter(pt => !pt.isDeleted).length === 0 ? (
                <div className="text-center py-12">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Chưa có loại dự án nào
                    </h3>
                    <p className="text-gray-500 mb-4">
                        Tạo loại dự án đầu tiên để phân loại các dự án của bạn
                    </p>
                    <button
                        onClick={() => setShowProjectTypeModal(true)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Thêm loại dự án
                    </button>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Tên loại dự án
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Ngày tạo
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Ngày cập nhật
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Thao tác
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {projectTypes?.filter(pt => !pt.isDeleted).map(projectType => (
                                <tr key={projectType.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">
                                            {projectType.name}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {projectType.createdDate ? formatDate(projectType.createdDate) : '-'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {projectType.updatedDate ? formatDate(projectType.updatedDate) : '-'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex justify-end space-x-2">
                                            <button
                                                onClick={() => setEditingProjectType(projectType)}
                                                className="text-blue-600 hover:text-blue-900 p-1 rounded"
                                                title="Chỉnh sửa"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                </svg>
                                            </button>
                                            <button
                                                onClick={() => handleDeleteProjectType(projectType.id)}
                                                disabled={deletingId === projectType.id}
                                                className="text-red-600 hover:text-red-900 p-1 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                                                title="Xóa"
                                            >
                                                {deletingId === projectType.id ? (
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
    )
}