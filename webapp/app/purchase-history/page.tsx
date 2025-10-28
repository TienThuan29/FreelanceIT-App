"use client";

import { useState, useEffect } from "react";
import { useTransaction } from "@/hooks/useTransaction";
import { TransactionHistory, TransactionStatus } from "@/types/transaction.type";
import { useAuth } from "@/contexts/AuthContext";
import { 
  FaCheckCircle, 
  FaTimesCircle, 
  FaClock, 
  FaBan,
  FaReceipt,
  FaCalendarAlt,
  FaMoneyBillWave
} from "react-icons/fa";
import { motion } from "framer-motion";

export default function PurchaseHistoryPage() {
  const { user } = useAuth();
  const { transactions, isLoading, getUserTransactions } = useTransaction();
  const [filteredTransactions, setFilteredTransactions] = useState<TransactionHistory[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    if (user) {
      getUserTransactions();
    }
  }, [user, getUserTransactions]);

  useEffect(() => {
    if (statusFilter === "all") {
      setFilteredTransactions(transactions);
    } else {
      setFilteredTransactions(transactions.filter(t => t.status === statusFilter));
    }
  }, [transactions, statusFilter]);

  const getStatusIcon = (status: TransactionStatus) => {
    switch (status) {
      case TransactionStatus.SUCCESS:
        return <FaCheckCircle className="text-green-500" />;
      case TransactionStatus.FAILED:
        return <FaTimesCircle className="text-red-500" />;
      case TransactionStatus.PENDING:
        return <FaClock className="text-yellow-500" />;
      case TransactionStatus.CANCELLED:
        return <FaBan className="text-gray-500" />;
      default:
        return <FaClock className="text-gray-500" />;
    }
  };

  const getStatusColor = (status: TransactionStatus) => {
    switch (status) {
      case TransactionStatus.SUCCESS:
        return "bg-green-100 text-green-800 border-green-200";
      case TransactionStatus.FAILED:
        return "bg-red-100 text-red-800 border-red-200";
      case TransactionStatus.PENDING:
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case TransactionStatus.CANCELLED:
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusText = (status: TransactionStatus) => {
    switch (status) {
      case TransactionStatus.SUCCESS:
        return "Thành công";
      case TransactionStatus.FAILED:
        return "Thất bại";
      case TransactionStatus.PENDING:
        return "Đang xử lý";
      case TransactionStatus.CANCELLED:
        return "Đã hủy";
      default:
        return status;
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString('vi-VN') + ' VND';
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-center items-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-6 text-gray-600">Đang tải lịch sử giao dịch...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Lịch sử giao dịch</h1>
        <p className="text-gray-600">Xem lại tất cả các giao dịch mua gói dịch vụ của bạn</p>
      </div>

      {/* Filter */}
      <div className="mb-6 flex flex-wrap gap-2">
        <button
          onClick={() => setStatusFilter("all")}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            statusFilter === "all"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Tất cả ({transactions.length})
        </button>
        <button
          onClick={() => setStatusFilter(TransactionStatus.SUCCESS)}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            statusFilter === TransactionStatus.SUCCESS
              ? "bg-green-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Thành công ({transactions.filter(t => t.status === TransactionStatus.SUCCESS).length})
        </button>
        <button
          onClick={() => setStatusFilter(TransactionStatus.FAILED)}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            statusFilter === TransactionStatus.FAILED
              ? "bg-red-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Thất bại ({transactions.filter(t => t.status === TransactionStatus.FAILED).length})
        </button>
        <button
          onClick={() => setStatusFilter(TransactionStatus.PENDING)}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            statusFilter === TransactionStatus.PENDING
              ? "bg-yellow-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Đang xử lý ({transactions.filter(t => t.status === TransactionStatus.PENDING).length})
        </button>
      </div>

      {/* Transactions List */}
      {filteredTransactions.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-lg">
          <FaReceipt className="mx-auto text-6xl text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Chưa có giao dịch nào
          </h3>
          <p className="text-gray-600">
            {statusFilter === "all" 
              ? "Bạn chưa thực hiện giao dịch nào"
              : `Không có giao dịch nào ở trạng thái "${getStatusText(statusFilter as TransactionStatus)}"`
            }
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredTransactions.map((transaction, index) => (
            <motion.div
              key={transaction.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
            >
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                {/* Left side - Transaction info */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="text-2xl">
                      {getStatusIcon(transaction.status)}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Mã giao dịch: {transaction.orderId}
                      </h3>
                      <p className="text-sm text-gray-600">
                        ID: {transaction.id}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                    <div className="flex items-center gap-2 text-sm">
                      <FaCalendarAlt className="text-gray-400" />
                      <span className="text-gray-600">
                        {formatDate(transaction.createdDate)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <FaMoneyBillWave className="text-gray-400" />
                      <span className="font-semibold text-gray-900">
                        {formatPrice(transaction.amount)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right side - Status */}
                <div className="flex items-center gap-4">
                  <span
                    className={`px-4 py-2 rounded-full text-sm font-semibold border ${getStatusColor(
                      transaction.status
                    )}`}
                  >
                    {getStatusText(transaction.status)}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
