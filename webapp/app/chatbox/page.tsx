'use client';

import React, { useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useChatNotifications } from "@/hooks/useChatNotifications";
import { useState } from "react";
import { mockProjects } from "@/data/mockProjects";
import { Role } from "@/types/user.type";
import Link from "next/link";

interface Message {
  id: number;
  sender: Role;
  content: string;
  timestamp: Date;
  type: "text" | "file" | "image";
  fileName?: string;
}

interface ChatUser {
  id: string;
  name: string;
  avatar?: string;
  role: Role;
  isOnline: boolean;
  lastSeen?: Date;
}

interface ChatConversation {
  id: string;
  partner: ChatUser;
  lastMessage: string;
  timestamp: Date;
  unreadCount: number;
}

export default function Page() {
  const { user } = useAuth();
  const { markAsRead } = useChatNotifications();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Parse URL parameters
  const projectId = searchParams.get("projectId");

  // Find project context if available
  const contextProject = projectId
    ? mockProjects.find((p) => p.id === projectId)
    : null;

  const [currentUser] = useState<ChatUser>({
    id: user?.id || "1",
    name:
      user?.fullname || user?.email?.split("@")[0] || "Nguyễn Văn A",
    role: user?.role === Role.DEVELOPER ? Role.DEVELOPER : Role.CUSTOMER,
    isOnline: true,
  });

  const [conversations] = useState<ChatConversation[]>([
    {
      id: "1",
      partner: {
        id: "2",
        name: "Công ty ABC Tech",
        role: Role.CUSTOMER,
        isOnline: true,
      },
      lastMessage:
        "Chúng tôi cần phát triển một web app với React và Node.js...",
      timestamp: new Date(Date.now() - 1800000),
      unreadCount: 2,
    },
    {
      id: "2",
      partner: {
        id: "3",
        name: "Startup XYZ",
        role: Role.CUSTOMER,
        isOnline: false,
        lastSeen: new Date(Date.now() - 7200000),
      },
      lastMessage: "Cảm ơn bạn đã quan tâm đến dự án của chúng tôi",
      timestamp: new Date(Date.now() - 86400000),
      unreadCount: 0,
    },
    {
      id: "3",
      partner: {
        id: "4",
        name: "DevCorp Solutions",
        role: Role.CUSTOMER,
        isOnline: true,
      },
      lastMessage: "Khi nào bạn có thể bắt đầu dự án này?",
      timestamp: new Date(Date.now() - 3600000),
      unreadCount: 1,
    },
  ]);

  const [selectedConversation, setSelectedConversation] = useState<string>("1");
  const [messages, setMessages] = useState<Message[]>(() => {
    if (contextProject) {
      return [
        {
          id: 1,
          sender: Role.DEVELOPER,
          content: `Xin chào! Tôi vừa apply vào dự án "${contextProject.title}" của bạn. Tôi rất quan tâm và muốn tìm hiểu thêm chi tiết.`,
          timestamp: new Date(),
          type: "text",
        },
      ];
    }
    return [
      {
        id: 1,
        sender: Role.CUSTOMER,
        content:
          "Xin chào! Tôi đã xem profile của bạn và rất ấn tượng với kinh nghiệm React của bạn.",
        timestamp: new Date(Date.now() - 3600000),
        type: "text",
      },
    ];
  });

  // Function để chọn conversation và đánh dấu đã đọc
  const selectConversation = (conversationId: string) => {
    setSelectedConversation(conversationId);
    markAsRead(conversationId); // Đánh dấu đã đọc
    // Không auto-scroll khi chuyển conversation
  };

  const [input, setInput] = useState<string>("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(false); // Tắt hoàn toàn auto-scroll ban đầu

  // Chỉ auto-scroll khi có tin nhắn mới và được enable
  useEffect(() => {
    if (shouldAutoScroll && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
      setShouldAutoScroll(false); // Tắt ngay sau khi scroll để tránh loop
    }
  }, [messages.length, shouldAutoScroll]);

  // Kiểm tra nếu user đang scroll thì tắt auto-scroll
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    // Thêm tolerance để tránh floating point issues
    const isAtBottom = Math.abs(scrollHeight - scrollTop - clientHeight) < 5;

    // Không cần set shouldAutoScroll vì chúng ta đã tắt auto-scroll loop
    console.log("Scroll position:", { scrollTop, isAtBottom });
  };

  const handleSend = () => {
    if (input.trim() === "") return;

    const newMessage: Message = {
      id: messages.length + 1,
      sender: currentUser.role,
      content: input,
      timestamp: new Date(),
      type: "text",
    };

    setMessages((prev) => [...prev, newMessage]);
    setInput("");
    setShouldAutoScroll(true); // Luôn scroll xuống khi gửi tin nhắn mới

    // Simulate typing indicator
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
    }, 2000);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSend();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const newMessage: Message = {
        id: messages.length + 1,
        sender: currentUser.role,
        content: `Đã gửi file: ${file.name}`,
        timestamp: new Date(),
        type: "file",
        fileName: file.name,
      };
      setMessages((prev) => [...prev, newMessage]);
      setShouldAutoScroll(true); // Scroll xuống khi gửi file
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInHours = diffInMs / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return formatTime(date);
    } else {
      return date.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
      });
    }
  };

  const currentConversation = conversations.find(
    (c) => c.id === selectedConversation
  );
  const chatPartner = currentConversation?.partner;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Main Application Header/Navbar */}
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              {/* Logo */}
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <span className="text-xl font-bold text-white">F</span>
                </div>
                <span className="text-xl font-bold text-gray-900">FreelanceIT</span>
              </Link>
              
              {/* Navigation Links */}
              <nav className="hidden md:flex items-center space-x-6">
                <Link href="/post" className="text-gray-600 hover:text-blue-600 font-medium">Dự án</Link>
                <Link href="/freelancers" className="text-gray-600 hover:text-blue-600 font-medium">Freelancers</Link>
                <Link href="/chatbox" className="text-blue-600 font-medium border-b-2 border-blue-600 pb-1">Tin nhắn</Link>
                <Link href="/help" className="text-gray-600 hover:text-blue-600 font-medium">Trợ giúp</Link>
              </nav>
            </div>

            {/* User Profile */}
            <div className="flex items-center space-x-3">
              <div className="hidden md:flex items-center">
                <button className="text-gray-600 hover:text-gray-800 mr-5">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                </button>
              </div>
              <div className="flex items-center space-x-2 border-l pl-3 border-gray-200">
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-gray-600">
                    {currentUser.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-gray-800">{currentUser.name}</p>
                  <p className="text-xs text-gray-500">
                    {currentUser.role === Role.DEVELOPER ? "Developer" : "Nhà tuyển dụng"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Project Context Banner */}
      {contextProject && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-200">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-blue-900">{contextProject.title}</h3>
                  <p className="text-sm text-blue-600">
                    {new Intl.NumberFormat("vi-VN", {style: "currency", currency: "VND"}).format(contextProject.budget)}
                  </p>
                </div>
              </div>
              <button
                onClick={() => router.push(`/post-detail/${projectId}`)}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1"
              >
                Xem dự án
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Chat Header - Subheader */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => router.push(projectId ? `/post-detail/${projectId}` : "/post")}
                className="text-blue-600 hover:text-blue-800 p-1 rounded-full hover:bg-blue-50"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div>
                <h1 className="text-lg font-semibold text-gray-800">Tin nhắn</h1>
                {contextProject && (
                  <p className="text-sm text-gray-500">Về dự án: {contextProject.title}</p>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">Đang online</span>
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Container */}
      <div className="container mx-auto flex-1 flex flex-col md:flex-row shadow-lg bg-white rounded-lg my-4 overflow-hidden">
        {/* Conversations List */}
        <div className="w-full md:w-1/3 lg:w-1/4 bg-white border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <div className="relative">
              <input
                type="text"
                placeholder="Tìm kiếm cuộc trò chuyện..."
                className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <svg
                className="absolute left-3 top-2.5 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {conversations.map((conversation) => (
              <div
                key={conversation.id}
                onClick={() => selectConversation(conversation.id)}
                className={`flex items-center p-4 cursor-pointer border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                  selectedConversation === conversation.id
                    ? "bg-blue-50 border-l-4 border-l-blue-500"
                    : ""
                }`}
              >
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full flex items-center justify-center">
                    {conversation.partner.avatar ? (
                      <img
                        src={conversation.partner.avatar}
                        alt={conversation.partner.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-sm font-medium text-gray-600">
                        {conversation.partner.name.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  {conversation.partner.isOnline && (
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
                  )}
                </div>

                <div className="ml-3 flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-gray-900">
                      {conversation.partner.name}
                    </h3>
                    <span className="text-xs text-gray-500">
                      {formatDate(conversation.timestamp)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 truncate mt-1">
                    {conversation.lastMessage}
                  </p>
                </div>

                {conversation.unreadCount > 0 && (
                  <div className="ml-2 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {conversation.unreadCount}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Chat Partner Header */}
          <div className="p-4 border-b border-gray-200 bg-white sticky top-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full flex items-center justify-center">
                    {chatPartner?.avatar ? (
                      <img
                        src={chatPartner.avatar}
                        alt={chatPartner.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-sm font-medium text-gray-600">
                        {chatPartner?.name?.charAt(0)?.toUpperCase() || "U"}
                      </span>
                    )}
                  </div>
                  {chatPartner?.isOnline && (
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
                  )}
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">
                    {chatPartner?.name || "Unknown User"}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {chatPartner?.isOnline
                      ? "Đang online"
                      : `Hoạt động ${formatTime(
                          chatPartner?.lastSeen || new Date()
                        )}`}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </button>
                <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
                <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div
            className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 relative"
            onScroll={handleScroll}
          >
            {/* Chat date separator */}
            <div className="flex items-center justify-center my-4">
              <div className="bg-gray-200 text-gray-500 text-xs px-3 py-1 rounded-full">
                Hôm nay
              </div>
            </div>
            
            {/* Existing messages code */}
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.sender === currentUser.role
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={`flex max-w-xs lg:max-w-md ${
                    msg.sender === currentUser.role
                      ? "flex-row-reverse"
                      : "flex-row"
                  }`}
                >
                  <div
                    className={`flex-shrink-0 ${
                      msg.sender === currentUser.role ? "ml-2" : "mr-2"
                    }`}
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full flex items-center justify-center">
                      <span className="text-xs font-medium text-gray-600">
                        {msg.sender === currentUser.role
                          ? currentUser.name.charAt(0).toUpperCase()
                          : chatPartner?.name?.charAt(0)?.toUpperCase() || "U"}
                      </span>
                    </div>
                  </div>
                  <div
                    className={`px-4 py-2 rounded-lg ${
                      msg.sender === currentUser.role
                        ? "bg-blue-600 text-white"
                        : "bg-white text-gray-800 border border-gray-200"
                    }`}
                  >
                    {msg.type === "file" && (
                      <div className="flex items-center space-x-2 mb-1">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                        <span className="text-xs">{msg.fileName}</span>
                      </div>
                    )}
                    <p className="text-sm">{msg.content}</p>
                    <p
                      className={`text-xs mt-1 ${
                        msg.sender === currentUser.role
                          ? "text-blue-100"
                          : "text-gray-500"
                      }`}
                    >
                      {formatTime(msg.timestamp)}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="flex">
                  <div className="flex-shrink-0 mr-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full flex items-center justify-center">
                      <span className="text-xs font-medium text-gray-600">
                        {chatPartner?.name?.charAt(0)?.toUpperCase() || "U"}
                      </span>
                    </div>
                  </div>
                  <div className="bg-white text-gray-800 border border-gray-200 px-4 py-2 rounded-lg">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />

            {/* Scroll to bottom button */}
            <div className="absolute bottom-4 right-4">
              <button
                onClick={() => {
                  messagesEndRef.current?.scrollIntoView({
                    behavior: "smooth",
                  });
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full shadow-lg transition-colors"
                title="Cuộn xuống tin nhắn mới nhất"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 14l-7 7m0 0l-7-7m7 7V3"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-gray-200 bg-white">
            <div className="flex items-center space-x-2">
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={handleFileUpload}
                accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
              />
              <div className="flex space-x-1">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
                  title="Đính kèm file"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                    />
                  </svg>
                </button>
                <button
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
                  title="Thêm emoji"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </button>
              </div>
              <input
                type="text"
                placeholder="Nhập tin nhắn..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleInputKeyDown}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim()}
                className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
