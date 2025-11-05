'use client';

import { useEffect, useState } from 'react';
import { useTransaction } from '@/hooks/useTransaction';
import { TransactionHistory } from '@/types/transaction.type';
import { TransactionStatusBadge } from '@/components/TransactionStatusBadge';
import { TransactionDetailCard } from '@/components/TransactionDetailCard';
import { formatDate } from '@/lib/date';
import { formatCurrency } from '@/lib/curency';
import { FaSync, FaReceipt, FaSearch } from 'react-icons/fa';

export default function TransactionHistoryPage() {
  const { transactions, isLoading, getUserTransactions, refreshTransactions } = useTransaction();
  const [selectedTransaction, setSelectedTransaction] = useState<TransactionHistory | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    getUserTransactions();
  }, [getUserTransactions]);

  const handleRefresh = async () => {
    await refreshTransactions();
  };

  const filteredTransactions = transactions.filter(transaction => 
    transaction.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.cassoTransactionId?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading && transactions.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-center items-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Đang tải lịch sử giao dịch...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Lịch sử giao dịch
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Quản lý và theo dõi các giao dịch của bạn
            </p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={isLoading}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
          >
            <FaSync className={isLoading ? 'animate-spin' : ''} />
            Làm mới
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Tìm kiếm theo mã giao dịch, mã đơn hàng..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Transactions List */}
      {filteredTransactions.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <FaReceipt className="mx-auto text-5xl text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Chưa có giao dịch nào
          </h3>
          <p className="text-gray-500">
            {searchTerm ? 'Không tìm thấy giao dịch phù hợp' : 'Lịch sử giao dịch của bạn sẽ hiển thị ở đây'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Transactions Table */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Mã GD
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Số tiền
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Trạng thái
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ngày tạo
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredTransactions.map((transaction) => (
                      <tr
                        key={transaction.id}
                        onClick={() => setSelectedTransaction(transaction)}
                        className={`cursor-pointer hover:bg-gray-50 transition-colors ${
                          selectedTransaction?.id === transaction.id ? 'bg-blue-50' : ''
                        }`}
                      >
                        <td className="px-4 py-3 whitespace-nowrap text-sm">
                          <div className="text-gray-900 font-medium">
                            {transaction.id.substring(0, 8)}...
                          </div>
                          {transaction.cassoTransactionId && (
                            <div className="text-xs text-blue-600">
                              Casso: {transaction.cassoTransactionId}
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                          {formatCurrency(transaction.amount)}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm">
                          <TransactionStatusBadge status={transaction.status} />
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(transaction.createdDate)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Summary Stats */}
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-white rounded-lg shadow p-4">
                <p className="text-xs text-gray-500">Tổng GD</p>
                <p className="text-lg font-bold text-gray-900">
                  {filteredTransactions.length}
                </p>
              </div>
              <div className="bg-white rounded-lg shadow p-4">
                <p className="text-xs text-gray-500">Thành công</p>
                <p className="text-lg font-bold text-green-600">
                  {filteredTransactions.filter(t => t.status === 'SUCCESS').length}
                </p>
              </div>
              <div className="bg-white rounded-lg shadow p-4">
                <p className="text-xs text-gray-500">Đang chờ</p>
                <p className="text-lg font-bold text-yellow-600">
                  {filteredTransactions.filter(t => t.status === 'PENDING').length}
                </p>
              </div>
              <div className="bg-white rounded-lg shadow p-4">
                <p className="text-xs text-gray-500">Thất bại</p>
                <p className="text-lg font-bold text-red-600">
                  {filteredTransactions.filter(t => t.status === 'FAILED').length}
                </p>
              </div>
            </div>
          </div>

          {/* Transaction Detail */}
          <div className="lg:col-span-1">
            {selectedTransaction ? (
              <TransactionDetailCard transaction={selectedTransaction} />
            ) : (
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <FaReceipt className="mx-auto text-4xl text-gray-300 mb-3" />
                <p className="text-gray-500">
                  Chọn một giao dịch để xem chi tiết
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
