'use client';
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FolderOpen, 
  Clock, 
  DollarSign, 
  Users, 
  TrendingUp, 
  Eye, 
  Filter, 
  Search,
  Calendar,
  MapPin,
  Star,
  AlertCircle,
  CheckCircle,
  XCircle,
  RefreshCw
} from 'lucide-react';
import useProjectManagement from '@/hooks/useProjectManagement';
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

const ProjectStatusBadge = ({ status }: { status: string }) => {
  const statusConfig = {
    DRAFT: { color: 'bg-gray-100 text-gray-800 border-gray-200', label: 'Bản nháp' },
    OPEN_APPLYING: { color: 'bg-blue-100 text-blue-800 border-blue-200', label: 'Đang tuyển' },
    CLOSED_APPLYING: { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', label: 'Đóng tuyển' },
    IN_PROGRESS: { color: 'bg-green-100 text-green-800 border-green-200', label: 'Đang thực hiện' },
    COMPLETED: { color: 'bg-emerald-100 text-emerald-800 border-emerald-200', label: 'Hoàn thành' },
    CANCELLED: { color: 'bg-red-100 text-red-800 border-red-200', label: 'Đã hủy' },
  };

  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.DRAFT;

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${config.color}`}>
      {config.label}
    </span>
  );
};

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
  icon: any; 
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

const LoadingSkeleton = () => (
  <div className="animate-pulse">
    <div className="h-32 bg-gray-200 rounded-xl"></div>
  </div>
);

export default function AdminProjectsPage() {
  const { projects, isLoading, error, refreshProjects } = useProjectManagement();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    refreshProjects();
  }, [refreshProjects]);

  const formatDate = (date: Date | undefined) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('vi-VN');
  };

  const formatCurrency = (amount: number | undefined) => {
    if (!amount) return 'N/A';
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  // Enhanced mock data for projects
  const mockProjects = [
    {
      id: '1',
      title: 'Website E-commerce cho Shop Thời Trang',
      description: 'Xây dựng website bán hàng thời trang với tính năng thanh toán online, quản lý kho hàng và hệ thống đánh giá sản phẩm.',
      projectType: { name: 'Web Development' },
      budget: 15000000,
      minBudget: 12000000,
      maxBudget: 18000000,
      estimateDuration: 45,
      startDate: new Date('2024-01-15'),
      endDate: new Date('2024-03-01'),
      status: 'IN_PROGRESS',
      location: 'Hồ Chí Minh',
      createdDate: new Date('2024-01-10'),
      views: 156
    },
    {
      id: '2',
      title: 'Mobile App Quản lý Nhà Hàng',
      description: 'Ứng dụng di động để quản lý đơn hàng, menu, nhân viên và báo cáo doanh thu cho nhà hàng.',
      projectType: { name: 'Mobile Development' },
      budget: 25000000,
      minBudget: 20000000,
      maxBudget: 30000000,
      estimateDuration: 60,
      startDate: new Date('2024-02-01'),
      endDate: new Date('2024-04-01'),
      status: 'OPEN_APPLYING',
      location: 'Hà Nội',
      createdDate: new Date('2024-01-25'),
      views: 89
    },
    {
      id: '3',
      title: 'Hệ thống CRM cho Công ty Bất Động Sản',
      description: 'Phần mềm quản lý khách hàng, dự án và báo cáo cho công ty bất động sản.',
      projectType: { name: 'Web Development' },
      budget: 35000000,
      minBudget: 30000000,
      maxBudget: 40000000,
      estimateDuration: 90,
      startDate: new Date('2023-11-01'),
      endDate: new Date('2024-02-01'),
      status: 'COMPLETED',
      location: 'Đà Nẵng',
      createdDate: new Date('2023-10-15'),
      views: 234
    },
    {
      id: '4',
      title: 'Website Tin Tức Thể Thao',
      description: 'Website tin tức thể thao với hệ thống live score, video highlights và bình luận.',
      projectType: { name: 'Web Development' },
      budget: 18000000,
      minBudget: 15000000,
      maxBudget: 22000000,
      estimateDuration: 50,
      startDate: new Date('2024-01-20'),
      endDate: new Date('2024-03-10'),
      status: 'IN_PROGRESS',
      location: 'Cần Thơ',
      createdDate: new Date('2024-01-15'),
      views: 67
    },
    {
      id: '5',
      title: 'App Đặt Xe Taxi',
      description: 'Ứng dụng đặt xe taxi với tính năng theo dõi vị trí real-time và thanh toán điện tử.',
      projectType: { name: 'Mobile Development' },
      budget: 40000000,
      minBudget: 35000000,
      maxBudget: 45000000,
      estimateDuration: 75,
      startDate: new Date('2024-02-15'),
      endDate: new Date('2024-05-01'),
      status: 'CLOSED_APPLYING',
      location: 'Hồ Chí Minh',
      createdDate: new Date('2024-02-01'),
      views: 145
    },
    {
      id: '6',
      title: 'Website Du Lịch',
      description: 'Website đặt tour du lịch với hệ thống booking, thanh toán và quản lý tour.',
      projectType: { name: 'Web Development' },
      budget: 22000000,
      minBudget: 18000000,
      maxBudget: 26000000,
      estimateDuration: 55,
      startDate: new Date('2023-12-01'),
      endDate: new Date('2024-01-30'),
      status: 'COMPLETED',
      location: 'Nha Trang',
      createdDate: new Date('2023-11-20'),
      views: 198
    },
    {
      id: '7',
      title: 'Hệ thống Quản lý Kho',
      description: 'Phần mềm quản lý kho hàng với tính năng nhập xuất, kiểm kê và báo cáo tồn kho.',
      projectType: { name: 'Desktop Application' },
      budget: 28000000,
      minBudget: 25000000,
      maxBudget: 32000000,
      estimateDuration: 70,
      startDate: new Date('2024-03-01'),
      endDate: new Date('2024-05-10'),
      status: 'DRAFT',
      location: 'Hải Phòng',
      createdDate: new Date('2024-02-20'),
      views: 45
    },
    {
      id: '8',
      title: 'App Học Tiếng Anh',
      description: 'Ứng dụng học tiếng Anh với AI, bài tập tương tác và theo dõi tiến độ học tập.',
      projectType: { name: 'Mobile Development' },
      budget: 32000000,
      minBudget: 28000000,
      maxBudget: 36000000,
      estimateDuration: 80,
      startDate: new Date('2024-02-10'),
      endDate: new Date('2024-04-30'),
      status: 'IN_PROGRESS',
      location: 'Hà Nội',
      createdDate: new Date('2024-01-30'),
      views: 123
    }
  ];

  // Use mock data if no real projects
  const displayProjects = projects.length > 0 ? projects : mockProjects;

  // Filter projects based on search and status
  const filteredProjects = displayProjects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Calculate project statistics
  const projectStats = {
    total: displayProjects.length,
    active: displayProjects.filter(p => p.status === 'IN_PROGRESS').length,
    completed: displayProjects.filter(p => p.status === 'COMPLETED').length,
    draft: displayProjects.filter(p => p.status === 'DRAFT').length,
    totalBudget: displayProjects.reduce((sum, p) => sum + (p.budget || 0), 0),
    avgBudget: displayProjects.length > 0 ? displayProjects.reduce((sum, p) => sum + (p.budget || 0), 0) / displayProjects.length : 0,
  };

  const statCards = [
    {
      title: 'Tổng dự án',
      value: projectStats.total,
      icon: FolderOpen,
      color: 'bg-gradient-to-r from-blue-500 to-blue-600',
      subtitle: 'Tất cả dự án',
      trend: { value: 12, isPositive: true }
    },
    {
      title: 'Đang thực hiện',
      value: projectStats.active,
      icon: Clock,
      color: 'bg-gradient-to-r from-green-500 to-green-600',
      subtitle: 'Dự án hoạt động',
      trend: { value: 8, isPositive: true }
    },
    {
      title: 'Hoàn thành',
      value: projectStats.completed,
      icon: CheckCircle,
      color: 'bg-gradient-to-r from-emerald-500 to-emerald-600',
      subtitle: 'Dự án thành công',
      trend: { value: 15, isPositive: true }
    },
    {
      title: 'Tổng ngân sách',
      value: formatCurrency(projectStats.totalBudget),
      icon: DollarSign,
      color: 'bg-gradient-to-r from-purple-500 to-purple-600',
      subtitle: 'Tổng giá trị',
      trend: { value: 20, isPositive: true }
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Quản lý dự án</h1>
            <p className="text-gray-600">Theo dõi và quản lý tất cả dự án trong hệ thống</p>
          </div>
          <div className="flex items-center space-x-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={refreshProjects}
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
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
        </motion.div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

      {/* Filters and Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
      >
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Tìm kiếm dự án..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="DRAFT">Bản nháp</option>
              <option value="OPEN_APPLYING">Đang tuyển</option>
              <option value="CLOSED_APPLYING">Đóng tuyển</option>
              <option value="IN_PROGRESS">Đang thực hiện</option>
              <option value="COMPLETED">Hoàn thành</option>
              <option value="CANCELLED">Đã hủy</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Projects Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden"
      >
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <FolderOpen className="w-5 h-5 mr-2 text-blue-600" />
            Danh sách dự án ({filteredProjects.length})
          </h3>
        </div>
        
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 border-b border-gray-200">
                <TableHead className="font-semibold text-gray-700 min-w-[200px]">Dự án</TableHead>
                <TableHead className="font-semibold text-gray-700 min-w-[120px]">Loại</TableHead>
                <TableHead className="font-semibold text-gray-700 min-w-[100px]">Ngân sách</TableHead>
                <TableHead className="font-semibold text-gray-700 min-w-[100px]">Thời gian</TableHead>
                <TableHead className="font-semibold text-gray-700 min-w-[100px]">Trạng thái</TableHead>
                <TableHead className="font-semibold text-gray-700 min-w-[100px]">Ngày tạo</TableHead>
                <TableHead className="font-semibold text-gray-700 min-w-[80px] text-center">Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12">
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <RefreshCw className="animate-spin h-8 w-8 text-blue-600" />
                      <p className="text-gray-500">Đang tải dữ liệu...</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredProjects.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12 text-gray-500">
                    <div className="flex flex-col items-center space-y-2">
                      <FolderOpen className="w-12 h-12 text-gray-300" />
                      <p className="font-medium">Không có dự án nào</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredProjects.map((project, index) => (
                  <TableRow key={`project-${project.id}-${index}`} className="hover:bg-gray-50 transition-colors">
                    <TableCell>
                      <div className="space-y-1">
                        <p className="font-semibold text-gray-900">{project.title}</p>
                        <p className="text-sm text-gray-600 line-clamp-2">{project.description}</p>
                        {project.location && (
                          <div className="flex items-center text-xs text-gray-500">
                            <MapPin className="w-3 h-3 mr-1" />
                            {project.location}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                        {typeof project.projectType === 'object' ? project.projectType?.name : project.projectType}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {project.budget && (
                          <p className="font-semibold text-green-600">{formatCurrency(project.budget)}</p>
                        )}
                        {project.minBudget && project.maxBudget && (
                          <p className="text-xs text-gray-500">
                            {formatCurrency(project.minBudget)} - {formatCurrency(project.maxBudget)}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {project.estimateDuration && (
                          <p className="text-sm font-medium text-gray-900">{project.estimateDuration} ngày</p>
                        )}
                        {project.startDate && project.endDate && (
                          <div className="text-xs text-gray-500">
                            <div className="flex items-center">
                              <Calendar className="w-3 h-3 mr-1" />
                              {formatDate(project.startDate)}
                            </div>
                            <div className="flex items-center">
                              <Calendar className="w-3 h-3 mr-1" />
                              {formatDate(project.endDate)}
                            </div>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <ProjectStatusBadge status={project.status} />
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-gray-600">
                        {formatDate(project.createdDate)}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <button
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Xem chi tiết"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </motion.div>
    </div>
  );
}


