'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Calendar, 
  BarChart3, 
  PieChart, 
  Download,
  RefreshCw,
  Eye,
  Filter,
  Search
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

export default function AdminRevenuePage() {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [isLoading, setIsLoading] = useState(false);

  // Mock revenue data
  const revenueStats = {
    totalRevenue: 125000000, // ₫125M
    monthlyGrowth: 15.2,
    yearlyGrowth: 28.5,
    averageOrderValue: 2500000, // ₫2.5M
    totalOrders: 156,
    activeCustomers: 89,
    conversionRate: 12.5,
    refundRate: 2.3
  };

  const monthlyRevenueData = [
    { month: 'Tháng 1', revenue: 85000000, orders: 45, growth: 8.2 },
    { month: 'Tháng 2', revenue: 92000000, orders: 52, growth: 12.5 },
    { month: 'Tháng 3', revenue: 105000000, orders: 58, growth: 15.8 },
    { month: 'Tháng 4', revenue: 118000000, orders: 63, growth: 18.3 },
    { month: 'Tháng 5', revenue: 125000000, orders: 67, growth: 15.2 },
  ];

  const revenueBySource = [
    { source: 'Planning Packages', revenue: 75000000, percentage: 60, color: 'bg-blue-500' },
    { source: 'Project Commissions', revenue: 35000000, percentage: 28, color: 'bg-green-500' },
    { source: 'Premium Features', revenue: 15000000, percentage: 12, color: 'bg-purple-500' },
  ];

  const topCustomers = [
    {
      id: '1',
      name: 'TechCorp Solutions',
      email: 'admin@techcorp.vn',
      totalSpent: 15000000,
      orders: 8,
      lastOrder: '2024-01-20',
      status: 'active'
    },
    {
      id: '2',
      name: 'StartupVN',
      email: 'ceo@startupvn.com',
      totalSpent: 12000000,
      orders: 6,
      lastOrder: '2024-01-18',
      status: 'active'
    },
    {
      id: '3',
      name: 'E-Commerce Plus',
      email: 'manager@ecommerce.vn',
      totalSpent: 9500000,
      orders: 5,
      lastOrder: '2024-01-15',
      status: 'active'
    },
    {
      id: '4',
      name: 'Healthcare Solutions',
      email: 'director@healthcare.com',
      totalSpent: 8500000,
      orders: 4,
      lastOrder: '2024-01-12',
      status: 'active'
    },
    {
      id: '5',
      name: 'Nam Restaurant Chain',
      email: 'owner@restaurant.vn',
      totalSpent: 7200000,
      orders: 3,
      lastOrder: '2024-01-10',
      status: 'inactive'
    }
  ];

  const recentTransactions = [
    {
      id: 'TXN-001',
      customer: 'TechCorp Solutions',
      amount: 5000000,
      type: 'Planning Package',
      status: 'completed',
      date: '2024-01-25',
      method: 'Bank Transfer'
    },
    {
      id: 'TXN-002',
      customer: 'StartupVN',
      amount: 2500000,
      type: 'Project Commission',
      status: 'completed',
      date: '2024-01-24',
      method: 'Credit Card'
    },
    {
      id: 'TXN-003',
      customer: 'E-Commerce Plus',
      amount: 1500000,
      type: 'Planning Package',
      status: 'pending',
      date: '2024-01-23',
      method: 'Bank Transfer'
    },
    {
      id: 'TXN-004',
      customer: 'Healthcare Solutions',
      amount: 3000000,
      type: 'Premium Features',
      status: 'completed',
      date: '2024-01-22',
      method: 'Credit Card'
    },
    {
      id: 'TXN-005',
      customer: 'Nam Restaurant Chain',
      amount: 2000000,
      type: 'Planning Package',
      status: 'refunded',
      date: '2024-01-21',
      method: 'Bank Transfer'
    }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('vi-VN');
  };

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
                  {topCustomers.map((customer, index) => (
                    <TableRow key={customer.id} className="hover:bg-gray-50 transition-colors">
                      <TableCell>
                        <div>
                          <p className="font-semibold text-gray-900">{customer.name}</p>
                          <p className="text-sm text-gray-500">{customer.email}</p>
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
                  {recentTransactions.map((transaction, index) => (
                    <TableRow key={transaction.id} className="hover:bg-gray-50 transition-colors">
                      <TableCell>
                        <p className="font-mono text-sm text-gray-900">{transaction.id}</p>
                      </TableCell>
                      <TableCell>
                        <p className="font-medium text-gray-900">{transaction.customer}</p>
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
