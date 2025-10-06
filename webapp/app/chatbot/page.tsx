"use client";

import React from "react";
// import ChatBot from '@/components/chatbot';
import { useState, useRef, useEffect } from 'react'
import { mockProducts } from '@/data/mockProducts'
import { useAuth } from "@/contexts/AuthContext";
import { useRoleValidator } from "@/hooks/useRoleValidator";

interface ChatMessage {
  id: number
  type: 'user' | 'bot'
  content: string
  timestamp: Date
  isTyping?: boolean
}

interface ChatSession {
  id: number
  title: string
  messages: ChatMessage[]
  createdAt: Date
  lastActivity: Date
}

export default function ChatBotPage() {
  const { user } = useAuth()
  const { isDeveloper, isCustomer } = useRoleValidator(user)

  const [currentSession, setCurrentSession] = useState<ChatSession>({
    id: 1,
    title: isDeveloper ? 'Hỗ trợ developer' : isCustomer ? 'Hỗ trợ nhà tuyển dụng' : 'Hỗ trợ freelancer mới',
    messages: [
      {
        id: 1,
        type: 'bot',
        content: isDeveloper
          ? 'Xin chào Developer! Tôi là FreeLanceIT Assistant - trợ lý AI của bạn. Tôi có thể giúp bạn về:\n\n• Tìm việc freelance phù hợp\n• Tạo hồ sơ chuyên nghiệp\n• Thương lượng giá và hợp đồng\n• Kỹ năng phát triển nghề nghiệp\n• Tìm hiểu về các dự án tuyển dụng\n\nBạn có câu hỏi gì không?'
          : isCustomer
            ? 'Xin chào nhà tuyển dụng! Tôi là FreeLanceIT Assistant - trợ lý AI của bạn. Tôi có thể giúp bạn về:\n\n• Tìm developer phù hợp\n• Đăng tin tuyển dụng hiệu quả\n• Thương lượng hợp đồng\n• Quản lý dự án\n• Gợi ý sản phẩm/template có sẵn\n\nBạn có câu hỏi gì không?'
            : 'Xin chào! Tôi là FreeLanceIT Assistant - trợ lý AI của bạn. Tôi có thể giúp bạn về:\n\n• Tìm việc freelance IT\n• Tạo hồ sơ chuyên nghiệp\n• Thương lượng giá và hợp đồng\n• Kỹ năng phát triển nghề nghiệp\n• Cách sử dụng platform\n\nBạn có câu hỏi gì không?',
        timestamp: new Date()
      }
    ],
    createdAt: new Date(),
    lastActivity: new Date()
  })

  const [chatHistory, setChatHistory] = useState<ChatSession[]>([
    {
      id: 1,
      title: 'Hỗ trợ freelancer mới',
      messages: [
        {
          id: 1,
          type: 'bot',
          content: 'Xin chào! Tôi là FreeLanceIT Assistant...',
          timestamp: new Date()
        }
      ],
      createdAt: new Date(),
      lastActivity: new Date()
    },
    {
      id: 2,
      title: 'Định giá dịch vụ',
      messages: [
        {
          id: 1,
          type: 'user',
          content: 'Tôi nên định giá dịch vụ như thế nào?',
          timestamp: new Date(Date.now() - 3600000)
        }
      ],
      createdAt: new Date(Date.now() - 3600000),
      lastActivity: new Date(Date.now() - 3600000)
    },
    {
      id: 3,
      title: 'Tạo hồ sơ chuyên nghiệp',
      messages: [
        {
          id: 1,
          type: 'user',
          content: 'Làm thế nào để tạo hồ sơ thu hút?',
          timestamp: new Date(Date.now() - 7200000)
        }
      ],
      createdAt: new Date(Date.now() - 7200000),
      lastActivity: new Date(Date.now() - 7200000)
    }
  ])

  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Predefined responses for common questions
  const botResponses = {
    greeting: [
      isDeveloper ? 'Xin chào Developer! Tôi có thể giúp gì cho bạn hôm nay?' :
        isCustomer ? 'Xin chào nhà tuyển dụng! Tôi có thể hỗ trợ gì cho bạn?' :
          'Xin chào! Tôi có thể giúp gì cho bạn hôm nay?',
      isDeveloper ? 'Chào bạn! Bạn cần hỗ trợ gì về freelancing không?' :
        isCustomer ? 'Chào bạn! Bạn cần tìm developer hay sản phẩm nào không?' :
          'Chào bạn! Bạn cần hỗ trợ gì về freelancing không?',
      'Hello! Tôi là FreeLanceIT Assistant, sẵn sàng giúp đỡ bạn!'
    ],
    howToStart: isDeveloper
      ? 'Để bắt đầu freelancing trên FreeLanceIT:\n\n1. Tạo hồ sơ chuyên nghiệp với kỹ năng và kinh nghiệm\n2. Upload portfolio và các dự án đã làm\n3. Hoàn thành các bài test kỹ năng\n4. Tìm kiếm và apply vào các job phù hợp\n5. Viết proposal chuyên nghiệp\n\nBạn cần hỗ trợ chi tiết bước nào?'
      : isCustomer
        ? 'Để tìm developer phù hợp trên FreeLanceIT:\n\n1. Đăng tin tuyển dụng chi tiết và rõ ràng\n2. Xác định yêu cầu kỹ năng cần thiết\n3. Đặt mức lương hợp lý với thị trường\n4. Review hồ sơ developer và portfolio\n5. Phỏng vấn và test thử\n\nBạn cần hỗ trợ chi tiết bước nào?'
        : 'Để bắt đầu freelancing trên FreeLanceIT:\n\n1. Tạo hồ sơ chuyên nghiệp với kỹ năng và kinh nghiệm\n2. Upload portfolio và các dự án đã làm\n3. Hoàn thành các bài test kỹ năng\n4. Tìm kiếm và apply vào các job phù hợp\n5. Viết proposal chuyên nghiệp\n\nBạn cần hỗ trợ chi tiết bước nào?',
    pricing: 'Về việc định giá freelance:\n\n• Tham khảo mức giá thị trường cho kỹ năng của bạn\n• Tính toán dựa trên kinh nghiệm và chất lượng\n• Xem xét độ phức tạp và thời gian dự án\n• Đề xuất mức giá cạnh tranh nhưng công bằng\n\nMức giá trung bình:\n- Junior: 200-500k VND/ngày\n- Mid-level: 500-1M VND/ngày\n- Senior: 1-2M VND/ngày',
    profile: 'Để tạo hồ sơ thu hút:\n\n• Ảnh đại diện chuyên nghiệp\n• Mô tả ngắn gọn về bản thân và kỹ năng\n• Liệt kê công nghệ thành thạo\n• Showcase portfolio với dự án tốt nhất\n• Highlight achievements và certifications\n• Có testimonials từ khách hàng cũ\n\nBạn muốn tôi review hồ sơ của bạn không?',
    proposal: 'Viết proposal hiệu quả:\n\n• Đọc kỹ job description\n• Personalize cho từng job\n• Highlight relevant experience\n• Đề xuất solution cụ thể\n• Timeline và deliverables rõ ràng\n• Mức giá hợp lý và flexible\n• Call-to-action mạnh mẽ\n\nTemplate proposal mẫu bạn có cần không?',
    skills: 'Kỹ năng IT hot nhất hiện tại:\n\n🔥 **Frontend:**\n- React, Vue.js, Angular\n- TypeScript, Next.js\n- Tailwind CSS, Material-UI\n\n🔥 **Backend:**\n- Node.js, Python, Go\n- Docker, Kubernetes\n- AWS, Azure, GCP\n\n🔥 **Mobile:**\n- React Native, Flutter\n- Swift, Kotlin\n\n🔥 **Data & AI:**\n- Python, R, SQL\n- Machine Learning, AI\n- Data Analytics\n\nBạn muốn học kỹ năng nào?',
    platform: 'Cách sử dụng FreeLanceIT:\n\n• **Dashboard:** Quản lý profile, jobs, earnings\n• **Job Search:** Filter theo kỹ năng, budget, timeline\n• **Messaging:** Chat trực tiếp với clients\n• **Project Management:** Track progress, milestones\n• **Payment:** Escrow system bảo mật\n• **Reviews:** Rating system xây dựng uy tín\n\nBạn cần hướng dẫn chi tiết tính năng nào?'
  }

  const quickReplies = isDeveloper ? [
    'Tìm dự án React phù hợp',
    'Việc làm frontend developer',
    'Dự án Node.js backend',
    'Định giá dịch vụ như thế nào?',
    'Tạo hồ sơ thu hút khách hàng',
    'Viết proposal hiệu quả'
  ] : isCustomer ? [
    'Sản phẩm ecommerce có sẵn',
    'Template website React',
    'App mobile Flutter',
    'Tìm developer React',
    'Đăng tin tuyển dụng hiệu quả',
    'Quản lý dự án thế nào?'
  ] : [
    'Làm thế nào để bắt đầu freelancing?',
    'Định giá dịch vụ như thế nào?',
    'Tạo hồ sơ thu hút khách hàng',
    'Viết proposal hiệu quả',
    'Kỹ năng IT nào đang hot?',
    'Hướng dẫn sử dụng platform'
  ]

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [currentSession.messages])

  // Function to get product suggestions for employers
  const getProductSuggestions = (keywords: string[]) => {
    const suggestions = mockProducts.filter(product =>
      keywords.some(keyword =>
        product.title.toLowerCase().includes(keyword.toLowerCase()) ||
        product.description.toLowerCase().includes(keyword.toLowerCase()) ||
        product.tags.some(tag => tag.toLowerCase().includes(keyword.toLowerCase())) ||
        product.techStack.some(tech => tech.toLowerCase().includes(keyword.toLowerCase()))
      )
    ).slice(0, 3)

    if (suggestions.length > 0) {
      let response = 'Tôi tìm thấy một số sản phẩm/template có sẵn phù hợp với nhu cầu của bạn:\n\n'
      suggestions.forEach((product, index) => {
        response += `${index + 1}. **${product.title}**\n`
        response += `💰 Giá: ${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}\n`
        response += `🔧 Tech Stack: ${product.techStack.slice(0, 3).join(', ')}\n`
        response += `👁️ Xem chi tiết: http://localhost:5173/products-detail/${product.id}\n\n`
      })
      response += 'Bạn có muốn xem thêm sản phẩm khác không?'
      return response
    }
    return null
  }

  // Function to get project suggestions for developers
  const getProjectSuggestions = (keywords: string[]) => {
    const suggestions = mockProjects.filter(project =>
      project.status === 'open' &&
      keywords.some(keyword =>
        project.title.toLowerCase().includes(keyword.toLowerCase()) ||
        project.description.toLowerCase().includes(keyword.toLowerCase()) ||
        project.skills.some(skill => skill.toLowerCase().includes(keyword.toLowerCase())) ||
        (project.type && project.type.toLowerCase().includes(keyword.toLowerCase()))
      )
    ).slice(0, 3)

    if (suggestions.length > 0) {
      let response = 'Tôi tìm thấy một số dự án tuyển dụng phù hợp với kỹ năng của bạn:\n\n'
      suggestions.forEach((project, index) => {
        response += `${index + 1}. **${project.title}**\n`
        response += `Ngân sách: ${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(project.budget)}\n`
        response += `Thời hạn: ${project.deadline.toLocaleDateString('vi-VN')}\n`
        response += `Kỹ năng: ${project.skills.slice(0, 3).join(', ')}\n`
        response += `Xem chi tiết: http://localhost:5173/post-detail/${project.id}\n\n`
      })
      response += 'Bạn có muốn xem thêm dự án khác không?'
      return response
    }
    return null
  }

  const getBotResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase()

    if (message.includes('xin chào') || message.includes('hello') || message.includes('hi')) {
      return botResponses.greeting[Math.floor(Math.random() * botResponses.greeting.length)]
    }

    if (message.includes('bắt đầu') || message.includes('start') || message.includes('mới')) {
      return botResponses.howToStart
    }

    if (message.includes('giá') || message.includes('price') || message.includes('định giá')) {
      return botResponses.pricing
    }

    if (message.includes('hồ sơ') || message.includes('profile') || message.includes('cv')) {
      return botResponses.profile
    }

    if (message.includes('proposal') || message.includes('đề xuất') || message.includes('apply')) {
      return botResponses.proposal
    }

    if (message.includes('kỹ năng') || message.includes('skill') || message.includes('công nghệ')) {
      return botResponses.skills
    }

    if (message.includes('platform') || message.includes('website') || message.includes('sử dụng')) {
      return botResponses.platform
    }

    // Product suggestions for employers
    if (isCustomer && (message.includes('sản phẩm') || message.includes('template') || message.includes('có sẵn'))) {
      const keywords = []
      if (message.includes('ecommerce') || message.includes('bán hàng')) keywords.push('ecommerce', 'shop')
      if (message.includes('website') || message.includes('web')) keywords.push('website', 'web')
      if (message.includes('mobile') || message.includes('app')) keywords.push('mobile', 'app')
      if (message.includes('react')) keywords.push('react')
      if (message.includes('vue')) keywords.push('vue')
      if (message.includes('angular')) keywords.push('angular')
      if (message.includes('node')) keywords.push('node')
      if (message.includes('php')) keywords.push('php')
      if (message.includes('python')) keywords.push('python')

      if (keywords.length === 0) keywords.push('template', 'website', 'app')

      const suggestion = getProductSuggestions(keywords)
      if (suggestion) return suggestion
    }

    // Project suggestions for developers
    if (isDeveloper && (message.includes('dự án') || message.includes('việc') || message.includes('tuyển dụng') || message.includes('job'))) {
      const keywords = []
      if (message.includes('react')) keywords.push('react')
      if (message.includes('vue')) keywords.push('vue')
      if (message.includes('angular')) keywords.push('angular')
      if (message.includes('node')) keywords.push('node')
      if (message.includes('php')) keywords.push('php')
      if (message.includes('python')) keywords.push('python')
      if (message.includes('mobile') || message.includes('app')) keywords.push('mobile', 'app')
      if (message.includes('website') || message.includes('web')) keywords.push('web')
      if (message.includes('ecommerce') || message.includes('bán hàng')) keywords.push('ecommerce')
      if (message.includes('backend')) keywords.push('backend')
      if (message.includes('frontend')) keywords.push('frontend')
      if (message.includes('fullstack')) keywords.push('fullstack')

      if (keywords.length === 0) keywords.push('development', 'web', 'app')

      const suggestion = getProjectSuggestions(keywords)
      if (suggestion) return suggestion
    }

    return isDeveloper
      ? 'Cảm ơn bạn đã hỏi! Tôi có thể giúp bạn về:\n\n• Tìm việc freelance IT\n• Tạo hồ sơ chuyên nghiệp\n• Định giá dịch vụ\n• Viết proposal\n• Tìm dự án phù hợp với kỹ năng\n• Phát triển kỹ năng\n\nHãy hỏi tôi về "dự án React" hoặc "việc làm frontend" để tìm cơ hội phù hợp!'
      : isCustomer
        ? 'Cảm ơn bạn đã hỏi! Tôi có thể giúp bạn về:\n\n• Tìm developer phù hợp\n• Đăng tin tuyển dụng\n• Gợi ý sản phẩm/template có sẵn\n• Quản lý dự án\n• Thương lượng hợp đồng\n\nHãy hỏi tôi về "sản phẩm ecommerce" hoặc "template website" để tìm giải pháp nhanh!'
        : 'Cảm ơn bạn đã hỏi! Tôi có thể giúp bạn về:\n\n• Tìm việc freelance IT\n• Tạo hồ sơ chuyên nghiệp\n• Định giá dịch vụ\n• Viết proposal\n• Phát triển kỹ năng\n• Sử dụng platform\n\nBạn có thể hỏi cụ thể hơn hoặc chọn từ các câu hỏi gợi ý bên dưới.'
  }

  const handleSend = () => {
    if (input.trim() === '') return

    const userMessage: ChatMessage = {
      id: currentSession.messages.length + 1,
      type: 'user',
      content: input,
      timestamp: new Date()
    }

    const updatedSession = {
      ...currentSession,
      messages: [...currentSession.messages, userMessage],
      lastActivity: new Date()
    }

    setCurrentSession(updatedSession)
    updateChatHistory(updatedSession)
    setInput('')
    setIsTyping(true)

    setTimeout(() => {
      const botResponse = getBotResponse(input)
      const botMessage: ChatMessage = {
        id: updatedSession.messages.length + 1,
        type: 'bot',
        content: botResponse,
        timestamp: new Date()
      }

      const finalSession = {
        ...updatedSession,
        messages: [...updatedSession.messages, botMessage],
        lastActivity: new Date()
      }

      setCurrentSession(finalSession)
      updateChatHistory(finalSession)
      setIsTyping(false)
    }, 1000 + Math.random() * 1000)
  }

  const updateChatHistory = (session: ChatSession) => {
    setChatHistory(prev => {
      const existingIndex = prev.findIndex(s => s.id === session.id)
      if (existingIndex >= 0) {
        const updated = [...prev]
        updated[existingIndex] = session
        return updated
      }
      return [session, ...prev]
    })
  }

  const handleQuickReply = (reply: string) => {
    setInput(reply)
    setTimeout(() => {
      handleSend()
    }, 100)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSend()
    }
  }

  const createNewChat = () => {
    const newSession: ChatSession = {
      id: Date.now(),
      title: 'Cuộc hội thoại mới',
      messages: [
        {
          id: 1,
          type: 'bot',
          content: 'Xin chào! Tôi là FreeLanceIT Assistant - trợ lý AI của bạn. Tôi có thể giúp bạn về:\n\n• Tìm việc freelance IT\n• Tạo hồ sơ chuyên nghiệp\n• Thương lượng giá và hợp đồng\n• Kỹ năng phát triển nghề nghiệp\n• Cách sử dụng platform\n\nBạn có câu hỏi gì không?',
          timestamp: new Date()
        }
      ],
      createdAt: new Date(),
      lastActivity: new Date()
    }
    setCurrentSession(newSession)
    setChatHistory(prev => [newSession, ...prev])
  }

  const selectChatSession = (session: ChatSession) => {
    setCurrentSession(session)
  }

  const deleteChatSession = (sessionId: number) => {
    setChatHistory(prev => prev.filter(s => s.id !== sessionId))
    if (currentSession.id === sessionId) {
      const remaining = chatHistory.filter(s => s.id !== sessionId)
      if (remaining.length > 0) {
        setCurrentSession(remaining[0])
      } else {
        createNewChat()
      }
    }
  }

  const formatTime = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)

    if (days > 0) return `${days} ngày trước`
    if (hours > 0) return `${hours} giờ trước`
    if (minutes > 0) return `${minutes} phút trước`
    return 'Vừa xong'
  }

  // Function to render message content with clickable links
  const renderMessageContent = (content: string) => {
    // Regex to find URLs in the content
    const urlRegex = /(https?:\/\/[^\s]+)/g
    const parts = content.split(urlRegex)

    return parts.map((part, index) => {
      if (part.match(urlRegex)) {
        return (
          <a
            key={index}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 underline break-all"
            onClick={(e) => {
              e.preventDefault()
              window.open(part, '_blank', 'noopener,noreferrer')
            }}
          >
            {part}
          </a>
        )
      }
      return part
    })
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-gray-50">
      {/* Main app container with full height */}
      <div className="flex flex-1 h-full overflow-hidden">
        {/* Left Sidebar - Full height */}
        <div 
          className={`fixed left-0 top-0 h-screen w-80 bg-white border-r border-gray-200 shadow-lg transition-transform duration-300 z-40 ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="flex flex-col h-full">
            {/* Sidebar Header */}
            <div className="p-4 border-b border-gray-200 bg-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900">Trò chuyện</h2>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={createNewChat}
                    className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors"
                    title="Tạo cuộc hội thoại mới"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setIsSidebarOpen(false)}
                    className="p-2 text-gray-500 hover:text-gray-700 transition-colors lg:hidden"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Chat Sessions List with proper scrolling */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {chatHistory.map(session => (
                <div
                  key={session.id}
                  className={`group relative cursor-pointer p-3 rounded-lg border transition-all hover:shadow-md ${
                    session.id === currentSession.id
                      ? 'bg-blue-50 border-blue-200 shadow-sm'
                      : 'bg-white border-gray-100 hover:bg-gray-50'
                  }`}
                  onClick={() => selectChatSession(session)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-900 truncate">
                        {session.title}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatTime(session.lastActivity)}
                      </p>
                      {session.messages.length > 1 && (
                        <p className="text-xs text-gray-600 mt-1 truncate">
                          {session.messages[session.messages.length - 1].content.substring(0, 50)}...
                        </p>
                      )}
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteChatSession(session.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-all"
                      title="Xóa cuộc hội thoại"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Chat Area */}
        <div 
          className={`flex-1 flex flex-col h-full transition-all duration-300 ${
            isSidebarOpen ? 'ml-80' : 'ml-0'
          }`}
        >
          {/* Sticky Chat Header - Will stay fixed while scrolling */}
          <div className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
            <div className="px-6 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <div>
                    <h1 className="text-lg font-bold text-gray-900">FreeLanceIT Assistant</h1>
                    <p className="text-sm text-gray-600">
                      {isDeveloper ? 'Trợ lý AI hỗ trợ Developer 24/7' :
                        isCustomer ? 'Trợ lý AI hỗ trợ Nhà tuyển dụng 24/7' :
                          'Trợ lý AI hỗ trợ freelancer 24/7'}
                    </p>
                  </div>
                </div>

                {/* Toggle Sidebar Button */}
                <button
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
                  title="Toggle sidebar"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>

              {/* Example Questions for Current Role */}
              <div className="mt-3 border-t border-gray-100 pt-3">
                <details className="group">
                  <summary className="cursor-pointer text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center space-x-1">
                    <span>💡 Ví dụ câu hỏi cho {isDeveloper ? 'Developer' : isCustomer ? 'Nhà tuyển dụng' : 'Freelancer'}</span>
                    <svg className="w-4 h-4 transform group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <div className="mt-2 text-xs text-gray-600 space-y-1">
                    {isDeveloper ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <div>
                          <p className="font-medium text-green-600 mb-1">🔍 Tìm dự án:</p>
                          <p>"Tìm dự án React phù hợp"</p>
                          <p>"Việc làm frontend developer"</p>
                          <p>"Dự án Node.js backend"</p>
                          <p>"Job fullstack với MongoDB"</p>
                        </div>
                        <div>
                          <p className="font-medium text-blue-600 mb-1">Kỹ năng & Hồ sơ:</p>
                          <p>"Định giá dịch vụ như thế nào?"</p>
                          <p>"Tạo hồ sơ thu hút khách hàng"</p>
                          <p>"Viết proposal hiệu quả"</p>
                          <p>"Kỹ năng IT nào đang hot?"</p>
                        </div>
                      </div>
                    ) : isCustomer ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <div>
                          <p className="font-medium text-purple-600 mb-1">🛍️ Sản phẩm có sẵn:</p>
                          <p>"Sản phẩm ecommerce có sẵn"</p>
                          <p>"Template website React"</p>
                          <p>"App mobile Flutter"</p>
                          <p>"Template bán hàng"</p>
                        </div>
                        <div>
                          <p className="font-medium text-orange-600 mb-1">👨‍💻 Tìm Developer:</p>
                          <p>"Tìm developer React"</p>
                          <p>"Đăng tin tuyển dụng hiệu quả"</p>
                          <p>"Quản lý dự án thế nào?"</p>
                          <p>"Developer backend Python"</p>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <div>
                          <p className="font-medium text-blue-600 mb-1">🚀 Bắt đầu:</p>
                          <p>"Làm thế nào để bắt đầu freelancing?"</p>
                          <p>"Định giá dịch vụ như thế nào?"</p>
                          <p>"Tạo hồ sơ thu hút khách hàng"</p>
                        </div>
                        <div>
                          <p className="font-medium text-green-600 mb-1">📈 Phát triển:</p>
                          <p>"Viết proposal hiệu quả"</p>
                          <p>"Kỹ năng IT nào đang hot?"</p>
                          <p>"Hướng dẫn sử dụng platform"</p>
                        </div>
                      </div>
                    )}
                  </div>
                </details>
              </div>
            </div>
          </div>

          {/* Chat Messages Area with proper scrolling */}
          <div className="flex-1 overflow-y-auto bg-gray-50">
            <div className="p-6 space-y-6 pb-32">
              {currentSession.messages.map(message => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-start space-x-3 max-w-2xl ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    {/* Avatar */}
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.type === 'user'
                        ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md'
                        : 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-600 border border-gray-200'
                    }`}>
                      {message.type === 'user' ? (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                      )}
                    </div>

                    {/* Message */}
                    <div className={`px-4 py-3 rounded-2xl shadow-sm ${
                      message.type === 'user'
                        ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white'
                        : 'bg-white text-gray-800 border border-gray-100'
                    }`}>
                      <div className="text-sm whitespace-pre-line leading-relaxed">
                        {renderMessageContent(message.content)}
                      </div>
                      <p className={`text-xs mt-1 ${
                        message.type === 'user' ? 'text-blue-100' : 'text-gray-400'
                      }`}>
                        {message.timestamp.toLocaleTimeString('vi-VN', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}

              {/* Typing indicator */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex items-start space-x-3 max-w-2xl">
                    <div className="w-9 h-9 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-600 rounded-full flex items-center justify-center flex-shrink-0 border border-gray-200">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                    <div className="bg-white text-gray-800 border border-gray-100 px-4 py-3 rounded-2xl shadow-sm">
                      <div className="flex items-center space-x-2">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                        <span className="text-sm text-gray-500">AI đang suy nghĩ...</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Fixed Input Area */}
          <div className="border-t border-gray-200 bg-white shadow-lg">
            {/* Quick Replies */}
            <div className="px-4 py-3 border-b border-gray-100">
              <div className="flex overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 gap-2">
                {quickReplies.map((reply, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickReply(reply)}
                    className="text-xs whitespace-nowrap bg-gray-50 text-gray-700 px-3 py-2 rounded-full hover:bg-blue-50 hover:text-blue-600 transition-colors border border-gray-200 hover:border-blue-200 flex-shrink-0"
                  >
                    {reply}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Area */}
            <div className="p-4">
              <div className="flex items-center space-x-3">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    placeholder="Nhập câu hỏi của bạn..."
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                  <button
                    onClick={handleSend}
                    disabled={!input.trim()}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  )
}
