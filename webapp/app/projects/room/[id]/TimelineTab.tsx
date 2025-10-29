'use client'

import React, { useEffect, useState } from 'react'
import { FiCalendar, FiPlus, FiEdit2, FiTrash2, FiClock, FiX, FiAlertTriangle, FiVideo, FiExternalLink } from 'react-icons/fi'
import { useProjectTimeline } from '@/hooks/useProjectTimeline'
import { ProjectTimeline } from '@/types/project.type'
import { format } from 'date-fns'
import { vi } from 'date-fns/locale'

interface TimelineTabProps {
    projectId: string
}

export default function TimelineTab({ projectId }: TimelineTabProps) {
    const {
        timelines,
        isLoading,
        error,
        createTimeline,
        getTimelinesByProjectId,
        updateTimeline,
        updateMeetingUrl,
        deleteTimeline,
        clearError
    } = useProjectTimeline()

    const [showCreateForm, setShowCreateForm] = useState(false)
    const [editingTimeline, setEditingTimeline] = useState<ProjectTimeline | null>(null)
    const [dateError, setDateError] = useState<string>('')
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [timelineToDelete, setTimelineToDelete] = useState<string | null>(null)
    const [showMeetLinkModal, setShowMeetLinkModal] = useState(false)
    const [selectedTimeline, setSelectedTimeline] = useState<ProjectTimeline | null>(null)
    const [meetingUrl, setMeetingUrl] = useState<string>('')
    const [urlError, setUrlError] = useState<string>('')
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        meetingDate: ''
    })

    // Load timelines when component mounts or projectId changes
    useEffect(() => {
        if (projectId) {
            getTimelinesByProjectId(projectId)
        }
    }, [projectId, getTimelinesByProjectId])

    // Clear error when component unmounts
    useEffect(() => {
        return () => clearError()
    }, [clearError])

    // Validate meeting date
    const validateMeetingDate = (dateString: string): boolean => {
        if (!dateString) return true // Let required validation handle empty case
        
        const selectedDate = new Date(dateString)
        const now = new Date()
        
        // Set hours/minutes to compare dates properly
        now.setSeconds(0, 0)
        
        if (selectedDate < now) {
            setDateError('Ngày giờ họp không thể là thời điểm trong quá khứ')
            return false
        }
        
        setDateError('')
        return true
    }

    // Handle meeting date change
    const handleMeetingDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setFormData(prev => ({ ...prev, meetingDate: value }))
        validateMeetingDate(value)
    }

    const handleCreateTimeline = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!formData.title || !formData.meetingDate) return
        
        // Validate date before submission
        if (!validateMeetingDate(formData.meetingDate)) {
            return
        }

        const success = await createTimeline({
            projectId,
            title: formData.title,
            description: formData.description,
            meetingDate: new Date(formData.meetingDate)
        })

        if (success) {
            setFormData({ title: '', description: '', meetingDate: '' })
            setDateError('')
            setShowCreateForm(false)
        }
    }

    const handleUpdateTimeline = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!editingTimeline || !formData.title || !formData.meetingDate) return
        
        // Validate date before submission
        if (!validateMeetingDate(formData.meetingDate)) {
            return
        }

        const success = await updateTimeline(editingTimeline.id, {
            title: formData.title,
            description: formData.description,
            meetingDate: new Date(formData.meetingDate)
        })

        if (success) {
            setFormData({ title: '', description: '', meetingDate: '' })
            setDateError('')
            setEditingTimeline(null)
        }
    }

    const handleDeleteTimeline = (timelineId: string) => {
        setTimelineToDelete(timelineId)
        setShowDeleteModal(true)
    }

    const confirmDelete = async () => {
        if (timelineToDelete) {
            await deleteTimeline(timelineToDelete)
            setShowDeleteModal(false)
            setTimelineToDelete(null)
        }
    }

    const cancelDelete = () => {
        setShowDeleteModal(false)
        setTimelineToDelete(null)
    }

    const handleOpenMeetLinkModal = (timeline: ProjectTimeline) => {
        setSelectedTimeline(timeline)
        setMeetingUrl(timeline.meetingUrl || '')
        setUrlError('')
        setShowMeetLinkModal(true)
    }

    const handleMeetingUrlChange = (value: string) => {
        setMeetingUrl(value)
        if (value.trim() === '') {
            setUrlError('')
            return
        }
        
        // Validate URL
        try {
            new URL(value.trim())
            setUrlError('')
        } catch {
            setUrlError('URL không hợp lệ')
        }
    }

    const handleSaveMeetingUrl = async () => {
        if (!selectedTimeline) return
        
        // Validate URL if not empty
        if (meetingUrl.trim() !== '') {
            try {
                new URL(meetingUrl.trim())
            } catch {
                setUrlError('URL không hợp lệ')
                return
            }
        }
        
        const success = await updateMeetingUrl(selectedTimeline.id, meetingUrl.trim())
        if (success) {
            setShowMeetLinkModal(false)
            setSelectedTimeline(null)
            setMeetingUrl('')
            setUrlError('')
        }
    }

    const handleCloseMeetLinkModal = () => {
        setShowMeetLinkModal(false)
        setSelectedTimeline(null)
        setMeetingUrl('')
        setUrlError('')
    }

    const startEdit = (timeline: ProjectTimeline) => {
        setEditingTimeline(timeline)
        setFormData({
            title: timeline.title,
            description: timeline.description || '',
            meetingDate: format(new Date(timeline.meetingDate), "yyyy-MM-dd'T'HH:mm")
        })
        setShowCreateForm(true)
    }

    const cancelForm = () => {
        setFormData({ title: '', description: '', meetingDate: '' })
        setDateError('')
        setShowCreateForm(false)
        setEditingTimeline(null)
    }
    
    // Get minimum datetime (current date and time)
    const getMinDateTime = () => {
        const now = new Date()
        const year = now.getFullYear()
        const month = String(now.getMonth() + 1).padStart(2, '0')
        const day = String(now.getDate()).padStart(2, '0')
        const hours = String(now.getHours()).padStart(2, '0')
        const minutes = String(now.getMinutes()).padStart(2, '0')
        return `${year}-${month}-${day}T${hours}:${minutes}`
    }

    const formatMeetingDate = (date: Date | string) => {
        return format(new Date(date), 'dd/MM/yyyy HH:mm', { locale: vi })
    }

    if (isLoading) {
        return (
            <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900">Timeline dự án</h2>
                <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">Timeline dự án</h2>
                <button
                    onClick={() => setShowCreateForm(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <FiPlus className="w-4 h-4" />
                    Thêm Timeline
                </button>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    {error}
                </div>
            )}

            {/* Create/Edit Form */}
            {showCreateForm && (
                <div className="bg-white rounded-xl shadow-sm border p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                        {editingTimeline ? 'Chỉnh sửa Timeline' : 'Tạo Timeline mới'}
                    </h3>
                    <form onSubmit={editingTimeline ? handleUpdateTimeline : handleCreateTimeline} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Tiêu đề *
                            </label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Nhập tiêu đề timeline"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Mô tả
                            </label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Nhập mô tả timeline"
                                rows={3}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Ngày giờ họp *
                            </label>
                            <input
                                type="datetime-local"
                                value={formData.meetingDate}
                                onChange={handleMeetingDateChange}
                                min={getMinDateTime()}
                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                    dateError ? 'border-red-500' : 'border-gray-300'
                                }`}
                                required
                            />
                            {dateError && (
                                <p className="mt-1 text-sm text-red-600">{dateError}</p>
                            )}
                        </div>
                        <div className="flex gap-3">
                            <button
                                type="submit"
                                disabled={!!dateError}
                                className={`px-4 py-2 rounded-lg transition-colors ${
                                    dateError 
                                        ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
                                        : 'bg-blue-600 text-white hover:bg-blue-700'
                                }`}
                            >
                                {editingTimeline ? 'Cập nhật' : 'Tạo Timeline'}
                            </button>
                            <button
                                type="button"
                                onClick={cancelForm}
                                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                            >
                                Hủy
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Timeline List */}
            {timelines.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-xl shadow-sm">
                    <FiCalendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Timeline chưa được thiết lập</h3>
                    <p className="text-gray-500">Timeline dự án sẽ hiển thị các mốc thời gian quan trọng.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {timelines.map((timeline) => (
                        <div key={timeline.id} className="bg-white rounded-xl shadow-sm border p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex-1">
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                                        {timeline.title}
                                    </h3>
                                    {timeline.description && (
                                        <p className="text-gray-600 mb-3">{timeline.description}</p>
                                    )}
                                    <div className="flex items-center gap-4 text-sm text-gray-500">
                                        <div className="flex items-center gap-1">
                                            <FiClock className="w-4 h-4" />
                                            {formatMeetingDate(timeline.meetingDate)}
                                        </div>
                                    </div>
                                    
                                    {/* Google Meet Link Display/Button */}
                                    {timeline.meetingUrl ? (
                                        <div className="mt-3 flex items-center gap-2">
                                            <a
                                                href={timeline.meetingUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-2 px-3 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors text-sm"
                                            >
                                                <FiVideo className="w-4 h-4" />
                                                Tham gia họp
                                                <FiExternalLink className="w-3 h-3" />
                                            </a>
                                            <button
                                                onClick={() => handleOpenMeetLinkModal(timeline)}
                                                className="text-sm text-blue-600 hover:text-blue-800"
                                            >
                                                Chỉnh sửa
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => handleOpenMeetLinkModal(timeline)}
                                            className="mt-3 inline-flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm"
                                        >
                                            <FiVideo className="w-4 h-4" />
                                            Thêm link họp
                                        </button>
                                    )}
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => startEdit(timeline)}
                                        className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                                        title="Chỉnh sửa"
                                    >
                                        <FiEdit2 className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteTimeline(timeline.id)}
                                        className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                                        title="Xóa"
                                    >
                                        <FiTrash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 animate-in fade-in zoom-in duration-200">
                        <div className="p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                                    <FiAlertTriangle className="w-6 h-6 text-red-600" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        Xác nhận xóa
                                    </h3>
                                    <p className="text-sm text-gray-500 mt-1">
                                        Bạn có chắc chắn muốn xóa timeline này?
                                    </p>
                                </div>
                                <button
                                    onClick={cancelDelete}
                                    className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    <FiX className="w-5 h-5" />
                                </button>
                            </div>
                            
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                                <p className="text-sm text-yellow-800">
                                    Timeline sẽ bị xóa vĩnh viễn.
                                </p>
                            </div>

                            <div className="flex gap-3 justify-end">
                                <button
                                    onClick={cancelDelete}
                                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Hủy
                                </button>
                                <button
                                    onClick={confirmDelete}
                                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                                >
                                    Xóa timeline
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Google Meet Link Modal */}
            {showMeetLinkModal && selectedTimeline && (
                <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl max-w-lg w-full mx-4 animate-in fade-in zoom-in duration-200">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                                        <FiVideo className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900">
                                            Link họp trực tuyến
                                        </h3>
                                        <p className="text-sm text-gray-500">
                                            {selectedTimeline.title}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={handleCloseMeetLinkModal}
                                    className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    <FiX className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        URL cuộc họp (Google Meet, Zoom, etc.)
                                    </label>
                                    <input
                                        type="url"
                                        value={meetingUrl}
                                        onChange={(e) => handleMeetingUrlChange(e.target.value)}
                                        placeholder="https://meet.google.com/xxx-xxxx-xxx"
                                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                            urlError ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    />
                                    {urlError && (
                                        <p className="mt-1 text-sm text-red-600">{urlError}</p>
                                    )}
                                </div>

                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                                    <p className="text-sm text-blue-800">
                                        <strong>Gợi ý:</strong> Bạn có thể dán link từ Google Meet, Zoom, Microsoft Teams, hoặc bất kỳ nền tảng họp trực tuyến nào.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-3 justify-end mt-6">
                                <button
                                    onClick={handleCloseMeetLinkModal}
                                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Hủy
                                </button>
                                <button
                                    onClick={handleSaveMeetingUrl}
                                    disabled={!!urlError}
                                    className={`px-4 py-2 rounded-lg transition-colors ${
                                        urlError
                                            ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                                            : 'bg-blue-600 text-white hover:bg-blue-700'
                                    }`}
                                >
                                    Lưu link
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
