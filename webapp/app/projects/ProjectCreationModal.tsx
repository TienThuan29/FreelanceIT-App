import React, { useState, useEffect } from 'react'
import type { Project, ProjectType } from '@/types/project.type'
import { ProjectStatus } from '@/types/shared.type'
import { useProjectManagement } from '@/hooks/useProjectManagement'

// Project Modal Component
interface ProjectModalProps {
    project?: Project | null
    onClose: () => void
    onSave: (project: any) => void // Updated to match ProjectCreateRequest
}

const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose, onSave }) => {
    const { projectTypes, getProjectTypes } = useProjectManagement()

    // Helper function to safely convert date to YYYY-MM-DD format
    const formatDateForInput = (date: Date | string | undefined): string => {
        if (!date) return ''
        try {
            const dateObj = date instanceof Date ? date : new Date(date)
            return dateObj.toISOString().split('T')[0]
        } catch (error) {
            console.error('Error formatting date:', error)
            return ''
        }
    }

    const [formData, setFormData] = useState<{
        title: string
        description: string
        category: string
        requiredSkills: string
        projectType: string
        budget: number
        minBudget: number
        maxBudget: number
        estimateDuration: number
        startDate: string
        endDate: string
        status: Project['status']
        isRemote: boolean
        location: string
        attachments: string[]
    }>({
        title: project?.title || 'Phát triển ứng dụng web FreelanceIT',
        description: project?.description || 'Cần phát triển một ứng dụng web hoàn chỉnh cho nền tảng freelancing với các tính năng:\n- Đăng ký và quản lý tài khoản người dùng\n- Tạo và quản lý dự án\n- Hệ thống chat real-time\n- Thanh toán và quản lý hợp đồng\n- Dashboard cho cả khách hàng và freelancer\n\nYêu cầu kỹ thuật:\n- Frontend: React.js với TypeScript\n- Backend: Node.js với Express\n- Database: MongoDB\n- Authentication: JWT\n- Real-time: Socket.io',
        category: project?.category || 'Web Development',
        requiredSkills: project?.requiredSkills?.join(', ') || 'React.js, Node.js, MongoDB, TypeScript, Express.js, Socket.io, JWT',
        projectType: project?.projectType?.id || '',
        budget: project?.budget || 50000000,
        minBudget: project?.minBudget || 30000000,
        maxBudget: project?.maxBudget || 80000000,
        estimateDuration: project?.estimateDuration || 90,
        startDate: formatDateForInput(project?.startDate) || '2024-02-01',
        endDate: formatDateForInput(project?.endDate) || '2024-05-01',
        status: project?.status || ProjectStatus.OPEN_APPLYING,
        isRemote: project?.isRemote || true,
        location: project?.location || 'Hà Nội, Việt Nam',
        attachments: project?.attachments || []
    })
    const [isLoading, setIsLoading] = useState(false)
    const [projectImage, setProjectImage] = useState<File | null>(null)

    useEffect(() => {
        getProjectTypes()
    }, [getProjectTypes])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        try {
            const projectData = {
                ...formData,
                startDate: formData.startDate ? new Date(formData.startDate) : undefined,
                endDate: formData.endDate ? new Date(formData.endDate) : undefined,
                requiredSkills: formData.requiredSkills.split(',').map(s => s.trim()).filter(s => s),
                projectImage: projectImage || undefined
            }
            await onSave(projectData)
        } finally {
            setIsLoading(false)
        }
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setProjectImage(file)
        }
    }

    return (
        <div className="fixed inset-0 bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">
                        {project ? 'Chỉnh sửa dự án' : 'Tạo dự án mới'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Tiêu đề dự án *
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.title}
                            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Mô tả chi tiết
                        </label>
                        <textarea
                            rows={4}
                            value={formData.description}
                            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Danh mục
                            </label>
                            <input
                                type="text"
                                value={formData.category}
                                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Loại dự án *
                            </label>
                            <select
                                required
                                value={formData.projectType}
                                onChange={(e) => setFormData(prev => ({ ...prev, projectType: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Chọn loại dự án</option>
                                {projectTypes.map((type) => (
                                    <option key={type.id} value={type.id}>
                                        {type.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Ngân sách (VND)
                            </label>
                            <input
                                type="number"
                                value={formData.budget}
                                onChange={(e) => setFormData(prev => ({ ...prev, budget: parseInt(e.target.value) || 0 }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Ngân sách tối thiểu (VND)
                            </label>
                            <input
                                type="number"
                                value={formData.minBudget}
                                onChange={(e) => setFormData(prev => ({ ...prev, minBudget: parseInt(e.target.value) || 0 }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Ngân sách tối đa (VND)
                            </label>
                            <input
                                type="number"
                                value={formData.maxBudget}
                                onChange={(e) => setFormData(prev => ({ ...prev, maxBudget: parseInt(e.target.value) || 0 }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Thời gian ước tính (ngày)
                            </label>
                            <input
                                type="number"
                                value={formData.estimateDuration}
                                onChange={(e) => setFormData(prev => ({ ...prev, estimateDuration: parseInt(e.target.value) || 0 }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Ngày bắt đầu
                            </label>
                            <input
                                type="date"
                                value={formData.startDate}
                                onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Ngày kết thúc
                            </label>
                            <input
                                type="date"
                                value={formData.endDate}
                                onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Kỹ năng yêu cầu
                        </label>
                        <input
                            type="text"
                            placeholder="React, Node.js, MongoDB (phân cách bằng dấu phẩy)"
                            value={formData.requiredSkills}
                            onChange={(e) => setFormData(prev => ({ ...prev, requiredSkills: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Hình ảnh dự án
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {projectImage && (
                                <p className="text-sm text-gray-600 mt-1">
                                    Đã chọn: {projectImage.name}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Vị trí
                            </label>
                            <input
                                type="text"
                                value={formData.location}
                                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Ví dụ: Hà Nội, TP.HCM"
                            />
                        </div>
                    </div>

                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="isRemote"
                            checked={formData.isRemote}
                            onChange={(e) => setFormData(prev => ({ ...prev, isRemote: e.target.checked }))}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="isRemote" className="ml-2 block text-sm text-gray-700">
                            Làm việc từ xa
                        </label>
                    </div>


                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Trạng thái
                        </label>
                        <select
                            value={formData.status}
                            onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as Project['status'] }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value={ProjectStatus.DRAFT}>Bản nháp</option>
                            <option value={ProjectStatus.OPEN_APPLYING}>Đang tuyển</option>
                            <option value={ProjectStatus.IN_PROGRESS}>Đang thực hiện</option>
                            <option value={ProjectStatus.COMPLETED}>Hoàn thành</option>
                            <option value={ProjectStatus.CANCELLED}>Đã hủy</option>
                        </select>
                    </div>


                    <div className="flex justify-end space-x-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isLoading}
                            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                        >
                            {isLoading && (
                                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            )}
                            <span>{project ? (isLoading ? 'Đang cập nhật...' : 'Cập nhật') : (isLoading ? 'Đang tạo...' : 'Tạo dự án')}</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default ProjectModal