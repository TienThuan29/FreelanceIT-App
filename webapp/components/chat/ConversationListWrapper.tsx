'use client';
import React, { useState, useEffect } from 'react';
import ConversationList from './ConversationList';
import type { Conversation, TypingUser } from '@/contexts/ChatContext';

interface ConversationListWrapperProps {
  conversations: Conversation[];
  currentConversation: Conversation | null;
  onlineUsers: string[];
  typingUsers: TypingUser[];
  isLoading: boolean;
  currentUserId: string;
  onSelectConversation: (conversation: Conversation) => void;
  onCreateConversation: () => void;
  lastMessages: { [conversationId: string]: string };
  participantNames: { [userId: string]: string };
}

const ConversationListWrapper: React.FC<ConversationListWrapperProps> = (props) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Prevent hydration mismatch by not rendering until client-side
  if (!isClient) {
    return (
      <div className="flex-1 overflow-y-auto">
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return <ConversationList {...props} />;
};

export default ConversationListWrapper;
