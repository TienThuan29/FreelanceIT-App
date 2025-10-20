'use client';
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Calendar, FolderOpen, TrendingUp, RefreshCw } from 'lucide-react';
import { useAdminStats } from '../../hooks/useAdminStats';

const StatCard = ({ 
  title, 
  value, 
  icon: Icon, 
  color, 
  isLoading, 
  delay = 0 
}: { 
  title: string; 
  value: number; 
  icon: any; 
  color: string; 
  isLoading: boolean; 
  delay?: number;
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
                value.toLocaleString()
              )}
            </motion.div>
          </div>
        </div>
        <div className={`p-3 rounded-lg ${color} group-hover:scale-110 transition-transform duration-300`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
      <div className="mt-4 flex items-center text-sm text-gray-500">
        <TrendingUp className="w-4 h-4 mr-1" />
        <span>Tăng trưởng tích cực</span>
      </div>
    </div>
  </motion.div>
);

const LoadingSkeleton = () => (
  <div className="animate-pulse">
    <div className="h-32 bg-gray-200 rounded-xl"></div>
  </div>
);

const SimpleChart = ({ data }: { data: { users: number; plannings: number; projects: number } }) => {
  const maxValue = Math.max(data.users, data.plannings, data.projects);
  const chartData = [
    { label: 'Người dùng', value: data.users, color: 'bg-blue-500' },
    { label: 'Kế hoạch', value: data.plannings, color: 'bg-green-500' },
    { label: 'Dự án', value: data.projects, color: 'bg-purple-500' },
  ];

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Phân tích dữ liệu</h3>
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
                animate={{ width: `${(item.value / maxValue) * 100}%` }}
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

export default function AdminDashboardPage() {
  const { stats, isLoading, error, refresh } = useAdminStats();

  useEffect(() => {
    refresh();
  }, [refresh]);

  const statCards = [
    {
      title: 'Tổng người dùng',
      value: stats.users,
      icon: Users,
      color: 'bg-gradient-to-r from-blue-500 to-blue-600',
    },
    {
      title: 'Kế hoạch',
      value: stats.plannings,
      icon: Calendar,
      color: 'bg-gradient-to-r from-green-500 to-green-600',
    },
    {
      title: 'Dự án',
      value: stats.projects,
      icon: FolderOpen,
      color: 'bg-gradient-to-r from-purple-500 to-purple-600',
    },
  ];

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Tổng quan hệ thống</h1>
            <p className="text-gray-600">Thống kê và phân tích dữ liệu tổng quan</p>
          </div>
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
      </motion.div>

      {error && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center space-x-2"
        >
          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
          <span>{error}</span>
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
            />
          )
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <SimpleChart data={stats} />
        </motion.div>

        {/* Additional Info Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100"
        >
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <TrendingUp className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Hiệu suất hệ thống</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Uptime</span>
              <span className="text-lg font-bold text-blue-600">99.9%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Response Time</span>
              <span className="text-lg font-bold text-green-600">&lt; 200ms</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Support</span>
              <span className="text-lg font-bold text-purple-600">24/7</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}


