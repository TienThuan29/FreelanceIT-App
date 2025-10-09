'use client';
import React, { useState, useEffect } from 'react';

interface Conversation {
  id: string;
  participants: string[];
  projectId?: string;
  createdAt: string;
  updatedAt: string;
  lastMessageDate?: string;
  isArchived: boolean;
}

import { 
  ChatBubbleLeftIcon, 
  UserCircleIcon,
  ClockIcon 
} from '@heroicons/react/24/outline';

interface ChatHistoryListProps {
  conversations: Conversation[];
  currentConversation: Conversation | null;
  currentUserId: string;
  onSelectConversation: (conversation: Conversation) => void;
}

const ChatHistoryList: React.FC<ChatHistoryListProps> = ({
  conversations,
  currentConversation,
  currentUserId,
  onSelectConversation
}) => {
  const [isClient, setIsClient] = useState(false);

  // Ensure component is mounted on client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Get unique participants from all conversations
  const getUniqueParticipants = () => {
    const participantMap = new Map<string, Conversation>();
    
    conversations.forEach(conv => {
      conv.participants.forEach((participantId: string) => {
        if (participantId !== currentUserId) {
          // Keep the most recent conversation with each participant
          const existing = participantMap.get(participantId);
          if (!existing || new Date(conv.updatedAt) > new Date(existing.updatedAt)) {
            participantMap.set(participantId, conv);
          }
        }
      });
    });
    
    return Array.from(participantMap.values());
  };

  const uniqueConversations = getUniqueParticipants();

  const formatLastMessageTime = (timestamp: string) => {
    if (!isClient) return '...'; // Prevent hydration mismatch
    
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      const minutes = Math.floor(diffInHours * 60);
      return `${minutes}m`;
    } else if (diffInHours < 24) {
      const hours = Math.floor(diffInHours);
      return `${hours}h`;
    } else {
      const days = Math.floor(diffInHours / 24);
      return `${days}d`;
    }
  };

  const getOtherParticipantName = (conversation: Conversation) => {
    const otherParticipantId = conversation.participants.find((id: string) => id !== currentUserId);
    return otherParticipantId ? `User ${otherParticipantId.slice(-4)}` : 'Unknown User';
  };

  if (uniqueConversations.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center">
          <ChatBubbleLeftIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Chưa có cuộc trò chuyện nào
          </h3>
          <p className="text-gray-500">
            Bắt đầu cuộc trò chuyện với một developer
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Lịch sử trò chuyện
        </h2>
        
        <div className="space-y-2">
          {uniqueConversations.map((conversation) => {
            const isActive = currentConversation?.id === conversation.id;
            const otherParticipantName = getOtherParticipantName(conversation);
            
            return (
              <button
                key={conversation.id}
                onClick={() => onSelectConversation(conversation)}
                className={`w-full p-3 rounded-lg transition-colors text-left ${
                  isActive
                    ? 'bg-blue-50 border border-blue-200'
                    : 'hover:bg-gray-50 border border-transparent'
                }`}
              >
                <div className="flex items-center space-x-3">
                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    <UserCircleIcon className="h-10 w-10 text-gray-400" />
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {otherParticipantName}
                      </p>
                      {conversation.lastMessageDate && (
                        <div className="flex items-center text-xs text-gray-500">
                          <ClockIcon className="h-3 w-3 mr-1" />
                          {formatLastMessageTime(conversation.lastMessageDate)}
                        </div>
                      )}
                    </div>
                    
                    <p className="text-xs text-gray-500 truncate">
                      Cuộc trò chuyện gần đây
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ChatHistoryList;
