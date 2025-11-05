'use client';
import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  DollarSign, 
  TrendingUp, 
  Users, 
  BarChart3, 
  PieChart, 
  Download,
  RefreshCw,
  Eye,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useTransaction } from '@/hooks/useTransaction';
import { TransactionHistory, TransactionStatus } from '@/types/transaction.type';

export default function AdminRevenuePage() {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const { getAllTransactions, isLoading, refreshTransactions } = useTransaction();
  const [transactions, setTransactions] = useState<TransactionHistory[]>([]);

  // Fetch transactions on mount
  useEffect(() => {
    const fetchTransactions = async () => {
      const data = await getAllTransactions();
      setTransactions(data);
    };
    fetchTransactions();
  }, [getAllTransactions]);

  // Filter successful transactions
  const successfulTransactions = useMemo(() => {
    return transactions.filter(t => t.status === TransactionStatus.SUCCESS);
  }, [transactions]);

  // Calculate revenue stats from real data
  const revenueStats = useMemo(() => {
    const totalRevenue = successfulTransactions.reduce((sum, t) => sum + t.amount, 0);
    const totalOrders = successfulTransactions.length;
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    const uniqueCustomers = new Set(successfulTransactions.map(t => t.userId)).size;
    
    // Calculate monthly growth (current month vs previous month)
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    const currentMonthRevenue = successfulTransactions
      .filter(t => {
        const date = new Date(t.createdDate);
        return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
      })
      .reduce((sum, t) => sum + t.amount, 0);

    const lastMonthRevenue = successfulTransactions
      .filter(t => {
        const date = new Date(t.createdDate);
        return date.getMonth() === lastMonth && date.getFullYear() === lastMonthYear;
      })
      .reduce((sum, t) => sum + t.amount, 0);

    const monthlyGrowth = lastMonthRevenue > 0 
      ? ((currentMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100 
      : 0;

    // Calculate refund rate (failed + cancelled transactions)
    const failedTransactions = transactions.filter(
      t => t.status === TransactionStatus.FAILED || t.status === TransactionStatus.CANCELLED
    ).length;
    const refundRate = transactions.length > 0 
      ? (failedTransactions / transactions.length) * 100 
      : 0;

    return {
      totalRevenue,
      monthlyGrowth: Number(monthlyGrowth.toFixed(1)),
      averageOrderValue: Math.round(averageOrderValue),
      totalOrders,
      activeCustomers: uniqueCustomers,
      conversionRate: 0, // Can be calculated later if needed
      refundRate: Number(refundRate.toFixed(1))
    };
  }, [successfulTransactions, transactions]);

  // Calculate monthly revenue data
  const monthlyRevenueData = useMemo(() => {
    const monthNames = [
      'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
      'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
    ];

    const monthlyData = new Map<string, { revenue: number; orders: number }>();

    successfulTransactions.forEach(t => {
      const date = new Date(t.createdDate);
      const monthKey = `${date.getFullYear()}-${date.getMonth()}`;

      if (!monthlyData.has(monthKey)) {
        monthlyData.set(monthKey, { revenue: 0, orders: 0 });
      }

      const data = monthlyData.get(monthKey)!;
      data.revenue += t.amount;
      data.orders += 1;
    });

    // Convert to array and sort by date (newest first), take last 5 months
    const sorted = Array.from(monthlyData.entries())
      .sort((a, b) => b[0].localeCompare(a[0]))
      .slice(0, 5)
      .map(([key, data]) => {
        const [year, month] = key.split('-');
        const monthIndex = parseInt(month);
        const prevMonthIndex = monthIndex === 0 ? 11 : monthIndex - 1;
        const prevYear = monthIndex === 0 ? parseInt(year) - 1 : parseInt(year);
        const prevMonthKey = `${prevYear}-${prevMonthIndex}`;

        const prevData = monthlyData.get(prevMonthKey);
        const prevRevenue = prevData?.revenue || 0;
        const growth = prevRevenue > 0 
          ? ((data.revenue - prevRevenue) / prevRevenue) * 100 
          : 0;

        return {
          month: `${monthNames[monthIndex]} ${year}`,
          revenue: data.revenue,
          orders: data.orders,
          growth: Number(growth.toFixed(1))
        };
      })
      .reverse(); // Show oldest to newest

    return sorted;
  }, [successfulTransactions]);

  // All revenue is from Planning Packages for now
  const revenueBySource = useMemo(() => {
    const planningRevenue = successfulTransactions.reduce((sum, t) => sum + t.amount, 0);
    const total = planningRevenue;
    
    return total > 0 ? [
      { 
        source: 'Planning Packages', 
        revenue: planningRevenue, 
        percentage: 100, 
        color: 'bg-blue-500' 
      },
    ] : [];
  }, [successfulTransactions]);

  // Calculate top customers
  const topCustomers = useMemo(() => {
    const customerMap = new Map<string, { 
      userId: string; 
      totalSpent: number; 
      orders: number; 
      lastOrder: Date;
    }>();

    successfulTransactions.forEach(t => {
      if (!customerMap.has(t.userId)) {
        customerMap.set(t.userId, {
          userId: t.userId,
          totalSpent: 0,
          orders: 0,
          lastOrder: new Date(t.createdDate)
        });
      }

      const customer = customerMap.get(t.userId)!;
      customer.totalSpent += t.amount;
      customer.orders += 1;
      const tDate = new Date(t.createdDate);
      if (tDate > customer.lastOrder) {
        customer.lastOrder = tDate;
      }
    });

    // Sort by totalSpent and take top 5
    return Array.from(customerMap.values())
      .sort((a, b) => b.totalSpent - a.totalSpent)
      .slice(0, 5)
      .map((customer, index) => ({
        id: (index + 1).toString(),
        userId: customer.userId,
        name: `User ${customer.userId.substring(0, 8)}...`,
        email: `${customer.userId.substring(0, 8)}@user.com`,
        totalSpent: customer.totalSpent,
        orders: customer.orders,
        lastOrder: customer.lastOrder.toISOString().split('T')[0],
        status: 'active' as const
      }));
  }, [successfulTransactions]);

  // Get recent transactions (last 10)
  const recentTransactions = useMemo(() => {
    return transactions
      .sort((a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime())
      .slice(0, 10)
      .map(t => {
        const statusMap = {
          [TransactionStatus.SUCCESS]: 'completed',
          [TransactionStatus.PENDING]: 'pending',
          [TransactionStatus.FAILED]: 'failed',
          [TransactionStatus.CANCELLED]: 'refunded'
        };

        return {
          id: t.orderId,
          userId: t.userId,
          customer: `User ${t.userId.substring(0, 8)}...`,
          amount: t.amount,
          type: 'Planning Package',
          status: statusMap[t.status],
          date: new Date(t.createdDate).toISOString().split('T')[0],
          method: 'Payment Gateway' // Default since we don't track payment method in transaction
        };
      });
  }, [transactions]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  const formatDate = (date: string | Date) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('vi-VN');
  };

  const handleRefresh = async () => {
    await refreshTransactions();
    const data = await getAllTransactions();
    setTransactions(data);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const StatCard = ({ title, value, icon: Icon, color, subtitle, trend, delay = 0 }: any) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="relative overflow-hidden bg-white rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 group"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white to-gray-50 opacity-50"></div>
      <div className="relative p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
            <div className="flex items-center space-x-2">
              <motion.div
                key={isLoading ? 'loading' : 'loaded'}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-3xl font-bold text-gray-900"
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <RefreshCw className="w-6 h-6 animate-spin text-gray-400" />
                    <span className="text-gray-400">...</span>
                  </div>
                ) : (
                  typeof value === 'number' ? formatCurrency(value) : value
                )}
              </motion.div>
            </div>
            {subtitle && (
              <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
            )}
          </div>
          <div className={`p-3 rounded-lg ${color} group-hover:scale-110 transition-transform duration-300`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
        </div>
        {trend && (
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className={`w-4 h-4 mr-1 ${trend.isPositive ? 'text-green-500' : 'text-red-500 rotate-180'}`} />
            <span className={trend.isPositive ? 'text-green-600' : 'text-red-600'}>
              {trend.isPositive ? '+' : ''}{trend.value}%
            </span>
            <span className="text-gray-500 ml-1">so với tháng trước</span>
          </div>
        )}
      </div>
    </motion.div>
  );

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white rounded-xl shadow-lg border border-gray-100 p-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Doanh thu & Báo cáo</h1>
            <p className="text-gray-500 text-sm mt-1">
              Phân tích doanh thu và báo cáo tài chính chi tiết
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="week">Tuần này</option>
              <option value="month">Tháng này</option>
              <option value="quarter">Quý này</option>
              <option value="year">Năm này</option>
            </select>
            <button 
              onClick={handleRefresh}
              disabled={isLoading}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Làm mới</span>
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
              <Download className="w-4 h-4" />
              <span>Xuất báo cáo</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Tổng doanh thu"
          value={revenueStats.totalRevenue}
          icon={DollarSign}
          color="bg-gradient-to-r from-emerald-500 to-emerald-600"
          subtitle="Tháng này"
          trend={{ value: revenueStats.monthlyGrowth, isPositive: true }}
          delay={0.1}
        />
        <StatCard
          title="Đơn hàng"
          value={revenueStats.totalOrders}
          icon={BarChart3}
          color="bg-gradient-to-r from-blue-500 to-blue-600"
          subtitle="Tổng số đơn"
          trend={{ value: 8.5, isPositive: true }}
          delay={0.2}
        />
        <StatCard
          title="Khách hàng"
          value={revenueStats.activeCustomers}
          icon={Users}
          color="bg-gradient-to-r from-purple-500 to-purple-600"
          subtitle="Đang hoạt động"
          trend={{ value: 12.3, isPositive: true }}
          delay={0.3}
        />
        <StatCard
          title="Giá trị TB/đơn"
          value={revenueStats.averageOrderValue}
          icon={TrendingUp}
          color="bg-gradient-to-r from-orange-500 to-orange-600"
          subtitle="Trung bình"
          trend={{ value: 5.7, isPositive: true }}
          delay={0.4}
        />
      </div>

      {/* Charts and Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="bg-white rounded-xl shadow-lg border border-gray-100 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
            Doanh thu theo tháng
          </h3>
          <div className="space-y-4">
            {monthlyRevenueData.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{item.month}</p>
                  <p className="text-sm text-gray-500">{item.orders} đơn hàng</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{formatCurrency(item.revenue)}</p>
                  <div className="flex items-center text-sm">
                    <TrendingUp className="w-3 h-3 text-green-500 mr-1" />
                    <span className="text-green-600">+{item.growth}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Revenue by Source */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="bg-white rounded-xl shadow-lg border border-gray-100 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <PieChart className="w-5 h-5 mr-2 text-purple-600" />
            Doanh thu theo nguồn
          </h3>
          <div className="space-y-4">
            {revenueBySource.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">{item.source}</span>
                  <span className="text-sm font-semibold text-gray-900">{formatCurrency(item.revenue)}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${item.color}`}
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                </div>
                <div className="text-right">
                  <span className="text-xs text-gray-500">{item.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Detailed Tables */}
      <Tabs defaultValue="customers" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-md bg-white border border-gray-200 rounded-lg p-1">
          <TabsTrigger value="customers" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
            <Users className="w-4 h-4 mr-2" />
            Khách hàng hàng đầu
          </TabsTrigger>
          <TabsTrigger value="transactions" className="data-[state=active]:bg-green-50 data-[state=active]:text-green-700">
            <DollarSign className="w-4 h-4 mr-2" />
            Giao dịch gần đây
          </TabsTrigger>
        </TabsList>

        {/* Top Customers */}
        <TabsContent value="customers" className="mt-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden"
          >
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Khách hàng hàng đầu</h3>
              <p className="text-sm text-gray-500 mt-1">Top 5 khách hàng có doanh thu cao nhất</p>
            </div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50 border-b border-gray-200">
                    <TableHead className="font-semibold text-gray-700">Khách hàng</TableHead>
                    <TableHead className="font-semibold text-gray-700">Tổng chi tiêu</TableHead>
                    <TableHead className="font-semibold text-gray-700">Số đơn</TableHead>
                    <TableHead className="font-semibold text-gray-700">Đơn cuối</TableHead>
                    <TableHead className="font-semibold text-gray-700">Trạng thái</TableHead>
                    <TableHead className="font-semibold text-gray-700 text-center">Hành động</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topCustomers.map((customer) => (
                    <TableRow key={customer.id} className="hover:bg-gray-50 transition-colors">
                      <TableCell>
                        <div>
                          <p className="font-semibold text-gray-900">{customer.name}</p>
                          <p className="text-sm text-gray-500">ID: {customer.userId}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="font-semibold text-green-600">{formatCurrency(customer.totalSpent)}</p>
                      </TableCell>
                      <TableCell>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {customer.orders} đơn
                        </span>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm text-gray-700">{formatDate(customer.lastOrder)}</p>
                      </TableCell>
                      <TableCell>
                        <Badge variant={customer.status === 'active' ? 'default' : 'secondary'}>
                          {customer.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </motion.div>
        </TabsContent>

        {/* Recent Transactions */}
        <TabsContent value="transactions" className="mt-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden"
          >
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Giao dịch gần đây</h3>
              <p className="text-sm text-gray-500 mt-1">Các giao dịch mới nhất trong hệ thống</p>
            </div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50 border-b border-gray-200">
                    <TableHead className="font-semibold text-gray-700">ID</TableHead>
                    <TableHead className="font-semibold text-gray-700">Khách hàng</TableHead>
                    <TableHead className="font-semibold text-gray-700">Số tiền</TableHead>
                    <TableHead className="font-semibold text-gray-700">Loại</TableHead>
                    <TableHead className="font-semibold text-gray-700">Trạng thái</TableHead>
                    <TableHead className="font-semibold text-gray-700">Ngày</TableHead>
                    <TableHead className="font-semibold text-gray-700">Phương thức</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentTransactions.map((transaction) => (
                    <TableRow key={transaction.id} className="hover:bg-gray-50 transition-colors">
                      <TableCell>
                        <p className="font-mono text-sm text-gray-900">{transaction.id}</p>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium text-gray-900">{transaction.customer}</p>
                          <p className="text-xs text-gray-500">ID: {transaction.userId}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="font-semibold text-gray-900">{formatCurrency(transaction.amount)}</p>
                      </TableCell>
                      <TableCell>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          {transaction.type}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={
                            transaction.status === 'completed' ? 'default' : 
                            transaction.status === 'pending' ? 'secondary' : 
                            'destructive'
                          }
                        >
                          {transaction.status === 'completed' ? 'Hoàn thành' : 
                           transaction.status === 'pending' ? 'Chờ xử lý' : 
                           'Hoàn trả'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm text-gray-700">{formatDate(transaction.date)}</p>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm text-gray-600">{transaction.method}</p>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
