'use client';
import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Users, Calendar, Shield, DollarSign, Star } from 'lucide-react';
import { ProtectedRoute } from '@/contexts/AuthContext';
import { PageUrl } from '@/configs/page.url';
import { useAdminSidebarStats } from '@/hooks/useAdminSidebarStats';

const Sidebar: React.FC = () => {
  const { stats: sidebarStats, isLoading } = useAdminSidebarStats();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const menuItems = useMemo(() => [
    { 
      href: PageUrl.ADMIN_DASHBOARD_PAGE, 
      label: 'Tổng quan', 
      icon: BarChart3, 
      description: 'Thống kê tổng quan',
      badge: 'Live',
      badgeColor: 'bg-green-100 text-green-800',
      stats: isLoading ? '...' : `${sidebarStats?.totalUsers || 0} users`
    },
    { 
      href: PageUrl.ADMIN_USERS_PAGE, 
      label: 'Người dùng', 
      icon: Users, 
      description: 'Quản lý users & profiles',
      badge: 'Active',
      badgeColor: 'bg-blue-100 text-blue-800',
      stats: isLoading ? '...' : `${sidebarStats?.developers || 0} devs • ${sidebarStats?.customers || 0} customers`
    },
    { 
      href: PageUrl.ADMIN_PLANNING_PAGE, 
      label: 'Gói người dùng', 
      icon: Calendar, 
      description: 'Quản lý gói người dùng',
      badge: isLoading ? '...' : `${sidebarStats?.totalPlannings || 0} gói`,
      badgeColor: 'bg-purple-100 text-purple-800',
      stats: 'Quản lý gói người dùng'
    },
    // { 
    //   href: PageUrl.ADMIN_PROJECTS_PAGE, 
    //   label: 'Dự án', 
    //   icon: FolderOpen, 
    //   description: 'Quản lý dự án',
    //   badge: isLoading ? '...' : `${sidebarStats?.totalProjects || 0} dự án`,
    //   badgeColor: 'bg-orange-100 text-orange-800',
    //   stats: 'Quản lý dự án'
    // },
    { 
      href: '/admin/revenue', 
      label: 'Doanh thu', 
      icon: DollarSign, 
      description: 'Quản lý doanh thu',
      badge: isLoading ? '...' : formatCurrency(sidebarStats?.monthlyRevenue || 0),
      badgeColor: 'bg-emerald-100 text-emerald-800',
      stats: 'Doanh thu tháng này'
    },
    { 
      href: PageUrl.ADMIN_RATINGS_PAGE, 
      label: 'Đánh giá người dùng', 
      icon: Star, 
      description: 'Quản lý đánh giá',
      badge: isLoading ? '...' : `${sidebarStats?.totalRatings || 0} đánh giá`,
      badgeColor: 'bg-yellow-100 text-yellow-800',
      stats: 'Tổng đánh giá'
    },
  ], [sidebarStats, isLoading]);

  return (
    <aside className="w-64 border-r border-gray-200 bg-white h-screen sticky top-0 shadow-lg">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Admin Panel</h2>
            <p className="text-xs text-gray-500">Quản trị hệ thống</p>
          </div>
        </div>
      </div>
          <nav className="p-4 space-y-1">
            {menuItems.map((item, index) => (
              <motion.a
                key={item.href}
                href={item.href}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ x: 4 }}
                className="flex items-start space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-700 transition-all duration-200 group"
              >
                <item.icon className="w-5 h-5 group-hover:scale-110 transition-transform duration-200 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-medium block">{item.label}</span>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${item.badgeColor} ml-2`}>
                      {item.badge}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500 group-hover:text-blue-500 block">{item.description}</span>
                  <span className="text-xs text-gray-400 group-hover:text-blue-400 block mt-1">{item.stats}</span>
                </div>
              </motion.a>
            ))}
          </nav>
      
      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100">
        <div className="text-center">
          <div className="text-xs text-gray-500 mb-1">Phiên bản 1.0.0</div>
          <div className="w-full bg-gray-200 rounded-full h-1">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-1 rounded-full w-3/4"></div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute requiredRole="ADMIN">
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-7xl mx-auto"
            >
              {children}
            </motion.div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}


