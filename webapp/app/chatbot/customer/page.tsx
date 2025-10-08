"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from "@/contexts/AuthContext";
import { useRoleValidator } from "@/hooks/useRoleValidator";
import { useCustomerChatbot, ChatbotSendMessageRequest, ChatbotSessionResponse } from "@/hooks/useCustomerChatbot";
import { ChatbotSession, ChatItem } from '@/types/chatbot.type';
import SmartNavbar from '@/components/SmartNavbar';

export default function ChatBotPage() {
  const { user } = useAuth();
  const { isDeveloper, isCustomer } = useRoleValidator(user);
  const { sendMessage, getChatbotSessions, getChatbotSession, loading, sessionsLoading, error, clearError } = useCustomerChatbot();

  // State management
  const [currentSession, setCurrentSession] = useState<ChatbotSession | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatbotSessionResponse[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load chat history on component mount
  useEffect(() => {
    if (user?.id) {
      loadChatHistory();
    }
  }, [user?.id]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [currentSession?.chatItems]);

  const loadChatHistory = async () => {
    if (!user?.id) return;

    try {
      const sessions = await getChatbotSessions(user.id);
      console.log('Loaded chat sessions:', sessions);
      setChatHistory(sessions || []);
    } catch (err) {
      console.error('Failed to load chat history:', err);
      setChatHistory([]);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!input.trim() || !user?.id || loading) return;

    const messageText = input.trim();
    setInput('');
    setIsTyping(true);
    clearError();

    try {
      // Add user message to current session immediately
      const userMessage: ChatItem = {
        content: messageText,
        isBot: false,
        createdDate: new Date().toISOString()
      };

      let updatedSession: ChatbotSession;

      if (currentSession) {
        // Continue existing session
        updatedSession = {
          ...currentSession,
          chatItems: [...(currentSession.chatItems || []), userMessage]
        };
        setCurrentSession(updatedSession);
      } else {
        // Create new session
        updatedSession = {
          sessionId: '', // Will be set by backend
          userId: user.id,
          chatItems: [userMessage]
        };
        setCurrentSession(updatedSession);
      }

      // Send message to backend
      const request: ChatbotSendMessageRequest = {
        sessionId: currentSession?.sessionId,
        userId: user.id,
        chatInput: messageText
      };

      const response = await sendMessage(request);
      console.log('Send message response:', response);

      // Update current session with response
      setCurrentSession(response);

      // Update chat history if this is a new session
      if (!currentSession) {
        await loadChatHistory();
      }

    } catch (err) {
      console.error('Failed to send message:', err);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSessionSelect = async (session: ChatbotSessionResponse) => {
    try {
      // Load full session with chat items
      const fullSession = await getChatbotSession(session.sessionId);
      if (fullSession) {
        setCurrentSession(fullSession);
      }
    } catch (err) {
      console.error('Failed to load session:', err);
    }
  };

  const handleNewChat = () => {
    setCurrentSession(null);
    setInput('');
    clearError();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="h-screen flex flex-col">
      <SmartNavbar/>
      <div className="flex-1 flex bg-gray-50">
        {/* Sidebar */}
        <div className={`${isSidebarOpen ? 'w-64' : 'w-0'} transition-all duration-300 bg-white border-r border-gray-200 flex flex-col`}>
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-black mb-3">Lịch sử</h2>
            <div className="w-full h-px bg-gray-200 mb-3"></div>
            <button
              onClick={handleNewChat}
              className="w-full px-3 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
            >
              Trò chuyện mới
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {sessionsLoading ? (
              <div className="space-y-3">
                {/* Loading skeleton */}
                {[1, 2, 3].map((i) => (
                  <div key={i} className="p-3 rounded-lg bg-gray-100 animate-pulse">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  </div>
                ))}
              </div>
            ) : !chatHistory || chatHistory.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 text-sm">No chat history yet</p>
              </div>
            ) : (
              <div className="space-y-2">
                {chatHistory.map((session) => (
                  <div
                    key={session.sessionId}
                    onClick={() => handleSessionSelect(session)}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      currentSession?.sessionId === session.sessionId
                        ? 'bg-blue-100 border border-blue-300'
                        : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'
                    }`}
                  >
                    <h3 className="font-medium text-sm truncate text-gray-800">
                      {session.title || 'Trò chuyện mới'}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                      {session.createdDate && formatDate(session.createdDate)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col bg-white">
          {/* Header */}
          <div className="border-b border-gray-200 p-4 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 text-gray-600 hover:text-gray-800"
              >
                <svg className="w-5 h-5 cursor-pointer" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-lg font-semibold text-gray-800">
                    {isDeveloper ? 'Hỗ trợ lập trình viên' : isCustomer ? 'Hỗ trợ khách hàng' : 'Trợ lý FreeLanceIT'}
                  </h1>
                </div>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
            {!currentSession ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">Chào mừng bạn đến với trọ lý ảo FreeLanceIT</h2>
                  <p className="text-gray-600 mb-6">Bắt đầu cuộc trò chuyện để nhận được sự hỗ trợ về  tìm kiếm lập trình viên phù hợp.</p>
                  <button
                    onClick={() => setInput('Trợ lý này hỗ trợ như thế nào với người dùng?')}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Bắt đầu trò chuyện
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* Chat messages */}
                {currentSession.chatItems?.map((message, index) => (
                  <div key={index} className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}>
                    <div className={`max-w-3xl p-4 rounded-lg ${
                      message.isBot
                        ? 'bg-gray-100 text-gray-800'
                        : 'bg-blue-600 text-white'
                    }`}>
                      <p className="whitespace-pre-line">{message.content}</p>
                      <p className={`text-xs mt-2 ${
                        message.isBot ? 'text-gray-500' : 'text-blue-100'
                      }`}>
                        {formatDate(message.createdDate)}
                      </p>
                    </div>
                  </div>
                ))}

                {/* Typing indicator */}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 p-4 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        <span className="text-gray-500 text-sm ml-2"></span>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="bg-white border-t border-gray-200 flex-shrink-0">
            {/* Error message */}
            {error && (
              <div className="bg-red-50 border border-red-200 p-3 mx-4 mb-3 rounded-lg">
                <div className="flex items-center justify-between">
                  <p className="text-red-800 text-sm">{error}</p>
                  <button
                    onClick={clearError}
                    className="text-red-600 hover:text-red-800"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            )}

            {/* Input Area */}
            <div className="p-4">
              <div className="flex space-x-3">
                <div className="flex-1 relative">
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message here..."
                    className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={1}
                    disabled={loading}
                  />
                </div>
                <button
                  onClick={handleSendMessage}
                  disabled={!input.trim() || loading}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}