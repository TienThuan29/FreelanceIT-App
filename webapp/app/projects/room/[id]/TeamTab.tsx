'use client'

import React from 'react'
import { FiUsers, FiPlus } from 'react-icons/fi'
import { formatCurrency } from '@/lib/curency'
import { ProjectTeamMember } from '@/hooks/useProjectManagement'

interface TeamTabProps {
    teamMembers: ProjectTeamMember[]
    isLoadingTeamMembers: boolean
    isProjectOwner: boolean
    onShowAddMemberModal: () => void
    onRemoveMember: (developerId: string) => void
}

export default function TeamTab({
    teamMembers,
    isLoadingTeamMembers,
    isProjectOwner,
    onShowAddMemberModal,
    onRemoveMember
}: TeamTabProps) {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Đội ngũ dự án</h2>
                {isProjectOwner && (
                    <button
                        onClick={onShowAddMemberModal}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                    >
                        <FiPlus className="w-4 h-4" />
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
                    <FiUsers className="w-16 h-16 text-gray-400 mx-auto mb-4" />
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
                                            onClick={() => onRemoveMember(member.developerId)}
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
    )
}
