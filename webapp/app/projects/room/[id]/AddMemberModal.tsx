'use client'

import React from 'react'

interface AddMemberModalProps {
    isOpen: boolean
    newMemberData: {
        userId: string
        agreedRate: number
        contractUrl: string
    }
    isAddingMember: boolean
    onClose: () => void
    onAddMember: () => void
    onUpdateMemberData: (data: Partial<AddMemberModalProps['newMemberData']>) => void
}

export default function AddMemberModal({
    isOpen,
    newMemberData,
    isAddingMember,
    onClose,
    onAddMember,
    onUpdateMemberData
}: AddMemberModalProps) {
    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-lg border border-gray-200 shadow-xl p-6 w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">Thêm thành viên mới</h2>
                
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            ID Người dùng *
                        </label>
                        <input
                            type="text"
                            value={newMemberData.userId}
                            onChange={(e) => onUpdateMemberData({ userId: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Nhập ID người dùng"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Mức lương thỏa thuận (VND)
                        </label>
                        <input
                            type="number"
                            value={newMemberData.agreedRate}
                            onChange={(e) => onUpdateMemberData({ agreedRate: parseInt(e.target.value) || 0 })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Nhập mức lương"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            URL Hợp đồng
                        </label>
                        <input
                            type="url"
                            value={newMemberData.contractUrl}
                            onChange={(e) => onUpdateMemberData({ contractUrl: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="https://example.com/contract.pdf"
                        />
                    </div>
                </div>
                
                <div className="flex justify-end space-x-3 mt-6">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                        Hủy
                    </button>
                    <button
                        onClick={onAddMember}
                        disabled={isAddingMember}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                    >
                        {isAddingMember ? 'Đang thêm...' : 'Thêm thành viên'}
                    </button>
                </div>
            </div>
        </div>
    )
}
