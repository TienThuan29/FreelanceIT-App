"use client";

import React from "react";
import Image from 'next/image'
import { 
  FaGraduationCap, 
  FaExclamationTriangle, 
  FaLightbulb, 
  FaShoppingCart, 
  FaClipboardList, 
  FaRobot, 
  FaUsers, 
  FaMoneyBillWave, 
  FaBullseye, 
  FaDollarSign, 
  FaBolt, 
  FaShieldAlt,
  FaCheck
} from 'react-icons/fa'

export default function Page() {
  return (
    <>
      <div className="min-h-screen bg-white">
        {/* Software Banner - Modern Tech Style */}
        <div className="bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 text-white py-16 md:py-24 relative overflow-hidden">
          {/* Background decorations */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-blue-400/5 to-transparent"></div>
          <div className="absolute bottom-0 left-0 w-full h-full bg-gradient-to-t from-blue-400/5 to-transparent"></div>
          
          {/* Abstract lines and dots */}
          <div className="absolute inset-0">
            <div className="absolute top-20 left-20 w-32 h-0.5 bg-blue-400/30 rotate-12"></div>
            <div className="absolute top-32 right-32 w-24 h-0.5 bg-purple-400/30 -rotate-12"></div>
            <div className="absolute bottom-32 left-40 w-40 h-0.5 bg-blue-300/20 rotate-45"></div>
            <div className="absolute top-40 right-20 w-2 h-2 bg-blue-400/40 rounded-full"></div>
            <div className="absolute bottom-40 left-60 w-1.5 h-1.5 bg-purple-400/40 rounded-full"></div>
            <div className="absolute top-60 left-80 w-1 h-1 bg-blue-300/50 rounded-full"></div>
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left Section - Text Content */}
              <div>
                {/* Logo */}
                <div className="text-white text-sm font-light mb-8">Support: exe.chonccgroup@gmail.com</div>
                
                {/* Main heading */}
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                  <span className="text-white">SOFTWARE</span><br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">
                    MARKETPLACE & FREELANCER
                  </span>
                </h1>
                
                {/* Description */}
                <p className="text-gray-300 text-lg md:text-xl mb-8 leading-relaxed max-w-lg">
                  Kết nối ITers với cơ hội việc làm, mua bán phần mềm và dự án phù hợp. 
                  Nền tảng toàn diện cho ngành công nghệ thông tin.
                </p>
                
                {/* Call to action */}
                <a
                  href="/register"
                  className="inline-block bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg"
                >
                  Khám phá ngay
                </a>
              </div>

              {/* Right Section - Visual Elements */}
              <div className="relative">
                {/* Laptop */}
                <div className="relative mx-auto max-w-md">
                  {/* Laptop base */}
                  <div className="bg-gray-800 rounded-lg p-2 shadow-2xl">
                    <div className="bg-black rounded-lg p-4">
                      {/* Screen content - Data table */}
                      <div className="bg-gray-900 rounded p-3 mb-3">
                        <div className="grid grid-cols-4 gap-2 text-xs">
                          <div className="bg-blue-600/20 border border-pink-400/30 rounded p-1 text-center text-pink-300">ID</div>
                          <div className="bg-blue-600/20 border border-pink-400/30 rounded p-1 text-center text-pink-300">Name</div>
                          <div className="bg-blue-600/20 border border-pink-400/30 rounded p-1 text-center text-pink-300">Skill</div>
                          <div className="bg-blue-600/20 border border-pink-400/30 rounded p-1 text-center text-pink-300">Price</div>
                          <div className="bg-gray-800 border border-blue-400/30 rounded p-1 text-center text-blue-300">001</div>
                          <div className="bg-gray-800 border border-blue-400/30 rounded p-1 text-center text-blue-300">John</div>
                          <div className="bg-gray-800 border border-blue-400/30 rounded p-1 text-center text-blue-300">React</div>
                          <div className="bg-gray-800 border border-blue-400/30 rounded p-1 text-center text-blue-300">$50</div>
                          <div className="bg-gray-800 border border-blue-400/30 rounded p-1 text-center text-blue-300">002</div>
                          <div className="bg-gray-800 border border-blue-400/30 rounded p-1 text-center text-blue-300">Sarah</div>
                          <div className="bg-gray-800 border border-blue-400/30 rounded p-1 text-center text-blue-300">Python</div>
                          <div className="bg-gray-800 border border-blue-400/30 rounded p-1 text-center text-blue-300">$75</div>
                        </div>
                      </div>
                      
                      {/* Chart widget */}
                      <div className="absolute top-4 right-4 bg-gray-800/90 backdrop-blur-sm border border-pink-400/50 rounded-lg p-3 w-24 h-20">
                        <div className="flex items-end justify-between h-full">
                          <div className="bg-blue-400 w-2 h-8 rounded-t"></div>
                          <div className="bg-pink-400 w-2 h-6 rounded-t"></div>
                          <div className="bg-blue-300 w-2 h-4 rounded-t"></div>
                        </div>
                        <div className="absolute top-1 left-1 w-4 h-4 border-2 border-pink-400 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating data blocks */}
                <div className="absolute top-10 -left-8">
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 w-12 h-8 rounded transform rotate-12 animate-pulse"></div>
                </div>
                <div className="absolute top-20 -right-4">
                  <div className="bg-gradient-to-r from-pink-500 to-pink-600 w-10 h-6 rounded transform -rotate-12 animate-pulse delay-100"></div>
                </div>
                <div className="absolute bottom-20 -left-6">
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 w-8 h-12 rounded transform rotate-45 animate-pulse delay-200"></div>
                </div>
                <div className="absolute bottom-10 -right-8">
                  <div className="bg-gradient-to-r from-pink-500 to-pink-600 w-14 h-6 rounded transform -rotate-12 animate-pulse delay-300"></div>
                </div>
                <div className="absolute top-32 left-4">
                  <div className="bg-gradient-to-r from-blue-400 to-blue-500 w-6 h-10 rounded transform rotate-12 animate-pulse delay-150"></div>
                </div>

                {/* Chevron arrows */}
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
                  <div className="flex space-x-1">
                    <div className="w-0 h-0 border-l-2 border-r-2 border-b-4 border-transparent border-b-blue-400"></div>
                    <div className="w-0 h-0 border-l-2 border-r-2 border-b-4 border-transparent border-b-blue-400"></div>
                    <div className="w-0 h-0 border-l-2 border-r-2 border-b-4 border-transparent border-b-blue-400"></div>
                  </div>
                </div>
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2">
                  <div className="flex flex-col space-y-1">
                    <div className="w-0 h-0 border-t-2 border-b-2 border-r-4 border-transparent border-r-blue-300"></div>
                    <div className="w-0 h-0 border-t-2 border-b-2 border-r-4 border-transparent border-r-blue-300"></div>
                     <div className="w-0 h-0 border-t-2 border-b-2 border-r-4 border-transparent border-r-blue-300"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Hero Section - Student Project Focus */}
        <section className="bg-gradient-to-br from-blue-50 via-sky-50 to-indigo-100 py-24 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400/5 to-indigo-400/5"></div>
          <div className="absolute top-10 right-10 w-72 h-72 bg-blue-200/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 left-10 w-96 h-96 bg-indigo-200/20 rounded-full blur-3xl"></div>
          
          <div className="container mx-auto">
            <div className="max-w-10xl mx-auto">
              {/* Section Title */}
              <div className="text-center mb-16">
                <div className="inline-block bg-white/20 backdrop-blur-sm px-6 py-2 rounded-full text-sm font-semibold mb-6 border border-blue-200">
                  <span className="text-blue-700">Phân tích ngành & Giải pháp</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 leading-tight">
                  Giải quyết thách thức <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-600">ngành phần mềm</span>
                </h2>
                <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                  Hiểu rõ bối cảnh hiện tại và cung cấp giải pháp cấp doanh nghiệp cho hệ sinh thái phát triển phần mềm đang phát triển
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div className="space-y-8">
                  <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-red-200 hover:shadow-2xl transition-all duration-300">
                    <div className="flex items-center mb-6">
                      <div className="w-16 h-16 bg-gradient-to-br from-red-100 to-red-200 rounded-2xl flex items-center justify-center mr-6 shadow-lg">
                        <FaExclamationTriangle className="text-red-600 text-3xl" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">Thách thức ngành</h3>
                        <div className="w-16 h-1 bg-gradient-to-r from-red-500 to-red-600 rounded-full"></div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="bg-red-50 rounded-xl p-4 border-l-4 border-red-500">
                        <h4 className="font-semibold text-red-800 mb-2">Cạnh tranh cao & Sa thải</h4>
                        <p className="text-red-700 text-sm">
                          Tự động hóa AI ngày càng tăng và bão hòa thị trường dẫn đến tình trạng bấp bênh việc làm cho các chuyên gia phần mềm
                        </p>
                      </div>
                      <div className="bg-red-50 rounded-xl p-4 border-l-4 border-red-500">
                        <h4 className="font-semibold text-red-800 mb-2">Phân mảnh thị trường Freelance</h4>
                        <p className="text-red-700 text-sm">
                          Khó khăn trong việc tìm kiếm dự án chất lượng và khách hàng đáng tin cậy trên các nền tảng freelance rải rác
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-green-200 hover:shadow-2xl transition-all duration-300">
                    <div className="flex items-center mb-6">
                      <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl flex items-center justify-center mr-6 shadow-lg">
                        <FaLightbulb className="text-green-600 text-3xl" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">Giải pháp của chúng tôi</h3>
                        <div className="w-16 h-1 bg-gradient-to-r from-green-500 to-green-600 rounded-full"></div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="bg-green-50 rounded-xl p-4 border-l-4 border-green-500">
                        <h4 className="font-semibold text-green-800 mb-2">Thị trường phần mềm doanh nghiệp</h4>
                        <p className="text-green-700 text-sm">
                          Nền tảng chuyên nghiệp để mua, bán và cấp phép các giải pháp phần mềm cấp doanh nghiệp
                        </p>
                      </div>
                      <div className="bg-green-50 rounded-xl p-4 border-l-4 border-green-500">
                        <h4 className="font-semibold text-green-800 mb-2">Ghép nối nhân tài bằng AI</h4>
                        <p className="text-green-700 text-sm">
                          Thuật toán thông minh ghép nối các nhà phát triển với dự án dựa trên kỹ năng, kinh nghiệm và yêu cầu dự án
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-10 shadow-2xl border border-blue-200 hover:shadow-3xl transition-all duration-300">
                  <div className="text-center mb-8">
                    <h3 className="text-3xl font-bold text-gray-900 mb-3">Tính năng cốt lõi của nền tảng</h3>
                    <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full mx-auto"></div>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-6">
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200 hover:shadow-lg transition-all duration-300">
                      <div className="flex items-center mb-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mr-4 shadow-lg">
                          <FaShoppingCart className="text-white text-xl" />
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900 text-lg">Thị trường phần mềm</h4>
                          <p className="text-gray-600 text-sm">Cấp phép và phân phối phần mềm cấp doanh nghiệp</p>
                        </div>
                      </div>
                      <p className="text-gray-700 text-sm ml-16">
                        Mua, bán và cấp phép các giải pháp phần mềm chuyên nghiệp với giao dịch an toàn và bảo vệ sở hữu trí tuệ
                      </p>
                    </div>
                    
                    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-200 hover:shadow-lg transition-all duration-300">
                      <div className="flex items-center mb-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center mr-4 shadow-lg">
                          <FaClipboardList className="text-white text-xl" />
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900 text-lg">Trung tâm quản lý dự án</h4>
                          <p className="text-gray-600 text-sm">Quản lý toàn diện vòng đời dự án</p>
                        </div>
                      </div>
                      <p className="text-gray-700 text-sm ml-16">
                        Đăng dự án, quản lý thời gian, theo dõi kết quả và cộng tác với các nhóm phát triển phân tán
                      </p>
                    </div>
                    
                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200 hover:shadow-lg transition-all duration-300">
                      <div className="flex items-center mb-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mr-4 shadow-lg">
                          <FaRobot className="text-white text-xl" />
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900 text-lg">Ghép nối bằng AI</h4>
                          <p className="text-gray-600 text-sm">Ghép nối nhân tài và dự án thông minh</p>
                        </div>
                      </div>
                      <p className="text-gray-700 text-sm ml-16">
                        Thuật toán ML tiên tiến phân tích kỹ năng, yêu cầu dự án và tính tương thích để có kết quả ghép nối tối ưu
                      </p>
                    </div>
                    
                    <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-2xl p-6 border border-pink-200 hover:shadow-lg transition-all duration-300">
                      <div className="flex items-center mb-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl flex items-center justify-center mr-4 shadow-lg">
                          <FaUsers className="text-white text-xl" />
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900 text-lg">Không gian làm việc cộng tác</h4>
                          <p className="text-gray-600 text-sm">Hình thành nhóm và cộng tác dự án</p>
                        </div>
                      </div>
                      <p className="text-gray-700 text-sm ml-16">
                        Hình thành các nhóm đa chức năng, quản lý quy trình làm việc linh hoạt và phối hợp các dự án phát triển phần mềm phức tạp
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-10xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
                  Cách thức <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-600">hoạt động</span>
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Nền tảng kết nối ITers với khách hàng một cách thông minh và hiệu quả
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="text-center group">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <FaShoppingCart className="text-white text-2xl" />
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-gray-900">Mua bán phần mềm</h3>
                  <p className="text-gray-600 leading-relaxed">
                    ITers có thể đăng bán các sản phẩm phần mềm của mình với mức giá hợp lý
                  </p>
                </div>

                <div className="text-center group">
                  <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <FaClipboardList className="text-white text-2xl" />
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-gray-900">Đăng dự án</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Khách hàng đăng yêu cầu dự án với mô tả chi tiết và ngân sách
                  </p>
                </div>

                <div className="text-center group">
                  <div className="w-20 h-20 bg-gradient-to-br from-sky-500 to-sky-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <FaRobot className="text-white text-2xl" />
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-gray-900">AI gợi ý</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Hệ thống AI phân tích yêu cầu và gợi ý ITers phù hợp nhất
                  </p>
                </div>

                <div className="text-center group">
                  <div className="w-20 h-20 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <FaUsers className="text-white text-2xl" />
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-gray-900">Làm việc nhóm</h3>
                  <p className="text-gray-600 leading-relaxed">
                    ITers có thể kết hợp thành team để thực hiện dự án lớn
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* AI Integration Section */}
        <section className="py-24 bg-gradient-to-br from-blue-50 via-white to-indigo-50 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-blue-400/5 to-indigo-400/5"></div>
          <div className="absolute top-20 right-20 w-64 h-64 bg-blue-200/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-20 w-80 h-80 bg-indigo-200/20 rounded-full blur-3xl"></div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <div>
                  <h2 className="text-4xl md:text-5xl font-bold mb-8 text-gray-900">
                    Tích hợp <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-600">AI thông minh</span>
                  </h2>
                  <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                    Hệ thống AI của chúng tôi phân tích yêu cầu dự án và gợi ý ITers phù hợp nhất dựa trên:
                  </p>
                  
                  <div className="space-y-6">
                    <div className="flex items-start">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-4 mt-1">
                        <FaCheck className="text-white text-sm" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Công nghệ sử dụng</h3>
                        <p className="text-gray-600">Phân tích ngôn ngữ lập trình, framework, database phù hợp</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-4 mt-1">
                        <FaCheck className="text-white text-sm" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Loại dự án</h3>
                        <p className="text-gray-600">Mobile app, website, desktop app, AI/ML, blockchain...</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-4 mt-1">
                        <FaCheck className="text-white text-sm" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Mức giá</h3>
                        <p className="text-gray-600">Tìm ITers phù hợp với ngân sách dự án</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-4 mt-1">
                        <FaCheck className="text-white text-sm" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Kinh nghiệm</h3>
                        <p className="text-gray-600">Đánh giá skill level và kinh nghiệm làm việc</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-blue-100">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Ví dụ AI gợi ý</h3>
                  <div className="space-y-4">
                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="text-sm text-gray-500 mb-2">Yêu cầu:</p>
                      <p className="text-gray-800 font-medium">"Cần làm app mobile React Native, ngân sách 10-15 triệu"</p>
                    </div>
                    <div className="text-center text-gray-400">↓</div>
                    <div className="bg-blue-50 rounded-xl p-4">
                      <p className="text-sm text-blue-600 mb-2">AI gợi ý:</p>
                      <p className="text-gray-800 font-medium">3 ITers phù hợp với React Native, kinh nghiệm 2-3 năm</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
                  Lợi ích của <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-600">nền tảng</span>
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Giải pháp toàn diện cho cả ITers và khách hàng
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-8">Cho ITers</h3>
                  
                  <div className="flex items-start">
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mr-4 mt-1">
                      <FaMoneyBillWave className="text-green-600 text-xl" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Tăng thu nhập</h4>
                      <p className="text-gray-600">Bán sản phẩm phần mềm và nhận dự án phù hợp với kỹ năng</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mr-4 mt-1">
                      <FaBullseye className="text-blue-600 text-xl" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Dự án phù hợp</h4>
                      <p className="text-gray-600">AI gợi ý dự án phù hợp với kinh nghiệm và sở thích</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mr-4 mt-1">
                      <FaUsers className="text-purple-600 text-xl" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Làm việc nhóm</h4>
                      <p className="text-gray-600">Kết hợp với ITers khác để thực hiện dự án lớn</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-8">Cho khách hàng</h3>
                  
                  <div className="flex items-start">
                    <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mr-4 mt-1">
                      <FaDollarSign className="text-orange-600 text-xl" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Tiết kiệm chi phí</h4>
                      <p className="text-gray-600">Mua phần mềm có sẵn hoặc thuê ITers với giá hợp lý</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mr-4 mt-1">
                      <FaBolt className="text-indigo-600 text-xl" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Nhanh chóng</h4>
                      <p className="text-gray-600">AI gợi ý ITers phù hợp, tiết kiệm thời gian tìm kiếm</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center mr-4 mt-1">
                      <FaShieldAlt className="text-teal-600 text-xl" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">An toàn</h4>
                      <p className="text-gray-600">Hệ thống đánh giá và bảo vệ quyền lợi cả hai bên</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section - Modern Tech Banner Style */}
        <section className="py-20 md:py-28 bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 text-white relative overflow-hidden">
          {/* Background decorations */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-blue-400/5 to-transparent"></div>
          <div className="absolute bottom-0 left-0 w-full h-full bg-gradient-to-t from-blue-400/5 to-transparent"></div>
          
          {/* Abstract lines and dots */}
          <div className="absolute inset-0">
            <div className="absolute top-20 left-20 w-32 h-0.5 bg-blue-400/30 rotate-12"></div>
            <div className="absolute top-32 right-32 w-24 h-0.5 bg-purple-400/30 -rotate-12"></div>
            <div className="absolute bottom-32 left-40 w-40 h-0.5 bg-blue-300/20 rotate-45"></div>
            <div className="absolute top-40 right-20 w-2 h-2 bg-blue-400/40 rounded-full"></div>
            <div className="absolute bottom-40 left-60 w-1.5 h-1.5 bg-purple-400/40 rounded-full"></div>
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left Section - Text Content */}
              <div>
                {/* Logo */}
                <div className="text-white text-sm font-light mb-8">FreelanceIT Platform</div>
                
                {/* Main heading */}
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                  <span className="text-white">SẴN SÀNG</span><br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">
                    BẮT ĐẦU?
                  </span>
                </h2>
                
                {/* Description */}
                <p className="text-gray-300 text-lg md:text-xl mb-8 leading-relaxed max-w-lg">
                  Tham gia nền tảng mua bán phần mềm giá rẻ - Giải pháp cho tình trạng layoff trong ngành IT. 
                  Kết nối với cơ hội việc làm và dự án phù hợp.
                </p>
                
                {/* Call to action */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <a
                    href="/register"
                    className="inline-block bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg text-center"
                  >
                    ĐĂNG KÝ NGAY
                  </a>
                  <a
                    href="#how-it-works"
                    className="inline-block bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-blue-600 transition-all duration-300 shadow-lg text-center"
                  >
                    TÌM HIỂU THÊM
                  </a>
                </div>
              </div>

              {/* Right Section - Visual Elements */}
              <div className="relative">
                {/* Success dashboard */}
                <div className="relative mx-auto max-w-md">
                  {/* Dashboard base */}
                  <div className="bg-gray-800 rounded-lg p-2 shadow-2xl">
                    <div className="bg-black rounded-lg p-4">
                      {/* Success metrics */}
                      <div className="bg-gray-900 rounded p-3 mb-3">
                        <div className="grid grid-cols-2 gap-3 text-xs">
                          <div className="bg-green-600/20 border border-green-400/30 rounded p-2 text-center">
                            <div className="text-green-300 font-bold text-lg">1,200+</div>
                            <div className="text-green-400 text-xs">ITers</div>
                          </div>
                          <div className="bg-blue-600/20 border border-blue-400/30 rounded p-2 text-center">
                            <div className="text-blue-300 font-bold text-lg">500+</div>
                            <div className="text-blue-400 text-xs">Projects</div>
                          </div>
                          <div className="bg-purple-600/20 border border-purple-400/30 rounded p-2 text-center">
                            <div className="text-purple-300 font-bold text-lg">300+</div>
                            <div className="text-purple-400 text-xs">Companies</div>
                          </div>
                          <div className="bg-pink-600/20 border border-pink-400/30 rounded p-2 text-center">
                            <div className="text-pink-300 font-bold text-lg">95%</div>
                            <div className="text-pink-400 text-xs">Success</div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Success chart widget */}
                      <div className="absolute top-4 right-4 bg-gray-800/90 backdrop-blur-sm border border-green-400/50 rounded-lg p-3 w-24 h-20">
                        <div className="flex items-end justify-between h-full">
                          <div className="bg-green-400 w-2 h-12 rounded-t"></div>
                          <div className="bg-blue-400 w-2 h-10 rounded-t"></div>
                          <div className="bg-purple-400 w-2 h-8 rounded-t"></div>
                        </div>
                        <div className="absolute top-1 left-1 w-4 h-4 border-2 border-green-400 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating success elements */}
                <div className="absolute top-10 -left-8">
                  <div className="bg-gradient-to-r from-green-500 to-green-600 w-12 h-8 rounded transform rotate-12 animate-pulse"></div>
                </div>
                <div className="absolute top-20 -right-4">
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 w-10 h-6 rounded transform -rotate-12 animate-pulse delay-100"></div>
                </div>
                <div className="absolute bottom-20 -left-6">
                  <div className="bg-gradient-to-r from-purple-500 to-purple-600 w-8 h-12 rounded transform rotate-45 animate-pulse delay-200"></div>
                </div>
                <div className="absolute bottom-10 -right-8">
                  <div className="bg-gradient-to-r from-pink-500 to-pink-600 w-14 h-6 rounded transform -rotate-12 animate-pulse delay-300"></div>
                </div>

                {/* Success arrows */}
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
                  <div className="flex space-x-1">
                    <div className="w-0 h-0 border-l-2 border-r-2 border-b-4 border-transparent border-b-green-400"></div>
                    <div className="w-0 h-0 border-l-2 border-r-2 border-b-4 border-transparent border-b-green-400"></div>
                    <div className="w-0 h-0 border-l-2 border-r-2 border-b-4 border-transparent border-b-green-400"></div>
                  </div>
                </div>
                <div className="absolute right-0 top-1/2 transform -translate-y-1/2">
                  <div className="flex flex-col space-y-1">
                    <div className="w-0 h-0 border-t-2 border-b-2 border-l-4 border-transparent border-l-blue-300"></div>
                    <div className="w-0 h-0 border-t-2 border-b-2 border-l-4 border-transparent border-l-blue-300"></div>
                    <div className="w-0 h-0 border-t-2 border-b-2 border-l-4 border-transparent border-l-blue-300"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}