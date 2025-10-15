'use client'

import React from 'react'
import { FiCalendar } from 'react-icons/fi'

export default function TimelineTab() {
    return (
        <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Timeline dự án</h2>

            <div className="text-center py-12 bg-white rounded-xl shadow-sm">
                <FiCalendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Timeline chưa được thiết lập</h3>
                <p className="text-gray-500">Timeline dự án sẽ hiển thị các mốc thời gian quan trọng.</p>
            </div>
        </div>
    )
}
