'use client';
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Calendar, 
  FolderOpen, 
  TrendingUp, 
  RefreshCw, 
  MessageSquare, 
  ShoppingCart, 
  Clock, 
  Activity,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  Download,
  CreditCard,
  Star,
} from 'lucide-react';
import { useAdminStats } from '../../hooks/useAdminStats';
import { useAdminUsers } from '../../hooks/useAdminUsers';
import useProjectManagement from '../../hooks/useProjectManagement';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/utils';

const StatCard = ({ 
  title, 
  value, 
  icon: Icon, 
  color, 
  isLoading, 
  delay = 0,
  subtitle,
  trend
}: { 
  title: string; 
  value: number | string; 
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon?: any; 
  color: string; 
  isLoading: boolean; 
  delay?: number;
  subtitle?: string;
  trend?: { value: number; isPositive: boolean };
}) => (
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
                typeof value === 'number' ? value.toLocaleString() : value
              )}
            </motion.div>
          </div>
          {subtitle && (
            <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
          )}
        </div>
        {Icon && (
          <div className={`p-3 rounded-lg ${color} group-hover:scale-110 transition-transform duration-300`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
        )}
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

const LoadingSkeleton = () => (
  <div className="animate-pulse">
    <div className="h-32 bg-gray-200 rounded-xl"></div>
  </div>
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const QuickStatsChart = ({ data }: { data: any }) => {
  const chartData = [
    { label: 'Developers', value: data.developers || 0, color: 'bg-blue-500' },
    { label: 'Customers', value: data.customers || 0, color: 'bg-green-500' },
    { label: 'Projects', value: data.projects || 0, color: 'bg-purple-500' },
    { label: 'Applications', value: data.applications || 0, color: 'bg-orange-500' },
  ];

  const maxValue = Math.max(...chartData.map(item => item.value));

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
        Phân tích dữ liệu tổng quan
      </h3>
      <div className="space-y-4">
        {chartData.map((item, index) => (
          <div key={index} className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600">{item.label}</span>
              <span className="text-sm font-bold text-gray-900">{item.value.toLocaleString()}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: maxValue > 0 ? `${(item.value / maxValue) * 100}%` : '0%' }}
                transition={{ duration: 1, delay: index * 0.2 }}
                className={`h-2 rounded-full ${item.color}`}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const RecentActivity = ({ activities }: { activities: any[] }) => (
  <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
      <Activity className="w-5 h-5 mr-2 text-green-600" />
      Hoạt động gần đây
    </h3>
    <div className="space-y-3">
      {activities.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <Clock className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>Không có hoạt động nào</p>
        </div>
      ) : (
        activities.slice(0, 8).map((activity, index) => (
          <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <div className={`p-2 rounded-full ${
              activity.status === 'success' ? 'bg-green-100' : 
              activity.status === 'warning' ? 'bg-yellow-100' : 'bg-red-100'
            }`}>
              <Activity className={`w-4 h-4 ${
                activity.status === 'success' ? 'text-green-600' : 
                activity.status === 'warning' ? 'text-yellow-600' : 'text-red-600'
              }`} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">{activity.title}</p>
              <div className="flex items-center space-x-2 text-xs text-gray-500">
                <span>{activity.time}</span>
                {activity.user && <span>• {activity.user}</span>}
                {activity.project && <span>• {activity.project}</span>}
                {activity.developer && <span>• {activity.developer}</span>}
                {activity.amount && <span className="text-green-600 font-medium">• {activity.amount}</span>}
                {activity.package && <span>• {activity.package}</span>}
                {activity.issue && <span className="text-yellow-600">• {activity.issue}</span>}
                {activity.size && <span>• {activity.size}</span>}
                {activity.count && <span>• {activity.count}</span>}
                {activity.rating && <span className="text-yellow-500">• {activity.rating}</span>}
              </div>
            </div>
            <Badge variant={activity.status === 'success' ? 'default' : activity.status === 'warning' ? 'secondary' : 'destructive'}>
              {activity.status === 'success' ? 'Thành công' : activity.status === 'warning' ? 'Cảnh báo' : 'Lỗi'}
            </Badge>
          </div>
        ))
      )}
    </div>
  </div>
);

const SystemHealth = () => (
  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
    <div className="flex items-center space-x-3 mb-4">
      <div className="p-2 bg-blue-100 rounded-lg">
        <TrendingUp className="w-5 h-5 text-blue-600" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900">Tình trạng hệ thống</h3>
    </div>
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-600">Uptime</span>
        <div className="flex items-center space-x-2">
          <CheckCircle className="w-4 h-4 text-green-500" />
          <span className="text-lg font-bold text-green-600">99.9%</span>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-600">Response Time</span>
        <div className="flex items-center space-x-2">
          <CheckCircle className="w-4 h-4 text-green-500" />
          <span className="text-lg font-bold text-green-600">&lt; 200ms</span>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-600">Database</span>
        <div className="flex items-center space-x-2">
          <CheckCircle className="w-4 h-4 text-green-500" />
          <span className="text-lg font-bold text-green-600">Healthy</span>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-600">API Status</span>
        <div className="flex items-center space-x-2">
          <CheckCircle className="w-4 h-4 text-green-500" />
          <span className="text-lg font-bold text-green-600">Operational</span>
        </div>
      </div>
    </div>
  </div>
);

export default function AdminDashboardPage() {
  const { stats, isLoading, error, refresh } = useAdminStats();
  const { developers, customers } = useAdminUsers();

  useEffect(() => {
    refresh();
  }, [refresh]);

  // Enhanced mock data for demonstration
  const mockActivities = [
    { title: 'Người dùng mới đăng ký', time: '2 phút trước', status: 'success', user: 'Nguyễn Văn A' },
    { title: 'Dự án mới được tạo', time: '5 phút trước', status: 'success', project: 'Website E-commerce' },
    { title: 'Thanh toán thành công', time: '12 phút trước', status: 'success', amount: '₫2,500,000' },
    { title: 'Developer được tuyển', time: '18 phút trước', status: 'success', developer: 'Trần Thị B' },
    { title: 'Dự án hoàn thành', time: '25 phút trước', status: 'success', project: 'Mobile App' },
    { title: 'Gói AI được mua', time: '32 phút trước', status: 'success', package: 'Pro Plan' },
    { title: 'Cảnh báo hệ thống', time: '45 phút trước', status: 'warning', issue: 'High CPU usage' },
    { title: 'Backup hoàn tất', time: '1 giờ trước', status: 'success', size: '2.3GB' },
    { title: 'Tin nhắn mới', time: '1 giờ 15 phút trước', status: 'success', count: '5' },
    { title: 'Đánh giá mới', time: '1 giờ 30 phút trước', status: 'success', rating: '5 sao' },
  ];

  const comprehensiveStats = {
    users: stats?.totals.users ?? 0,
    developers: stats?.totals.developers ?? developers.length ?? 0,
    customers: stats?.totals.customers ?? customers.length ?? 0,
    projects: stats?.totals.projects ?? 0,
    applications: 0,
    plannings: 0,
    revenue: (stats?.revenueByMonth || []).reduce((s, m) => s + m.total, 0),
    conversations: 0,
    products: stats?.totals.products ?? 0,
    notifications: 0,
    successfulTransactions: stats?.transactionsByStatus?.['SUCCESS'] ?? 0,
    ratings: stats?.totals.ratings ?? 0,
  };

  const statCards = [
    {
      title: 'Tổng người dùng',
      value: comprehensiveStats.users,
      icon: Users,
      color: 'bg-gradient-to-r from-blue-500 to-blue-600',
      subtitle: `${comprehensiveStats.developers} developers, ${comprehensiveStats.customers} customers`,
      trend: { value: 12, isPositive: true }
    },
    {
      title: 'Dự án hoạt động',
      value: comprehensiveStats.projects,
      icon: FolderOpen,
      color: 'bg-gradient-to-r from-purple-500 to-purple-600',
      subtitle: 'Đang được quản lý',
      trend: { value: 8, isPositive: true }
    },
    {
      title: 'Gói người dùng',
      value: comprehensiveStats.plannings,
      icon: Calendar,
      color: 'bg-gradient-to-r from-green-500 to-green-600',
      subtitle: 'Gói dịch vụ',
      trend: { value: 5, isPositive: true }
    },
    {
      title: 'Doanh thu tháng',
      value: formatCurrency(comprehensiveStats.revenue),
      color: 'bg-gradient-to-r from-emerald-500 to-emerald-600',
      subtitle: 'Tăng 15% so với tháng trước',
      trend: { value: 15, isPositive: true }
    },
    {
      title: 'Số lượng giao dịch',
      value: comprehensiveStats.successfulTransactions,
      icon: CreditCard,
      color: 'bg-gradient-to-r from-orange-500 to-orange-600',
      subtitle: 'Giao dịch thành công',
      trend: { value: 2, isPositive: true }
    },
    {
      title: 'Số lượng đánh giá',
      value: comprehensiveStats.ratings,
      icon: Star,
      color: 'bg-gradient-to-r from-pink-500 to-pink-600',
      subtitle: 'Tổng số đánh giá',
      trend: { value: 7, isPositive: true }
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Tổng quan hệ thống</h1>
            <p className="text-gray-600">Thống kê và phân tích dữ liệu tổng quan của FreelanceIT</p>
          </div>
          <div className="flex items-center space-x-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200"
            >
              <Download className="w-4 h-4" />
              <span>Xuất báo cáo</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={refresh}
              disabled={isLoading}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Làm mới</span>
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Error Alert */}
      {error && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center space-x-2"
        >
          <AlertTriangle className="w-5 h-5" />
          <span>{error}</span>
        </motion.div>
      )}

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        {statCards.map((card, index) => (
          isLoading ? (
            <LoadingSkeleton key={index} />
          ) : (
            <StatCard
              key={index}
              title={card.title}
              value={card.value}
              icon={card.icon}
              color={card.color}
              isLoading={isLoading}
              delay={index * 0.1}
              subtitle={card.subtitle}
              trend={card.trend}
            />
          )
        ))}
      </div>

      {/* Charts and Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <QuickStatsChart data={comprehensiveStats} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <SystemHealth />
        </motion.div>
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <RecentActivity activities={mockActivities} />
      </motion.div>

      {/* Performance Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.7 }}
        className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
          Chỉ số hiệu suất
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium">Tỷ lệ hoàn thành dự án</p>
                <p className="text-2xl font-bold text-blue-900 mt-1">87.5%</p>
                <p className="text-xs text-blue-600 mt-1">↑ 5.2% so với tháng trước</p>
              </div>
              <div className="bg-blue-200 rounded-full p-3">
                <CheckCircle className="w-6 h-6 text-blue-700" />
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium">Đánh giá trung bình</p>
                <p className="text-2xl font-bold text-green-900 mt-1">4.8/5</p>
                <p className="text-xs text-green-600 mt-1">↑ 0.3 điểm</p>
              </div>
              <div className="bg-green-200 rounded-full p-3">
                <TrendingUp className="w-6 h-6 text-green-700" />
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600 font-medium">Thời gian phản hồi</p>
                <p className="text-2xl font-bold text-purple-900 mt-1">1.2s</p>
                <p className="text-xs text-purple-600 mt-1">↓ 0.3s cải thiện</p>
              </div>
              <div className="bg-purple-200 rounded-full p-3">
                <Clock className="w-6 h-6 text-purple-700" />
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Activity className="w-5 h-5 mr-2 text-blue-600" />
          Thao tác nhanh
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="flex flex-col items-center p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
            <Users className="w-8 h-8 text-blue-600 mb-2" />
            <span className="text-sm font-medium text-blue-700">Quản lý người dùng</span>
          </button>
          <button className="flex flex-col items-center p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
            <FolderOpen className="w-8 h-8 text-green-600 mb-2" />
            <span className="text-sm font-medium text-green-700">Quản lý dự án</span>
          </button>
          <button className="flex flex-col items-center p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors">
            <Calendar className="w-8 h-8 text-purple-600 mb-2" />
            <span className="text-sm font-medium text-purple-700">Quản lý kế hoạch</span>
          </button>
          <button className="flex flex-col items-center p-4 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors">
            <BarChart3 className="w-8 h-8 text-orange-600 mb-2" />
            <span className="text-sm font-medium text-orange-700">Báo cáo chi tiết</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}


