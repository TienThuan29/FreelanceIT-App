'use client'

import React from 'react'
import { FiUpload, FiFileText } from 'react-icons/fi'

interface FilesTabProps {
    onUpload?: () => void
}

export default function FilesTab({ onUpload }: FilesTabProps) {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Tài liệu dự án</h2>
                <button 
                    onClick={onUpload}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                    <FiUpload className="w-4 h-4" />
                    Tải lên
                </button>
            </div>

            <div className="text-center py-12 bg-white rounded-xl shadow-sm">
                <FiFileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có tài liệu nào</h3>
                <p className="text-gray-500">Tải lên tài liệu để chia sẻ với nhóm dự án.</p>
            </div>
        </div>
    )
}
