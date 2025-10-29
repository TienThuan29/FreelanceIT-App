'use client'

import React from 'react'
import { FiUsers, FiDollarSign, FiClock, FiLock } from 'react-icons/fi'
import { formatCurrency } from '@/lib/curency'
import { formatDate } from '@/lib/date'
import { ProjectTeamMember } from '@/hooks/useProjectManagement'

interface OverviewTabProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    project: any
    teamMembers: ProjectTeamMember[]
}

export default function OverviewTab({ project, teamMembers }: OverviewTabProps) {
    return (
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
                            <FiUsers className="w-6 h-6 text-blue-600" />
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
                            <FiDollarSign className="w-6 h-6 text-green-600" />
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
                            <FiClock className="w-6 h-6 text-purple-600" />
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
                            <FiLock className="w-6 h-6 text-yellow-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Ngày tạo</p>
                            <p className="text-2xl font-bold text-gray-900">{formatDate(project.createdDate)}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
