'use client'

import React, { useEffect, useState } from 'react'
import { FiCalendar, FiPlus, FiEdit2, FiTrash2, FiClock } from 'react-icons/fi'
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
        deleteTimeline,
        clearError
    } = useProjectTimeline()

    const [showCreateForm, setShowCreateForm] = useState(false)
    const [editingTimeline, setEditingTimeline] = useState<ProjectTimeline | null>(null)
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

    const handleCreateTimeline = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!formData.title || !formData.meetingDate) return

        const success = await createTimeline({
            projectId,
            title: formData.title,
            description: formData.description,
            meetingDate: new Date(formData.meetingDate)
        })

        if (success) {
            setFormData({ title: '', description: '', meetingDate: '' })
            setShowCreateForm(false)
        }
    }

    const handleUpdateTimeline = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!editingTimeline || !formData.title || !formData.meetingDate) return

        const success = await updateTimeline(editingTimeline.id, {
            title: formData.title,
            description: formData.description,
            meetingDate: new Date(formData.meetingDate)
        })

        if (success) {
            setFormData({ title: '', description: '', meetingDate: '' })
            setEditingTimeline(null)
        }
    }

    const handleDeleteTimeline = async (timelineId: string) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa timeline này?')) {
            await deleteTimeline(timelineId)
        }
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
        setShowCreateForm(false)
        setEditingTimeline(null)
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
                                onChange={(e) => setFormData(prev => ({ ...prev, meetingDate: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                            />
                        </div>
                        <div className="flex gap-3">
                            <button
                                type="submit"
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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
        </div>
    )
}
