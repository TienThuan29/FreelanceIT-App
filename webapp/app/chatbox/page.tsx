'use client';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useChat } from '@/contexts/ChatContext';
import { useAuth, ProtectedRoute } from '@/contexts/AuthContext';
import { UserProfile } from '@/types/user.type';
import { Button } from '@/components/ui/Button';
import { 
  ChatBubbleLeftIcon, 
  UserPlusIcon, 
  ChatBubbleOvalLeftEllipsisIcon, 
  PaperAirplaneIcon,
  PaperClipIcon,
  PhoneIcon,
  VideoCameraIcon,
  EllipsisVerticalIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import ConversationListWrapper from '@/components/chat/ConversationListWrapper';
import DeveloperList from '@/components/chat/DeveloperList';
import SmartNavbar from '@/components/SmartNavbar';
import ConversationSettingsModal from '@/components/chat/ConversationSettingsModal';
import StarterMessages from '@/components/chat/StarterMessages';
import { toast } from 'sonner';

type ChatView = 'conversations' | 'developers' | 'chat';
type SidebarTab = 'messages' | 'developers';

const ChatBoxPage: React.FC = () => {
  const {
    conversations,
    currentConversation,
    messages,
    onlineUsers,
    typingUsers,
    lastMessages,
    isConnected,
    isLoadingConversations,
    isLoadingMessages,
    isLoadingOlderMessages,
    isSendingMessage,
    hasMoreMessages,
    conversationHasMessages,
    loadConversations,
    loadMessages,
    loadOlderMessages,
    setCurrentConversation,
    markMessagesAsRead,
    joinConversation,
    startTyping,
    stopTyping,
    leaveConversation,
    createConversation,
    updateConversation,
    deleteConversation,
    setEnableSocket,
    sendMessage,
  } = useChat();

  const { user, accessToken } = useAuth();
  const [messageInput, setMessageInput] = useState('');
  const [currentView, setCurrentView] = useState<ChatView>('conversations');
  const [currentSidebarTab, setCurrentSidebarTab] = useState<SidebarTab>('messages');
  const [selectedDeveloper, setSelectedDeveloper] = useState<UserProfile | null>(null);
  const [isCreatingConversation, setIsCreatingConversation] = useState(false);
  const [participantInfo, setParticipantInfo] = useState<UserProfile | null>(null);
  const [participantNames, setParticipantNames] = useState<{ [userId: string]: string }>({});
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);
  const [showConversationSettings, setShowConversationSettings] = useState(false);
  const loadedConversationsRef = useRef<Set<string>>(new Set());

  // Get other participant info
  const getOtherParticipant = useCallback(() => {
    if (!currentConversation || !user) return null;
    return currentConversation.participants.find(id => id !== user.id);
  }, [currentConversation, user]);

  // Load participant info
  const loadParticipantInfo = useCallback(async (participantId: string) => {
    if (!participantId || !accessToken) return;
    
    try {
      // Try to get from selectedDeveloper first
      if (selectedDeveloper && selectedDeveloper.id === participantId) {
        setParticipantInfo(selectedDeveloper);
        setParticipantNames(prev => ({ ...prev, [participantId]: selectedDeveloper.fullname }));
        return;
      }

      // If not found, try to fetch from API
      const response = await fetch(`/api/v1/auth/users`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          const allUsers = data.dataResponse || [];
          const participant = allUsers.find((u: UserProfile) => u.id === participantId);
          if (participant) {
            setParticipantInfo(participant);
            setParticipantNames(prev => ({ ...prev, [participantId]: participant.fullname }));
          }
        }
      }
    } catch (error) {
      console.error('Error loading participant info:', error);
    }
  }, [accessToken, selectedDeveloper]);

  // Load participant names for all conversations
  const loadAllParticipantNames = useCallback(async () => {
    if (!accessToken || !user) return;
    
    try {
      const response = await fetch(`/api/v1/auth/users`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          const allUsers = data.dataResponse || [];
          const nameMap: { [userId: string]: string } = {};
          
          // Get all unique participant IDs from conversations
          const allParticipantIds = new Set<string>();
          conversations.forEach(conv => {
            conv.participants.forEach(id => {
              if (id !== user.id) {
                allParticipantIds.add(id);
              }
            });
          });
          
          // Map participant IDs to names
          allParticipantIds.forEach(participantId => {
            const userData = allUsers.find((u: UserProfile) => u.id === participantId);
            if (userData) {
              nameMap[participantId] = userData.fullname;
            }
          });
          
          setParticipantNames(nameMap);
        }
      }
    } catch (error) {
      console.error('Error loading participant names:', error);
    }
  }, [accessToken, user, conversations]);

  // Load participant names when conversations change
  useEffect(() => {
    if (conversations.length > 0) {
      loadAllParticipantNames();
    }
  }, [conversations, loadAllParticipantNames]);

  // Load conversations on mount
  useEffect(() => {
    if (user && accessToken) {
      loadConversations();
    }
  }, [user, accessToken, loadConversations]);

  // Persist current conversation to localStorage
  useEffect(() => {
    if (currentConversation) {
      localStorage.setItem('currentConversationId', currentConversation.id);
    }
  }, [currentConversation]);

  // Restore current conversation from localStorage on mount
  useEffect(() => {
    const savedConversationId = localStorage.getItem('currentConversationId');
    
    if (savedConversationId && conversations.length > 0) {
      const savedConversation = conversations.find(conv => conv.id === savedConversationId);
      
      if (savedConversation && !currentConversation) {
        setCurrentConversation(savedConversation);
      }
    }
  }, [conversations, currentConversation?.id, setCurrentConversation]);

  // Enable socket connection when in chat page
  useEffect(() => {
    setEnableSocket(true);
    return () => setEnableSocket(false);
  }, [setEnableSocket]);

  // Clear loaded conversations when user changes
  useEffect(() => {
    loadedConversationsRef.current.clear();
  }, [user?.id]);



  // Load messages when conversation changes
  useEffect(() => {
    if (currentConversation?.id) {
      
      // Only load messages if we haven't loaded this conversation yet
      const hasLoaded = loadedConversationsRef.current.has(currentConversation.id);
      const hasMessages = conversationHasMessages[currentConversation.id];
      
      // Load messages only if:
      // 1. We haven't loaded this conversation yet, AND
      // 2. (We know it has messages OR this conversation was just created with lastMessageDate)
      if (!hasLoaded && (hasMessages || currentConversation.lastMessageDate)) {
        loadedConversationsRef.current.add(currentConversation.id);
        loadMessages(currentConversation.id);
      }
      
      // Reset auto-scroll when switching conversations
      setShouldAutoScroll(true);
      
      // Join conversation room
      joinConversation(currentConversation.id);
      
      // Load participant info
      const otherParticipantId = getOtherParticipant();
      if (otherParticipantId) {
        loadParticipantInfo(otherParticipantId);
      }
      
      // Mark messages as read - moved to separate useEffect
      
      // Switch to chat view when conversation is loaded
      setCurrentView('chat');
      setCurrentSidebarTab('messages');
    }

    return () => {
      if (currentConversation) {
        leaveConversation(currentConversation.id);
      }
    };
  }, [currentConversation?.id, loadMessages, getOtherParticipant, loadParticipantInfo, user?.id, conversationHasMessages]);

  // Mark messages as read when conversation changes
  useEffect(() => {
    if (currentConversation?.id && user?.id) {
      const unreadMessageIds = messages
        .filter(msg => 
          msg.conversationId === currentConversation.id && 
          !msg.isRead && 
          msg.senderId !== user.id
        )
        .map(msg => msg.id);
      
      if (unreadMessageIds.length > 0) {
        markMessagesAsRead(unreadMessageIds);
      }
    }
  }, [currentConversation?.id, user?.id, markMessagesAsRead]);

  // Auto-scroll to bottom when messages change (only if user is at bottom)
  useEffect(() => {
    if (messagesEndRef.current && shouldAutoScroll) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, typingUsers, currentConversation?.id, shouldAutoScroll]);

  // Handle scroll events for infinite scroll
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    const { scrollTop, scrollHeight, clientHeight } = container;
    
    // Check if user is near the bottom (within 100px)
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
    setShouldAutoScroll(isNearBottom);
    
    // Check if user is near the top (within 100px) to load older messages
    if (scrollTop < 100 && 
        currentConversation?.id && 
        hasMoreMessages[currentConversation.id] && 
        !isLoadingOlderMessages) {
      loadOlderMessages(currentConversation.id);
    }
  }, [currentConversation?.id, hasMoreMessages, isLoadingOlderMessages, loadOlderMessages]);

  // Auto-select first conversation with messages if no current conversation
  useEffect(() => {
    if (conversations.length > 0 && !currentConversation) {
      const conversationWithMessages = conversations.find(conv => conv.lastMessageDate);
      if (conversationWithMessages) {
        setCurrentConversation(conversationWithMessages);
      }
    }
  }, [conversations, currentConversation?.id, setCurrentConversation]);

  // Handle when current conversation is deleted
  useEffect(() => {
    if (currentConversation && !conversations.find(conv => conv.id === currentConversation.id)) {
      // Current conversation was deleted, switch to conversations view
      setCurrentConversation(null);
      setCurrentView('conversations');
    }
  }, [conversations, currentConversation]);

  // Handle send message
  const handleSendMessage = () => {
    if (messageInput.trim() && currentConversation) {
      sendMessage(messageInput.trim());
      setMessageInput('');
      stopTyping(); // Stop typing indicator when sending message
      setShouldAutoScroll(true); // Auto scroll when sending message
    }
  };

  // Handle input change
  const handleInputChange = (value: string) => {
    setMessageInput(value);
    
    // Trigger typing indicator only when typing starts or stops
    if (value.trim().length > 0 && messageInput.trim().length === 0) {
      // Started typing
      startTyping();
    } else if (value.trim().length === 0 && messageInput.trim().length > 0) {
      // Stopped typing
      stopTyping();
    }
  };

  // Check if user is online
  const isUserOnline = (userId: string) => {
    return onlineUsers.includes(userId);
  };

  // Handle conversation rename
  const handleRenameConversation = async (newName: string) => {
    if (currentConversation) {
      await updateConversation(currentConversation.id, newName);
    }
  };

  // Handle conversation delete
  const handleDeleteConversation = async () => {
    if (currentConversation) {
      await deleteConversation(currentConversation.id);
      setCurrentView('conversations');
    }
  };

  // Handle starter message selection
  const handleStarterMessageSelect = (message: string) => {
    if (currentConversation) {
      sendMessage(message.trim());
      stopTyping(); // Stop typing indicator when sending message
      setShouldAutoScroll(true); // Auto scroll when sending message
    }
  };

  // Handle developer selection
  const handleSelectDeveloper = async (developer: UserProfile) => {
    if (!user) return;
    
    setSelectedDeveloper(developer);
    setIsCreatingConversation(true);
    
    try {
      // Create conversation between current user and selected developer
      const conversation = await createConversation([user.id, developer.id]);
      
      if (conversation) {
        setCurrentConversation(conversation);
        setCurrentView('chat');
        setCurrentSidebarTab('messages');
        
        // Join the conversation room immediately for real-time messaging
        joinConversation(conversation.id);
      }
    } catch (error) {
      console.error('Error creating conversation:', error);
      toast.error('Không thể tạo cuộc trò chuyện');
    } finally {
      setIsCreatingConversation(false);
    }
  };

  // Handle start new chat
  const handleStartNewChat = () => {
    setCurrentView('developers');
    setCurrentSidebarTab('developers');
    setSelectedDeveloper(null);
  };

  // Filter conversations based on search
  const filteredConversations = conversations.filter(conv => {
    if (!searchQuery) return true;
    const otherParticipantId = conv.participants.find(id => id !== user?.id);
    return otherParticipantId?.toLowerCase().includes(searchQuery.toLowerCase());
  });


  return (
    <ProtectedRoute>
      <div className="h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col">
        {/* Smart Navbar */}
        {/* <SmartNavbar /> */}
        
        {/* Chat Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <div className="w-80 border-r border-gray-200/50 bg-white/80 backdrop-blur-sm flex flex-col shadow-xl">
            {/* Sidebar Header with Tabs */}
            <div className="p-6 border-b border-gray-200/50 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-xl font-bold">Chat</h1>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleStartNewChat}
                  className="p-2 text-white hover:bg-white/20 rounded-full transition-all duration-200"
                >
                  <UserPlusIcon className="h-5 w-5" />
                </Button>
              </div>
              
              {/* Search Bar */}
              <div className="relative mb-4">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm cuộc trò chuyện..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent"
                />
              </div>
              
              {/* Tabs */}
              <div className="flex space-x-1 bg-white/20 rounded-lg p-1">
                <button
                  onClick={() => setCurrentSidebarTab('messages')}
                  className={`flex-1 flex items-center justify-center space-x-2 px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                    currentSidebarTab === 'messages'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <ChatBubbleOvalLeftEllipsisIcon className="h-4 w-4" />
                  <span>Messages</span>
                </button>
                
                <button
                  onClick={() => setCurrentSidebarTab('developers')}
                  className={`flex-1 flex items-center justify-center space-x-2 px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                    currentSidebarTab === 'developers'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <UserPlusIcon className="h-4 w-4" />
                  <span>Người dùng</span>
                </button>
              </div>
            </div>

            {/* Sidebar Content */}
            <div className="flex-1 overflow-hidden">
              {currentSidebarTab === 'messages' && (
                <ConversationListWrapper
                  conversations={filteredConversations}
                  currentConversation={currentConversation}
                  onlineUsers={onlineUsers}
                  typingUsers={typingUsers}
                  isLoading={isLoadingConversations}
                  currentUserId={user?.id || ''}
                  onSelectConversation={(conv) => {
                    setCurrentConversation(conv);
                    setCurrentView('chat');
                  }}
                  onCreateConversation={handleStartNewChat}
                  lastMessages={lastMessages}
                  participantNames={participantNames}
                />
              )}
              
              {currentSidebarTab === 'developers' && (
                <div className="h-full flex flex-col relative">
                  <DeveloperList
                    onSelectDeveloper={handleSelectDeveloper}
                    selectedDeveloperId={selectedDeveloper?.id}
                  />
                  
                  {/* Loading overlay */}
                  {isCreatingConversation && (
                    <div className="absolute inset-0 bg-white/90 backdrop-blur-sm flex items-center justify-center z-10">
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-gray-600 font-medium">Đang tạo cuộc trò chuyện...</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col bg-white/50 backdrop-blur-sm">
            {currentView === 'chat' && currentConversation ? (
              <>
                {/* Chat Header */}
                <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 p-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                          {participantInfo?.fullname?.charAt(0) || 'U'}
                        </div>
                        {isUserOnline(getOtherParticipant() || '') && (
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 truncate max-w-[200px]">
                          {participantInfo?.fullname || 'Người dùng'}
                        </h3>
                        <p className="text-sm text-gray-500 flex items-center space-x-1">
                          <div className={`w-2 h-2 rounded-full ${isUserOnline(getOtherParticipant() || '') ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                          <span>{isUserOnline(getOtherParticipant() || '') ? 'Đang hoạt động' : 'Offline'}</span>
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all duration-200"
                      >
                        <PhoneIcon className="h-5 w-5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all duration-200"
                      >
                        <VideoCameraIcon className="h-5 w-5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-all duration-200"
                        onClick={() => setShowConversationSettings(true)}
                      >
                        <EllipsisVerticalIcon className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Messages Area */}
                <div 
                  ref={messagesContainerRef}
                  className="flex-1 overflow-y-auto p-4 space-y-4"
                  onScroll={handleScroll}
                >
                  {(() => {
                    if (isLoadingMessages && messages.length === 0) {
                      return (
                        <div className="flex items-center justify-center h-full">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        </div>
                      );
                    }
                    
                    const filteredMessages = messages.filter(message => message.conversationId === currentConversation?.id);
                    if (filteredMessages.length === 0) {
                      // Check if this conversation has messages or is truly empty
                      const hasMessages = currentConversation?.id ? 
                        conversationHasMessages[currentConversation.id] : false;
                      
                      if (!hasMessages && !isLoadingMessages) {
                        // Show starter messages for new conversations
                        return (
                          <StarterMessages
                            onSelectMessage={handleStarterMessageSelect}
                            participantName={participantInfo?.fullname}
                            isDeveloper={participantInfo?.role === 'DEVELOPER'}
                          />
                        );
                      } else {
                        // Show loading or empty state for conversations that might have messages
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
                    }
                    
                    return (
                    <div className="space-y-4">
                      {/* Loading indicator for older messages */}
                      {isLoadingOlderMessages && (
                        <div className="flex justify-center py-4">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                        </div>
                      )}
                      
                      {messages
                        .filter(message => message.conversationId === currentConversation?.id)
                        .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()) // Sort by time
                        .map((message, index) => {
                        const isOwn = message.senderId === user?.id;
                        const filteredMessages = messages.filter(msg => msg.conversationId === currentConversation?.id);
                        const prevMessage = index > 0 ? filteredMessages[index - 1] : null;
                        const showTime = !prevMessage || 
                          (new Date(message.createdAt).getTime() - new Date(prevMessage.createdAt).getTime()) > 5 * 60 * 1000;
                        
                        const messageClasses = isOwn 
                          ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white' 
                          : 'bg-white border border-gray-200 text-gray-900';
                        const timeClasses = isOwn 
                          ? 'text-white/70' 
                          : 'text-gray-500';

                        const flexClasses = isOwn ? 'justify-end' : 'justify-start';
                        
                        return (
                          <div key={message.id} className={`flex ${flexClasses}`}>
                            <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${messageClasses} shadow-sm`}>
                              <p className="text-sm">{message.content}</p>
                              {showTime && (
                                <p className={`text-xs mt-1 ${timeClasses}`}>
                                  {new Date(message.createdAt).toLocaleTimeString('vi-VN', {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </p>
                              )}
                            </div>
                          </div>
                        );
                      })}
                      
                      {/* Typing Indicator */}
                      {typingUsers.length > 0 && (
                        <div className="flex justify-start">
                          <div className="bg-white border border-gray-200 rounded-2xl px-4 py-2 shadow-sm">
                            <div className="flex space-x-1">
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      <div ref={messagesEndRef} />
                    </div>
                    );
                  })()}
                </div>

                {/* Message Input */}
                <div className="bg-white/80 backdrop-blur-sm border-t border-gray-200/50 p-4">
                  <div className="flex items-center space-x-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all duration-200"
                    >
                      <PaperClipIcon className="h-5 w-5" />
                    </Button>
                    
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        value={messageInput}
                        onChange={(e) => handleInputChange(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
                          }
                        }}
                        placeholder="Nhập tin nhắn..."
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        disabled={!isConnected}
                      />
                      {!isConnected && (
                        <div className="absolute inset-0 bg-gray-100/50 rounded-full flex items-center justify-center">
                          <span className="text-xs text-gray-500">Đang kết nối...</span>
                        </div>
                      )}
                    </div>
                    
                    <Button
                      onClick={handleSendMessage}
                      disabled={!messageInput.trim() || !isConnected || isSendingMessage}
                      className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-3 rounded-full hover:from-blue-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg"
                    >
                      {isSendingMessage ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      ) : (
                        <PaperAirplaneIcon className="h-5 w-5" />
                      )}
                    </Button>
                  </div>
                </div>
              </>
            ) : currentView === 'developers' ? (
              /* Developer Selection Screen */
              <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
                <div className="text-center max-w-md mx-auto px-6">
                  <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                    <UserPlusIcon className="h-12 w-12 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">
                    Chọn người để trò chuyện
                  </h2>
                  <p className="text-gray-600 mb-8 leading-relaxed">
                    Chọn một người dùng từ danh sách bên trái để bắt đầu cuộc trò chuyện mới.
                  </p>
                </div>
              </div>
            ) : (
              /* Welcome Screen */
              <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
                <div className="text-center max-w-md mx-auto px-6">
                  <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                    <ChatBubbleLeftIcon className="h-12 w-12 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">
                    Chào mừng đến với Chat
                  </h2>
                  <p className="text-gray-600 mb-8 leading-relaxed">
                    Kết nối và trò chuyện với các developer trong cộng đồng. 
                    Chọn một cuộc trò chuyện từ sidebar để bắt đầu.
                  </p>
                  <Button
                    onClick={handleStartNewChat}
                    className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-3 rounded-full hover:from-blue-600 hover:to-purple-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                  >
                    <UserPlusIcon className="h-5 w-5 mr-2" />
                    Bắt đầu cuộc trò chuyện mới
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Conversation Settings Modal */}
      <ConversationSettingsModal
        isOpen={showConversationSettings}
        onClose={() => setShowConversationSettings(false)}
        conversationName={currentConversation?.name}
        onRename={handleRenameConversation}
        onDelete={handleDeleteConversation}
        isLoading={isLoadingConversations}
      />
    </ProtectedRoute>
  );
};

export default ChatBoxPage;