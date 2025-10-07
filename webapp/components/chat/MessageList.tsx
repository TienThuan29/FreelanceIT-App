'use client';
import React, { useEffect, useRef, useState } from 'react';
import { ChatBubbleLeftIcon } from '@heroicons/react/24/outline';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';
import { ChatMessage, TypingUser } from '@/contexts/ChatContext';

interface MessageListProps {
  messages: ChatMessage[];
  typingUsers: TypingUser[];
  currentUserId: string;
  isLoading: boolean;
  onLoadMore?: () => void;
}

const MessageList: React.FC<MessageListProps> = ({
  messages,
  typingUsers,
  currentUserId,
  isLoading,
  onLoadMore
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [isClient, setIsClient] = useState(false);

  // Ensure component is mounted on client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typingUsers]);

  // Handle scroll to load more messages
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop } = e.currentTarget;
    if (scrollTop === 0 && onLoadMore && !isLoading) {
      onLoadMore();
    }
  };

  // Group messages by date for better organization
  const groupMessagesByDate = (messages: ChatMessage[]) => {
    if (!isClient) return {}; // Prevent hydration mismatch
    
    const groups: { [key: string]: ChatMessage[] } = {};
    
    messages.forEach(message => {
      const date = new Date(message.createdAt).toDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
    });
    
    return groups;
  };

  const formatDateHeader = (dateString: string) => {
    if (!isClient) return '...'; // Prevent hydration mismatch
    
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Hôm nay';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Hôm qua';
    } else {
      return date.toLocaleDateString('vi-VN', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
  };

  const groupedMessages = groupMessagesByDate(messages);

  return (
    <div 
      ref={messagesContainerRef}
      className="flex-1 overflow-y-auto p-4"
      onScroll={handleScroll}
    >
      {(() => {
        if (isLoading && messages.length === 0) {
          return (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          );
        }
        
        if (Object.keys(groupedMessages).length === 0) {
          return (
            <div className="flex items-center justify-center h-full text-gray-500">
              <div className="text-center">
                <ChatBubbleLeftIcon className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                <p>Chưa có tin nhắn nào</p>
                <p className="text-sm">Bắt đầu cuộc trò chuyện!</p>
              </div>
            </div>
          );
        }
        
        return (
        <div className="space-y-4">
          {Object.entries(groupedMessages).map(([dateString, dateMessages]) => (
            <div key={dateString}>
              {/* Date Header */}
              <div className="flex items-center justify-center mb-4">
                <div className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full">
                  {formatDateHeader(dateString)}
                </div>
              </div>
              
              {/* Messages for this date */}
              <div className="space-y-2">
                {dateMessages.map((message, index) => {
                  const prevMessage = index > 0 ? dateMessages[index - 1] : null;
                  
                  // Show time if it's the first message of the day or if there's a significant time gap
                  const showTime = !prevMessage || 
                    (new Date(message.createdAt).getTime() - new Date(prevMessage.createdAt).getTime()) > 5 * 60 * 1000; // 5 minutes
                  
                  return (
                    <MessageBubble
                      key={message.id}
                      message={message}
                      currentUserId={currentUserId}
                      showTime={showTime}
                    />
                  );
                })}
              </div>
            </div>
          ))}
          
          {/* Typing Indicator */}
          <TypingIndicator 
            typingUsers={typingUsers}
            currentUserId={currentUserId}
          />
          
          <div ref={messagesEndRef} />
        </div>
        );
      })()}
    </div>
  );
};

export default MessageList;
