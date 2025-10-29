'use client'

import React, { useRef, useEffect } from 'react'
import { FiMessageCircle, FiSend } from 'react-icons/fi'
import { formatDate } from '@/lib/date'

interface ChatTabProps {
    isConnected: boolean
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    messages: any[]
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    teamMembers: any[]
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    projectConversation: any
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    isCreatingChat: boolean
    messageInput: string
    setMessageInput: (value: string) => void
    onSendMessage: () => void
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    user: any
}

export default function ChatTab({
    isConnected,
    messages,
    teamMembers,
    projectConversation,
    isCreatingChat,
    messageInput,
    setMessageInput,
    onSendMessage,
    user
}: ChatTabProps) {
    const messagesEndRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Trò chuyện nhóm</h2>
                <div className="flex items-center gap-2">
                    <div className={`flex items-center gap-1 ${isConnected ? 'text-green-600' : 'text-red-600'}`}>
                        <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        <span className="text-xs">
                            {isConnected ? 'Đã kết nối' : 'Đang kết nối...'}
                        </span>
                    </div>
                    <span className="text-sm text-gray-500">•</span>
                    <span className="text-sm text-gray-500">
                        {messages?.length || 0} tin nhắn
                    </span>
                    <span className="text-sm text-gray-500">•</span>
                    <span className="text-sm text-gray-500">
                        {teamMembers.length} thành viên
                    </span>
                </div>
            </div>

            {projectConversation ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 h-96 flex flex-col">
                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                        {messages?.map((message: any, index: number) => {
                            const isOwnMessage = message.senderId === user?.id;
                            const showAvatar = !isOwnMessage;
                            
                            return (
                                <div
                                    key={index}
                                    className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} items-end gap-2`}
                                >
                                    {/* Avatar for other users */}
                                    {showAvatar && (
                                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                                            {message.sender?.avatar ? (
                                                <img
                                                    src={message.sender.avatar}
                                                    alt={message.sender.name}
                                                    className="w-8 h-8 rounded-full object-cover"
                                                />
                                            ) : (
                                                <span className="text-blue-600 font-semibold text-sm">
                                                    {message.sender?.name?.charAt(0) || message.senderId?.charAt(0) || 'U'}
                                                </span>
                                            )}
                                        </div>
                                    )}
                                    
                                    {/* Message bubble */}
                                    <div className={`flex flex-col ${isOwnMessage ? 'items-end' : 'items-start'} max-w-xs lg:max-w-md`}>
                                        {/* Sender name for other users */}
                                        {!isOwnMessage && message.sender?.name && (
                                            <span className="text-xs text-gray-500 mb-1 px-1">
                                                {message.sender.name}
                                            </span>
                                        )}
                                        
                                        {/* Message content */}
                                        <div
                                            className={`px-4 py-2 rounded-lg ${
                                                isOwnMessage
                                                    ? 'bg-blue-600 text-white rounded-br-sm'
                                                    : 'bg-gray-100 text-gray-900 rounded-bl-sm'
                                            }`}
                                        >
                                            <p className="text-sm">{message.content}</p>
                                        </div>
                                        
                                        {/* Timestamp */}
                                        <p className={`text-xs mt-1 px-1 ${
                                            isOwnMessage ? 'text-gray-400' : 'text-gray-500'
                                        }`}>
                                            {formatDate(message.createdAt)}
                                        </p>
                                    </div>
                                    
                                    {/* Avatar for own messages (right side) */}
                                    {isOwnMessage && (
                                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                                            {user?.avatar ? (
                                                <img
                                                    src={user.avatar}
                                                    alt={user.fullname || user.email}
                                                    className="w-8 h-8 rounded-full object-cover"
                                                />
                                            ) : (
                                                <span className="text-green-600 font-semibold text-sm">
                                                    {(user?.fullname || user?.email)?.charAt(0) || 'U'}
                                                </span>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Message Input */}
                    <div className="border-t border-gray-200 p-4">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={messageInput}
                                onChange={(e) => setMessageInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && onSendMessage()}
                                placeholder="Nhập tin nhắn..."
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button
                                onClick={onSendMessage}
                                disabled={!messageInput.trim() || !isConnected}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                title={!isConnected ? 'Đang kết nối đến chat server...' : 'Gửi tin nhắn'}
                            >
                                <FiSend className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            ) : isCreatingChat ? (
                <div className="text-center py-12 bg-white rounded-xl shadow-sm">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Đang tạo phòng chat...</h3>
                    <p className="text-gray-500">Hệ thống đang thiết lập phòng trò chuyện cho nhóm dự án.</p>
                </div>
            ) : (
                <div className="text-center py-12 bg-white rounded-xl shadow-sm">
                    <FiMessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Đang tải phòng chat...</h3>
                    <p className="text-gray-500">Hệ thống đang thiết lập phòng trò chuyện cho nhóm dự án.</p>
                </div>
            )}
        </div>
    )
}
