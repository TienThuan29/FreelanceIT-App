"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import type { UserPlanning } from '@/types/planning.type';
import {
  HiCreditCard,
  HiCalendar,
  HiCheckCircle,
  HiShoppingBag,
  HiDocument
} from 'react-icons/hi2';

interface PlanningTabProps {
  activeUserPlanning?: UserPlanning | null;
  isLoading: boolean;
}

export default function PlanningTab({
  activeUserPlanning,
  isLoading
}: PlanningTabProps) {
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium text-gray-900">Gói dịch vụ của bạn</h3>
        <button
          onClick={() => router.push('/planning/pricing')}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          type="button"
        >
          <HiShoppingBag className="w-4 h-4" />
          <span>Xem tất cả gói</span>
        </button>
      </div>

      {activeUserPlanning && activeUserPlanning.planning ? (
        <div className="space-y-6">
          {/* Active Plan Card */}
          <div className="border-2 border-green-200 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-green-100 rounded-lg">
                  <HiCreditCard className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-gray-900">{activeUserPlanning.planning.name}</h4>
                  <span className="px-3 py-1 bg-green-500 text-white text-xs font-semibold rounded-full">
                    Đang kích hoạt
                  </span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-blue-600">
                  {activeUserPlanning.price.toLocaleString('vi-VN')} VND
                </p>
                <p className="text-sm text-gray-500">Đã thanh toán</p>
              </div>
            </div>

            {/* Plan Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-white bg-opacity-50 rounded-lg p-4">
                <div className="flex items-center text-sm text-gray-600 mb-1">
                  <HiCalendar className="w-4 h-4 mr-2" />
                  Ngày mua
                </div>
                <p className="font-semibold text-gray-900">
                  {new Date(activeUserPlanning.transactionDate).toLocaleDateString('vi-VN')}
                </p>
              </div>
              <div className="bg-white bg-opacity-50 rounded-lg p-4">
                <div className="flex items-center text-sm text-gray-600 mb-1">
                  <HiCalendar className="w-4 h-4 mr-2" />
                  Ngày hết hạn
                </div>
                <p className="font-semibold text-gray-900">
                  {new Date(activeUserPlanning.expireDate).toLocaleDateString('vi-VN')}
                </p>
              </div>
            </div>

            {/* Developer Plan Features */}
            {activeUserPlanning.planning.detailDevPlanning && (
              <div className="bg-white bg-opacity-70 rounded-lg p-4">
                <h5 className="font-semibold text-gray-900 mb-3">Tính năng gói của bạn:</h5>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-2">
                    <HiCheckCircle className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="text-xs text-gray-600">Dự án tham gia</p>
                      <p className="font-semibold text-gray-900">
                        {activeUserPlanning.planning.detailDevPlanning.numberOfJoinedProjects}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <HiCheckCircle className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="text-xs text-gray-600">Số sản phẩm</p>
                      <p className="font-semibold text-gray-900">
                        {activeUserPlanning.planning.detailDevPlanning.numberOfProducts}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <HiCheckCircle className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="text-xs text-gray-600">Chatbot AI</p>
                      <p className="font-semibold text-gray-900">
                        {activeUserPlanning.planning.detailDevPlanning.useChatbot ? 'Có' : 'Không'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Plan Description */}
            {activeUserPlanning.planning.description && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <h5 className="font-semibold text-gray-900 mb-2">Mô tả gói:</h5>
                <ul className="space-y-1">
                  {activeUserPlanning.planning.description.split(';').map((desc, idx) => (
                    desc.trim() && (
                      <li key={idx} className="flex items-start space-x-2 text-sm text-gray-600">
                        <HiCheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>{desc.trim()}</span>
                      </li>
                    )
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => router.push('/planning/pricing')}
              className="p-4 border-2 border-blue-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors text-left"
              type="button"
            >
              <HiShoppingBag className="w-6 h-6 text-blue-600 mb-2" />
              <h4 className="font-semibold text-gray-900">Nâng cấp gói</h4>
              <p className="text-sm text-gray-600">Khám phá các gói dịch vụ cao cấp hơn</p>
            </button>
            <button
              onClick={() => router.push('/purchase-history')}
              className="p-4 border-2 border-gray-200 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-colors text-left"
              type="button"
            >
              <HiDocument className="w-6 h-6 text-gray-600 mb-2" />
              <h4 className="font-semibold text-gray-900">Lịch sử giao dịch</h4>
              <p className="text-sm text-gray-600">Xem tất cả giao dịch của bạn</p>
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="p-4 bg-gray-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <HiCreditCard className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Chưa có gói dịch vụ
          </h3>
          <p className="text-gray-500 mb-6">
            Bạn chưa đăng ký gói dịch vụ nào. Hãy chọn một gói phù hợp để bắt đầu!
          </p>
          <button
            onClick={() => router.push('/planning/pricing')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center space-x-2"
            type="button"
          >
            <HiShoppingBag className="w-5 h-5" />
            <span>Xem các gói dịch vụ</span>
          </button>
        </div>
      )}
    </div>
  );
}

