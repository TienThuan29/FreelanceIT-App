"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import type { TransactionHistory } from '@/types/transaction.type';
import { TransactionStatus } from '@/types/transaction.type';
import {
  HiArrowDown,
  HiBanknotes,
  HiReceiptPercent,
  HiShoppingBag
} from 'react-icons/hi2';

interface TransactionsTabProps {
  transactions: TransactionHistory[];
  isLoading: boolean;
  onRefresh: () => void;
}

export default function TransactionsTab({
  transactions,
  isLoading,
  onRefresh
}: TransactionsTabProps) {
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
        <h3 className="text-lg font-medium text-gray-900">Lịch sử giao dịch</h3>
        <button
          onClick={onRefresh}
          disabled={isLoading}
          className="px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors flex items-center space-x-2 disabled:opacity-50"
          type="button"
        >
          <HiArrowDown className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Làm mới</span>
        </button>
      </div>

      {transactions.length > 0 ? (
        <div className="space-y-4">
          {transactions.map((transaction) => {
            const isSuccess = transaction.status === TransactionStatus.SUCCESS;
            const isPending = transaction.status === TransactionStatus.PENDING;
            const isFailed = transaction.status === TransactionStatus.FAILED;
            const isCancelled = transaction.status === TransactionStatus.CANCELLED;

            return (
              <div
                key={transaction.id}
                className={`border-2 rounded-lg p-4 hover:shadow-md transition-shadow ${
                  isSuccess ? 'border-green-200 bg-green-50' :
                  isPending ? 'border-yellow-200 bg-yellow-50' :
                  isFailed ? 'border-red-200 bg-red-50' :
                  'border-gray-200 bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${
                      isSuccess ? 'bg-green-100' :
                      isPending ? 'bg-yellow-100' :
                      isFailed ? 'bg-red-100' :
                      'bg-gray-100'
                    }`}>
                      <HiBanknotes className={`w-6 h-6 ${
                        isSuccess ? 'text-green-600' :
                        isPending ? 'text-yellow-600' :
                        isFailed ? 'text-red-600' :
                        'text-gray-600'
                      }`} />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Mã giao dịch: {transaction.orderId}</p>
                      <p className="text-sm text-gray-600">ID: {transaction.id}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-gray-900">
                      {transaction.amount.toLocaleString('vi-VN')} VND
                    </p>
                    <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${
                      isSuccess ? 'bg-green-500 text-white' :
                      isPending ? 'bg-yellow-500 text-white' :
                      isFailed ? 'bg-red-500 text-white' :
                      'bg-gray-500 text-white'
                    }`}>
                      {isSuccess ? 'Thành công' :
                       isPending ? 'Đang xử lý' :
                       isFailed ? 'Thất bại' :
                       'Đã hủy'}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Ngày giao dịch</p>
                    <p className="font-medium text-gray-900">
                      {transaction.createdDate.toLocaleDateString('vi-VN')} {transaction.createdDate.toLocaleTimeString('vi-VN')}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Planning ID</p>
                    <p className="font-medium text-gray-900">{transaction.planningId}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Trạng thái</p>
                    <p className={`font-medium ${
                      isSuccess ? 'text-green-600' :
                      isPending ? 'text-yellow-600' :
                      isFailed ? 'text-red-600' :
                      'text-gray-600'
                    }`}>
                      {transaction.status}
                    </p>
                  </div>
                </div>

                {isFailed && (
                  <div className="mt-3 pt-3 border-t border-red-200">
                    <p className="text-sm text-red-600">
                      Giao dịch thất bại. Vui lòng thử lại hoặc liên hệ hỗ trợ.
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="p-4 bg-gray-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <HiReceiptPercent className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Chưa có giao dịch nào
          </h3>
          <p className="text-gray-500 mb-6">
            Bạn chưa thực hiện giao dịch nào. Hãy mua một gói dịch vụ để bắt đầu!
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

