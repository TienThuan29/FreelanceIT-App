'use client';

import { TransactionHistory, TransactionStatus } from '@/types/transaction.type';
import { TransactionStatusBadge } from './TransactionStatusBadge';
import { FaInfoCircle, FaMoneyBillWave, FaCalendarAlt, FaHashtag, FaReceipt } from 'react-icons/fa';
import { formatDate } from '@/lib/date';
import { formatCurrency } from '@/lib/curency';

interface TransactionDetailCardProps {
  transaction: TransactionHistory;
}

export const TransactionDetailCard: React.FC<TransactionDetailCardProps> = ({ transaction }) => {
  const showCassoInfo = transaction.cassoTransactionId && transaction.status === TransactionStatus.SUCCESS;

  return (
    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between pb-4 border-b">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Chi tiết giao dịch</h3>
          <p className="text-sm text-gray-500 mt-1">Mã GD: {transaction.id}</p>
        </div>
        <TransactionStatusBadge status={transaction.status} />
      </div>

      {/* Transaction Info */}
      <div className="space-y-3">
        {/* Amount */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
            <FaMoneyBillWave className="text-blue-600" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-gray-500">Số tiền</p>
            <p className="text-lg font-semibold text-gray-900">
              {formatCurrency(transaction.amount)}
            </p>
          </div>
        </div>

        {/* Order ID */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
            <FaHashtag className="text-purple-600" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-gray-500">Mã đơn hàng</p>
            <p className="text-sm font-medium text-gray-900 break-all">
              {transaction.orderId}
            </p>
          </div>
        </div>

        {/* Created Date */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
            <FaCalendarAlt className="text-green-600" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-gray-500">Ngày tạo</p>
            <p className="text-sm font-medium text-gray-900">
              {formatDate(transaction.createdDate)}
            </p>
          </div>
        </div>
      </div>

      {/* Casso Info */}
      {showCassoInfo && (
        <div className="mt-4 pt-4 border-t">
          <div className="flex items-center gap-2 mb-3">
            <FaInfoCircle className="text-blue-600" />
            <h4 className="text-sm font-semibold text-gray-900">Thông tin xác nhận từ Casso</h4>
          </div>
          
          <div className="space-y-3 bg-blue-50 rounded-lg p-3">
            {/* Casso Transaction ID */}
            {transaction.cassoTransactionId && (
              <div className="flex items-start gap-2">
                <FaReceipt className="text-blue-600 mt-1 flex-shrink-0 text-sm" />
                <div className="flex-1">
                  <p className="text-xs text-gray-600">Mã GD Casso</p>
                  <p className="text-sm font-medium text-gray-900">
                    {transaction.cassoTransactionId}
                  </p>
                </div>
              </div>
            )}

            {/* Casso Reference Code */}
            {transaction.cassoReferenceCode && (
              <div className="flex items-start gap-2">
                <FaHashtag className="text-blue-600 mt-1 flex-shrink-0 text-sm" />
                <div className="flex-1">
                  <p className="text-xs text-gray-600">Mã tham chiếu</p>
                  <p className="text-sm font-medium text-gray-900 break-all">
                    {transaction.cassoReferenceCode}
                  </p>
                </div>
              </div>
            )}

            {/* Casso Description */}
            {transaction.cassoDescription && (
              <div className="flex items-start gap-2">
                <FaInfoCircle className="text-blue-600 mt-1 flex-shrink-0 text-sm" />
                <div className="flex-1">
                  <p className="text-xs text-gray-600">Mô tả giao dịch</p>
                  <p className="text-sm font-medium text-gray-900 break-words">
                    {transaction.cassoDescription}
                  </p>
                </div>
              </div>
            )}

            {/* Casso Updated Date */}
            {transaction.cassoUpdatedDate && (
              <div className="flex items-start gap-2">
                <FaCalendarAlt className="text-blue-600 mt-1 flex-shrink-0 text-sm" />
                <div className="flex-1">
                  <p className="text-xs text-gray-600">Ngày xác nhận</p>
                  <p className="text-sm font-medium text-gray-900">
                    {formatDate(transaction.cassoUpdatedDate)}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Pending Payment Note */}
      {transaction.status === TransactionStatus.PENDING && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-start gap-2">
            <FaInfoCircle className="text-yellow-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-yellow-800">
              <p className="font-medium mb-1">Đang chờ thanh toán</p>
              <p className="text-xs">
                Giao dịch sẽ được tự động cập nhật khi hệ thống nhận được xác nhận thanh toán từ ngân hàng qua Casso.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
