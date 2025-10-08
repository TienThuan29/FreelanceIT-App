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
        {/* Hero Section - Student Project Focus */}
        <section className="bg-gradient-to-br from-blue-50 via-sky-50 to-indigo-100 py-24 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400/5 to-indigo-400/5"></div>
          <div className="absolute top-10 right-10 w-72 h-72 bg-blue-200/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 left-10 w-96 h-96 bg-indigo-200/20 rounded-full blur-3xl"></div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                {/* <div className="inline-block bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-semibold mb-6 flex items-center">
                  <FaGraduationCap className="mr-2" /> Dự án sinh viên - Giải pháp cho ngành IT
                </div> */}
                
                <h1 className="text-5xl md:text-7xl font-bold mb-8 text-gray-900 leading-tight">
                  Nền tảng <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-600">kết nối ITers</span> với dự án
                </h1>
                
                <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-5xl mx-auto leading-relaxed">
                  Giải pháp cho tình trạng layoff trong ngành IT - Kết nối ITers với cơ hội việc làm và dự án phần mềm
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div className="space-y-8">
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-blue-100">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mr-4">
                        <FaExclamationTriangle className="text-red-600 text-2xl" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">Vấn đề hiện tại</h3>
                    </div>
                    <p className="text-gray-600 leading-relaxed">
                      Tình trạng layoff trong ngành IT ngày càng gia tăng do sự phát triển mạnh mẽ của AI, 
                      khiến ITers khó khăn trong việc tìm kiếm công việc ổn định.
                    </p>
                  </div>

                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-green-100">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mr-4">
                        <FaLightbulb className="text-green-600 text-2xl" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">Giải pháp của chúng tôi</h3>
                    </div>
                    <p className="text-gray-600 leading-relaxed">
                      Nền tảng kết nối ITers với khách hàng, cho phép ITers tìm dự án phù hợp và khách hàng tìm được ITers chất lượng.
                    </p>
                  </div>
                </div>

                <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-blue-100">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Tính năng chính</h3>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-4">
                        <span className="text-white text-sm">1</span>
                      </div>
                      <span className="text-gray-700">Mua bán phần mềm giá rẻ</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-4">
                        <span className="text-white text-sm">2</span>
                      </div>
                      <span className="text-gray-700">Đăng dự án và tìm ITers</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-4">
                        <span className="text-white text-sm">3</span>
                      </div>
                      <span className="text-gray-700">AI gợi ý phù hợp</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-4">
                        <span className="text-white text-sm">4</span>
                      </div>
                      <span className="text-gray-700">Làm việc theo team</span>
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
            <div className="max-w-6xl mx-auto">
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

        {/* CTA Section - Enhanced Design */}
        <section className="py-24 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-indigo-400/20"></div>
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-black/10"></div>
          <div className="absolute top-10 right-10 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 left-10 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-5xl mx-auto text-center">
              <h2 className="text-4xl md:text-6xl font-bold mb-8 text-white leading-tight">
                Sẵn sàng <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-100 to-white">bắt đầu?</span>
              </h2>
              <p className="text-xl md:text-2xl text-blue-100 mb-12 max-w-4xl mx-auto leading-relaxed">
                Tham gia nền tảng mua bán phần mềm giá rẻ - Giải pháp cho tình trạng layoff trong ngành IT
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <a
                  href="/register"
                  className="bg-white text-blue-600 px-10 py-5 rounded-2xl font-bold text-xl hover:bg-blue-50 hover:scale-105 transition-all duration-300 shadow-2xl"
                >
                  Tôi cần thuê ITers
                </a>
                <a
                  href="/register"
                  className="bg-transparent border-2 border-white text-white px-10 py-5 rounded-2xl font-bold text-xl hover:bg-white hover:text-blue-600 hover:scale-105 transition-all duration-300 shadow-2xl"
                >
                  Tôi là ITer
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}