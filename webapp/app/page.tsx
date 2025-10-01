"use client";

import React from "react";
import SmartNavbar from '@/components/SmartNavbar';
import Footer from '@/components/Footer';
import Image from 'next/image'

export default function Page() {
  return (
    <>
      <SmartNavbar />
      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-20">
          <div className="container mx-auto px-4 text-center">
            {/* Logo section */}
            <div className="mb-6">
              <Image
                src="/assets/logo.png"
                alt="FreeLanceIT Logo"
                className="mx-auto mb-4 w-auto h-24 md:w-auto md:h-32"
                width={128}
                height={96}
              />
            </div>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto leading-relaxed">
              Nền tảng kết nối hàng đầu giữa <span className="font-semibold">Freelancer IT</span> và <span className="font-semibold">Doanh nghiệp</span> tại Việt Nam
            </p>

          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-4 text-gray-800">
              Tại sao chọn FreeLanceIT?
            </h2>
            <p className="text-gray-600 text-center mb-16 max-w-2xl mx-auto">
              Chúng tôi cung cấp giải pháp toàn diện để kết nối và hợp tác hiệu quả
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <div className="bg-white rounded-2xl shadow-xl p-8 text-center transform hover:scale-105 transition-transform duration-300">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-blue-600 text-2xl">⚡</span>
                </div>
                <h3 className="text-2xl font-bold mb-3 text-blue-700">Kết nối nhanh chóng</h3>
                <p className="text-gray-600 leading-relaxed">
                  Tìm kiếm và hợp tác với freelancer IT chỉ trong vài phút. Hệ thống matching thông minh.
                </p>
              </div>

              <div className="bg-white rounded-2xl shadow-xl p-8 text-center transform hover:scale-105 transition-transform duration-300">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-blue-600 text-2xl">🛡️</span>
                </div>
                <h3 className="text-2xl font-bold mb-3 text-blue-700">Bảo mật & Uy tín</h3>
                <p className="text-gray-600 leading-relaxed">
                  Hệ thống xác thực 2 lớp, đánh giá reputation, bảo vệ quyền lợi cả hai bên.
                </p>
              </div>

              <div className="bg-white rounded-2xl shadow-xl p-8 text-center transform hover:scale-105 transition-transform duration-300">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-blue-600 text-2xl">💳</span>
                </div>
                <h3 className="text-2xl font-bold mb-3 text-blue-700">Thanh toán an toàn</h3>
                <p className="text-gray-600 leading-relaxed">
                  Escrow payment, nhiều hình thức thanh toán, hỗ trợ xuất hóa đơn VAT.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-16 text-gray-800">
              Cách thức hoạt động
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 max-w-6xl mx-auto">
              {/* For Freelancers */}
              <div>
                <h3 className="text-2xl font-bold mb-8 text-blue-600 text-center">
                  Dành cho Freelancer
                </h3>
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">1</div>
                    <div>
                      <h4 className="font-semibold text-gray-800">Tạo hồ sơ chuyên nghiệp</h4>
                      <p className="text-gray-600">Showcase kỹ năng, kinh nghiệm và portfolio của bạn</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">2</div>
                    <div>
                      <h4 className="font-semibold text-gray-800">Tìm kiếm dự án phù hợp</h4>
                      <p className="text-gray-600">Lọc theo công nghệ, mức lương, thời gian</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">3</div>
                    <div>
                      <h4 className="font-semibold text-gray-800">Gửi proposal và nhận việc</h4>
                      <p className="text-gray-600">Thương lượng điều kiện và bắt đầu làm việc</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* For Employers */}
              <div>
                <h3 className="text-2xl font-bold mb-8 text-green-600 text-center">
                  Dành cho Nhà tuyển dụng
                </h3>
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold">1</div>
                    <div>
                      <h4 className="font-semibold text-gray-800">Đăng job posting</h4>
                      <p className="text-gray-600">Mô tả chi tiết yêu cầu dự án và ngân sách</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold">2</div>
                    <div>
                      <h4 className="font-semibold text-gray-800">Nhận proposals từ freelancer</h4>
                      <p className="text-gray-600">Xem hồ sơ, đánh giá và so sánh ứng viên</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold">3</div>
                    <div>
                      <h4 className="font-semibold text-gray-800">Chọn freelancer và bắt đầu</h4>
                      <p className="text-gray-600">Ký hợp đồng và theo dõi tiến độ dự án</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Popular Categories */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-16 text-gray-800">
              Lĩnh vực phổ biến
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {['Web Development', 'Mobile App', 'UI/UX Design', 'DevOps', 'Data Science', 'Blockchain', 'AI/ML', 'Game Development'].map((category, index) => (
                <div key={index} className="bg-white rounded-xl p-6 text-center hover:shadow-lg transition-shadow duration-300">
                  <div className="text-3xl mb-2">{/* category.icon */}</div>
                  <h3 className="font-semibold text-gray-800 mb-1">{category}</h3>
                  <p className="text-sm text-gray-500">{/* category.jobs */} việc làm</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 bg-blue-600 text-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold mb-2">15,000+</div>
                <div className="text-blue-200">Freelancer IT</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">3,500+</div>
                <div className="text-blue-200">Doanh nghiệp</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">25,000+</div>
                <div className="text-blue-200">Dự án hoàn thành</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">98%</div>
                <div className="text-blue-200">Độ hài lòng</div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold mb-6">
              Sẵn sàng bắt đầu với FreeLanceIT?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Tham gia cộng đồng freelancer IT lớn nhất Việt Nam ngay hôm nay
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a
                href="/register/freelancer"
                className="bg-white text-blue-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-50 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
              >
                Đăng ký làm Freelancer
              </a>
              <a
                href="/register/employer"
                className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white hover:text-blue-600 transition-all duration-300 transform hover:-translate-y-1"
              >
                Đăng tuyển dụng
              </a>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}
