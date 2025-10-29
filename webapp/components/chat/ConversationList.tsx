'use client';
import React, { useMemo, useCallback } from 'react';
import { ChatBubbleLeftIcon } from '@heroicons/react/24/outline';
import { Conversation, TypingUser } from '@/contexts/ChatContext';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

interface ConversationListProps {
  conversations: Conversation[];
  currentConversation: Conversation | null;
  onlineUsers: string[];
  typingUsers: TypingUser[];
  isLoading: boolean;
  currentUserId: string;
  onSelectConversation: (conversation: Conversation) => void;
  onCreateConversation: () => void;
  lastMessages: { [conversationId: string]: string };
  participantNames: { [userId: string]: string }; // Add participant names
}

const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  currentConversation,
  onlineUsers,
  typingUsers,
  isLoading,
  currentUserId,
  onSelectConversation,
  lastMessages,
  participantNames
}) => {
  // Memoize filtered conversations to prevent unnecessary re-filtering
  const filteredConversations = useMemo(() => {
    return conversations.filter(conversation => {
      const isParticipant = currentUserId && conversation.participants.includes(currentUserId);
      return isParticipant;
    });
  }, [conversations, currentUserId]);

  // Memoize conversation groups
  const conversationGroups = useMemo(() => ({
    conversationsWithMessages: filteredConversations.filter(conv => !!conv.lastMessageDate),
    conversationsWithoutMessages: filteredConversations.filter(conv => !conv.lastMessageDate)
  }), [filteredConversations]);

  // Memoize online status to prevent unnecessary re-renders
  const isUserOnline = useCallback((userId: string) => {
    return onlineUsers.includes(userId);
  }, [onlineUsers]);

  const isUserTyping = useCallback((userId: string) => {
    return typingUsers.some(user => user.userId === userId && user.isTyping);
  }, [typingUsers]);


  const getOtherParticipant = useCallback((conversation: Conversation) => {
    return conversation.participants.find(id => id !== currentUserId);
  }, [currentUserId]);

  const getParticipantName = useCallback((userId: string | undefined) => {
    if (!userId) return 'Người dùng';
    
    // Always use participant fullname, not conversation name
    return participantNames[userId] || `Người dùng ${userId.slice(-4)}`;
  }, [participantNames]);

  const formatConversationTime = useCallback((timestamp: string) => {
    try {
      const date = new Date(timestamp);
      const now = new Date();
      const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
      
      if (diffInHours < 24) {
        return format(date, 'HH:mm', { locale: vi });
      } else if (diffInHours < 168) { // 7 days
        return format(date, 'EEEE', { locale: vi });
      } else {
        return format(date, 'dd/MM/yyyy', { locale: vi });
      }
    } catch (error) {
      return '...';
    }
  }, []);

  const getLastMessagePreview = useCallback((conversation: Conversation) => {
    const otherUserId = getOtherParticipant(conversation);
    if (isUserTyping(otherUserId || '')) {
      return 'Đang nhập...';
    }
    
    if (!conversation.lastMessageDate) {
      return 'Bắt đầu cuộc trò chuyện';
    }
    
    // Get the last message from the lastMessages prop
    const lastMessage = lastMessages[conversation.id];
    if (lastMessage) {
      return lastMessage.length > 50 ? lastMessage.substring(0, 50) + '...' : lastMessage;
    }
    
    return 'Tin nhắn gần đây...';
  }, [isUserTyping, lastMessages, currentUserId]);


  return (
    <div className="flex-1 overflow-y-auto">
      {(() => {
        if (isLoading) {
          return (
            <div className="flex items-center justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          );
        }
        
        if (filteredConversations.length === 0) {
          return (
            <div className="p-8 text-center text-gray-500">
              <ChatBubbleLeftIcon className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium mb-2">Chưa có cuộc trò chuyện nào</p>
              <p className="text-sm">Bắt đầu cuộc trò chuyện đầu tiên của bạn!</p>
            </div>
          );
        }
        
        return (
          <div className="p-2 space-y-1">
            {(() => {
              const { conversationsWithMessages, conversationsWithoutMessages } = conversationGroups;
              
              return (
                <>
                  {/* New conversations without messages */}
                  {conversationsWithoutMessages.map((conversation) => {
                    const otherUserId = getOtherParticipant(conversation);
                    const isSelected = currentConversation?.id === conversation.id;
                    const isOnline = isUserOnline(otherUserId || '');

                    return (
                      <button
                        key={conversation.id}
                        onClick={() => onSelectConversation(conversation)}
                        aria-label={`Chọn cuộc trò chuyện với ${otherUserId}`}
                        className={`w-full text-left p-3 rounded-xl hover:bg-gray-50 transition-all duration-200 group relative ${
                          isSelected ? 'bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 shadow-sm' : 'bg-green-50 border border-green-200'
                        }`}
                      >
                        <div className="absolute top-2 right-2">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Mới
                          </span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="relative">
                            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                              {getParticipantName(otherUserId).charAt(0).toUpperCase()}
                            </div>
                            {isOnline && (
                              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-semibold text-gray-900 truncate">
                                {getParticipantName(otherUserId)}
                              </p>
                            </div>
                            <p className="text-xs truncate text-green-600 font-medium">
                              {getLastMessagePreview(conversation)}
                            </p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                  
                  {/* Separator if both groups exist */}
                  {conversationsWithMessages.length > 0 && conversationsWithoutMessages.length > 0 && (
                    <div className="px-3 py-2">
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Cuộc trò chuyện có tin nhắn</p>
                    </div>
                  )}
                  
                  {/* Conversations with recent messages */}
                  {conversationsWithMessages.map((conversation) => {
                    const otherUserId = getOtherParticipant(conversation);
                    const isSelected = currentConversation?.id === conversation.id;
                    const isOnline = isUserOnline(otherUserId || '');
                    const isTyping = isUserTyping(otherUserId || '');

                    return (
                      <button
                        key={conversation.id}
                        onClick={() => onSelectConversation(conversation)}
                        aria-label={`Chọn cuộc trò chuyện với ${otherUserId}`}
                        className={`w-full text-left p-3 rounded-xl hover:bg-gray-50 transition-all duration-200 group ${
                          isSelected ? 'bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 shadow-sm' : ''
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="relative">
                            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                              {getParticipantName(otherUserId).charAt(0).toUpperCase()}
                            </div>
                            {isOnline && (
                              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-semibold text-gray-900 truncate">
                                {getParticipantName(otherUserId)}
                              </p>
                              {conversation.lastMessageDate && (
                                <p className="text-xs text-gray-500">
                                  {formatConversationTime(conversation.lastMessageDate)}
                                </p>
                              )}
                            </div>
                            <p className={`text-xs truncate ${
                              isTyping ? 'text-blue-600 font-medium' : 'text-gray-500'
                            }`}>
                              {getLastMessagePreview(conversation)}
                            </p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </>
              );
            })()}
          </div>
        );
      })()}
    </div>
  );
};

export default ConversationList;
