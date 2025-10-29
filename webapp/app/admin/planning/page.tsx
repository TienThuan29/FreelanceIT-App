'use client';
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  Eye, 
  Edit, 
  Trash2, 
  Plus,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  XCircle,
  Filter,
  Search,
  X
} from 'lucide-react';
import { usePlanningManagement } from '@/hooks/usePlanningManagement';
import { Planning } from '@/types/planning.type';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface PlanningFormData {
  name: string;
  description: string;
  price: number;
  forDeveloper: boolean;
  forCustomer: boolean;
  detailDevPlanning?: {
    numberOfJoinedProjects: number;
    numberOfProducts: number;
    useChatbot: boolean;
  };
  detailCustomerPlanning?: {
    numberOfProjects: number;
    useChatbot: boolean;
  };
}

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

export default function AdminPlanningPage() {
  const { 
    plannings, 
    isLoading, 
    error, 
    refreshPlannings,
    createPlanning,
    updatePlanning,
    deletePlanning,
    clearError
  } = usePlanningManagement();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedPlanning, setSelectedPlanning] = useState<Planning | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState<PlanningFormData>({
    name: '',
    description: '',
    price: 0,
    forDeveloper: false,
    forCustomer: true,
    detailDevPlanning: {
      numberOfJoinedProjects: 0,
      numberOfProducts: 0,
      useChatbot: false
    },
    detailCustomerPlanning: {
      numberOfProjects: 0,
      useChatbot: false
    }
  });

  useEffect(() => {
    refreshPlannings();
  }, [refreshPlannings]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const result = await createPlanning(formData);
      if (result) {
        setIsCreateModalOpen(false);
        resetForm();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlanning) return;
    
    setIsSubmitting(true);
    try {
      const result = await updatePlanning(selectedPlanning.id, formData);
      if (result) {
        setIsEditModalOpen(false);
        setSelectedPlanning(null);
        resetForm();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa gói planning này?')) {
      await deletePlanning(id);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: 0,
      forDeveloper: false,
      forCustomer: true,
      detailDevPlanning: {
        numberOfJoinedProjects: 0,
        numberOfProducts: 0,
        useChatbot: false
      },
      detailCustomerPlanning: {
        numberOfProjects: 0,
        useChatbot: false
      }
    });
  };

  const openEditModal = (planning: Planning) => {
    setSelectedPlanning(planning);
    setFormData({
      name: planning.name,
      description: planning.description,
      price: planning.price,
      forDeveloper: planning.forDeveloper,
      forCustomer: planning.forCustomer,
      detailDevPlanning: planning.detailDevPlanning || {
        numberOfJoinedProjects: 0,
        numberOfProducts: 0,
        useChatbot: false
      },
      detailCustomerPlanning: planning.detailCustomerPlanning || {
        numberOfProjects: 0,
        useChatbot: false
      }
    });
    setIsEditModalOpen(true);
  };

  const openViewModal = (planning: Planning) => {
    setSelectedPlanning(planning);
    setIsViewModalOpen(true);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('vi-VN').format(new Date(date));
  };

  // Use plannings data
  const displayPlannings = plannings;

  // Filter plannings based on search and status
  const filteredPlannings = displayPlannings.filter(planning => {
    const matchesSearch = planning.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         planning.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'active' && !planning.isDeleted) ||
                         (statusFilter === 'inactive' && planning.isDeleted);
    return matchesSearch && matchesStatus;
  });

  // Calculate planning statistics
  const planningStats = {
    total: displayPlannings.length,
    active: displayPlannings.filter(p => !p.isDeleted).length,
    inactive: displayPlannings.filter(p => p.isDeleted).length,
    totalRevenue: displayPlannings.reduce((sum, p) => sum + p.price, 0),
    avgPrice: displayPlannings.length > 0 ? displayPlannings.reduce((sum, p) => sum + p.price, 0) / displayPlannings.length : 0,
  };

  const statCards = [
    {
      title: 'Tổng gói',
      value: planningStats.total,
      icon: Calendar,
      color: 'bg-gradient-to-r from-blue-500 to-blue-600',
      subtitle: 'Tất cả gói planning',
      trend: { value: 8, isPositive: true }
    },
    {
      title: 'Đang hoạt động',
      value: planningStats.active,
      icon: CheckCircle,
      color: 'bg-gradient-to-r from-green-500 to-green-600',
      subtitle: 'Gói đang bán',
      trend: { value: 12, isPositive: true }
    },
    {
      title: 'Đã vô hiệu',
      value: planningStats.inactive,
      icon: XCircle,
      color: 'bg-gradient-to-r from-red-500 to-red-600',
      subtitle: 'Gói đã ngừng',
      trend: { value: -5, isPositive: false }
    },
    {
      title: 'Tổng giá trị',
      value: formatPrice(planningStats.totalRevenue),
      icon: DollarSign,
      color: 'bg-gradient-to-r from-purple-500 to-purple-600',
      subtitle: 'Tổng giá các gói',
      trend: { value: 15, isPositive: true }
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Quản lý Planning</h1>
            <p className="text-gray-600">Quản lý các gói dịch vụ AI Planning</p>
          </div>
          <div className="flex items-center space-x-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              <Plus className="w-4 h-4" />
              <span>Tạo gói mới</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={refreshPlannings}
              disabled={isLoading}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 disabled:opacity-50"
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
          <button
            onClick={clearError}
            className="ml-auto text-red-600 hover:text-red-800"
          >
            <XCircle className="w-4 h-4" />
          </button>
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
                placeholder="Tìm kiếm gói planning..."
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
              <option value="active">Đang hoạt động</option>
              <option value="inactive">Đã vô hiệu</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Planning Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden"
      >
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-blue-600" />
            Danh sách gói người dùng ({filteredPlannings.length})
          </h3>
        </div>
        
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 border-b border-gray-200">
                <TableHead className="font-semibold text-gray-700 min-w-[200px]">Tên gói</TableHead>
                <TableHead className="font-semibold text-gray-700 min-w-[200px]">Mô tả</TableHead>
                <TableHead className="font-semibold text-gray-700 min-w-[100px]">Giá</TableHead>
                <TableHead className="font-semibold text-gray-700 min-w-[120px]">Loại khách hàng</TableHead>
                <TableHead className="font-semibold text-gray-700 min-w-[100px]">Trạng thái</TableHead>
                <TableHead className="font-semibold text-gray-700 min-w-[100px]">Ngày tạo</TableHead>
                <TableHead className="font-semibold text-gray-700 min-w-[120px] text-center">Hành động</TableHead>
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
              ) : filteredPlannings.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12 text-gray-500">
                    <div className="flex flex-col items-center space-y-2">
                      <Calendar className="w-12 h-12 text-gray-300" />
                      <p className="font-medium">Không có gói planning nào</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredPlannings.map((planning, index) => (
                  <TableRow key={`planning-${planning.id}-${index}`} className="hover:bg-gray-50 transition-colors">
                    <TableCell>
                      <div className="space-y-1">
                        <p className="font-semibold text-gray-900">{planning.name}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm text-gray-600 line-clamp-2">{planning.description}</p>
                    </TableCell>
                    <TableCell>
                      <p className="font-semibold text-green-600">{formatPrice(planning.price)}</p>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {planning.forDeveloper && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                            Developer
                          </span>
                        )}
                        {planning.forCustomer && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 border border-purple-200">
                            Customer
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${
                        planning.isDeleted 
                          ? 'bg-red-100 text-red-800 border-red-200' 
                          : 'bg-green-100 text-green-800 border-green-200'
                      }`}>
                        {planning.isDeleted ? 'Đã vô hiệu' : 'Hoạt động'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-gray-600">
                        {formatDate(planning.createdDate)}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          onClick={() => openViewModal(planning)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Xem chi tiết"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openEditModal(planning)}
                          className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
                          title="Chỉnh sửa"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(planning.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Xóa"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </motion.div>

      {/* Create Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={(open) => !isSubmitting && setIsCreateModalOpen(open)}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto relative">
          <button
            onClick={() => {
              setIsCreateModalOpen(false);
              resetForm();
            }}
            disabled={isSubmitting}
            className="absolute right-4 top-4 z-50 p-1 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Close"
          >
            <X className="h-5 w-5 text-gray-600" />
          </button>
          <DialogHeader>
            <DialogTitle className="text-2xl pr-8">Tạo gói Planning mới</DialogTitle>
            <DialogDescription>
              Tạo một gói dịch vụ AI Planning mới cho hệ thống
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreate} className="space-y-6 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tên gói <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nhập tên gói planning"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Giá (₫) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: Number(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mô tả <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Nhập mô tả, phân cách bằng dấu chấm phẩy (;)"
              />
              <p className="mt-1 text-sm text-gray-500">Mỗi mô tả phân cách bằng dấu chấm phẩy (;)</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Loại khách hàng <span className="text-red-500">*</span>
              </label>
              <div className="space-y-3">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.forDeveloper}
                    onChange={(e) => setFormData({...formData, forDeveloper: e.target.checked})}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Dành cho Developer</span>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.forCustomer}
                    onChange={(e) => setFormData({...formData, forCustomer: e.target.checked})}
                    className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                  />
                  <span className="text-sm text-gray-700">Dành cho Customer</span>
                </label>
              </div>
            </div>

            {/* Developer Details */}
            {formData.forDeveloper && (
              <div className="border border-blue-200 rounded-lg p-4 bg-blue-50">
                <h3 className="text-sm font-semibold text-blue-900 mb-3">Chi tiết cho Developer</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Số dự án tham gia
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.detailDevPlanning?.numberOfJoinedProjects || 0}
                      onChange={(e) => setFormData({
                        ...formData,
                        detailDevPlanning: {
                          ...formData.detailDevPlanning!,
                          numberOfJoinedProjects: Number(e.target.value)
                        }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Số sản phẩm
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.detailDevPlanning?.numberOfProducts || 0}
                      onChange={(e) => setFormData({
                        ...formData,
                        detailDevPlanning: {
                          ...formData.detailDevPlanning!,
                          numberOfProducts: Number(e.target.value)
                        }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <label className="flex items-center space-x-3 cursor-pointer mt-4">
                  <input
                    type="checkbox"
                    checked={formData.detailDevPlanning?.useChatbot || false}
                    onChange={(e) => setFormData({
                      ...formData,
                      detailDevPlanning: {
                        ...formData.detailDevPlanning!,
                        useChatbot: e.target.checked
                      }
                    })}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Sử dụng Chatbot</span>
                </label>
              </div>
            )}

            {/* Customer Details */}
            {formData.forCustomer && (
              <div className="border border-purple-200 rounded-lg p-4 bg-purple-50">
                <h3 className="text-sm font-semibold text-purple-900 mb-3">Chi tiết cho Customer</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Số dự án
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.detailCustomerPlanning?.numberOfProjects || 0}
                    onChange={(e) => setFormData({
                      ...formData,
                      detailCustomerPlanning: {
                        ...formData.detailCustomerPlanning!,
                        numberOfProjects: Number(e.target.value)
                      }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <label className="flex items-center space-x-3 cursor-pointer mt-4">
                  <input
                    type="checkbox"
                    checked={formData.detailCustomerPlanning?.useChatbot || false}
                    onChange={(e) => setFormData({
                      ...formData,
                      detailCustomerPlanning: {
                        ...formData.detailCustomerPlanning!,
                        useChatbot: e.target.checked
                      }
                    })}
                    className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                  />
                  <span className="text-sm text-gray-700">Sử dụng Chatbot</span>
                </label>
              </div>
            )}
            
            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={() => {
                  setIsCreateModalOpen(false);
                  resetForm();
                }}
                disabled={isSubmitting}
                className="px-6 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {isSubmitting && <RefreshCw className="w-4 h-4 animate-spin" />}
                <span>{isSubmitting ? 'Đang tạo...' : 'Tạo gói'}</span>
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={(open) => !isSubmitting && setIsEditModalOpen(open)}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto relative">
          <button
            onClick={() => {
              setIsEditModalOpen(false);
              setSelectedPlanning(null);
              resetForm();
            }}
            disabled={isSubmitting}
            className="absolute right-4 top-4 z-50 p-1 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Close"
          >
            <X className="h-5 w-5 text-gray-600" />
          </button>
          <DialogHeader>
            <DialogTitle className="text-2xl pr-8">Chỉnh sửa gói người dùng</DialogTitle>
            <DialogDescription>
              Cập nhật thông tin gói dịch vụ người dùng
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleEdit} className="space-y-6 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tên gói</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Giá (₫)</label>
                <input
                  type="number"
                  required
                  min="0"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: Number(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Mô tả</label>
              <textarea
                required
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Nhập mô tả, phân cách bằng dấu chấm phẩy (;)"
              />
              <p className="mt-1 text-sm text-gray-500">Mỗi mô tả phân cách bằng dấu chấm phẩy (;)</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Loại khách hàng</label>
              <div className="space-y-3">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.forDeveloper}
                    onChange={(e) => setFormData({...formData, forDeveloper: e.target.checked})}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Dành cho Developer</span>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.forCustomer}
                    onChange={(e) => setFormData({...formData, forCustomer: e.target.checked})}
                    className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                  />
                  <span className="text-sm text-gray-700">Dành cho Customer</span>
                </label>
              </div>
            </div>

            {/* Developer Details */}
            {formData.forDeveloper && (
              <div className="border border-blue-200 rounded-lg p-4 bg-blue-50">
                <h3 className="text-sm font-semibold text-blue-900 mb-3">Chi tiết cho Developer</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Số dự án tham gia
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.detailDevPlanning?.numberOfJoinedProjects || 0}
                      onChange={(e) => setFormData({
                        ...formData,
                        detailDevPlanning: {
                          ...formData.detailDevPlanning!,
                          numberOfJoinedProjects: Number(e.target.value)
                        }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Số sản phẩm
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.detailDevPlanning?.numberOfProducts || 0}
                      onChange={(e) => setFormData({
                        ...formData,
                        detailDevPlanning: {
                          ...formData.detailDevPlanning!,
                          numberOfProducts: Number(e.target.value)
                        }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <label className="flex items-center space-x-3 cursor-pointer mt-4">
                  <input
                    type="checkbox"
                    checked={formData.detailDevPlanning?.useChatbot || false}
                    onChange={(e) => setFormData({
                      ...formData,
                      detailDevPlanning: {
                        ...formData.detailDevPlanning!,
                        useChatbot: e.target.checked
                      }
                    })}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Sử dụng Chatbot</span>
                </label>
              </div>
            )}

            {/* Customer Details */}
            {formData.forCustomer && (
              <div className="border border-purple-200 rounded-lg p-4 bg-purple-50">
                <h3 className="text-sm font-semibold text-purple-900 mb-3">Chi tiết cho Customer</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Số dự án
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.detailCustomerPlanning?.numberOfProjects || 0}
                    onChange={(e) => setFormData({
                      ...formData,
                      detailCustomerPlanning: {
                        ...formData.detailCustomerPlanning!,
                        numberOfProjects: Number(e.target.value)
                      }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <label className="flex items-center space-x-3 cursor-pointer mt-4">
                  <input
                    type="checkbox"
                    checked={formData.detailCustomerPlanning?.useChatbot || false}
                    onChange={(e) => setFormData({
                      ...formData,
                      detailCustomerPlanning: {
                        ...formData.detailCustomerPlanning!,
                        useChatbot: e.target.checked
                      }
                    })}
                    className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                  />
                  <span className="text-sm text-gray-700">Sử dụng Chatbot</span>
                </label>
              </div>
            )}
            
            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={() => {
                  setIsEditModalOpen(false);
                  setSelectedPlanning(null);
                  resetForm();
                }}
                disabled={isSubmitting}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {isSubmitting && <RefreshCw className="w-4 h-4 animate-spin" />}
                <span>{isSubmitting ? 'Đang cập nhật...' : 'Cập nhật'}</span>
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* View Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto relative">
          <button
            onClick={() => setIsViewModalOpen(false)}
            className="absolute right-4 top-4 z-50 p-1 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            aria-label="Close"
          >
            <X className="h-5 w-5 text-gray-600" />
          </button>
          <DialogHeader>
            <DialogTitle className="text-2xl pr-8">Chi tiết gói</DialogTitle>
            <DialogDescription>
              Thông tin chi tiết về gói dịch vụ 
            </DialogDescription>
          </DialogHeader>

          {selectedPlanning && (
            <div className="space-y-6 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Tên gói</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedPlanning.name}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Giá</label>
                  <p className="mt-1 text-sm font-semibold text-green-600">{formatPrice(selectedPlanning.price)}</p>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Mô tả</label>
                <div className="mt-1 space-y-1">
                  {selectedPlanning.description.split(';').map((desc, idx) => (
                    <p key={idx} className="text-sm text-gray-900">• {desc.trim()}</p>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Loại khách hàng</label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {selectedPlanning.forDeveloper && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                      Developer
                    </span>
                  )}
                  {selectedPlanning.forCustomer && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 border border-purple-200">
                      Customer
                    </span>
                  )}
                </div>
              </div>

              {/* Developer Details */}
              {selectedPlanning.forDeveloper && selectedPlanning.detailDevPlanning && (
                <div className="border border-blue-200 rounded-lg p-4 bg-blue-50">
                  <h3 className="text-sm font-semibold text-blue-900 mb-3">Chi tiết cho Developer</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Số dự án tham gia</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedPlanning.detailDevPlanning.numberOfJoinedProjects}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Số sản phẩm</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedPlanning.detailDevPlanning.numberOfProducts}</p>
                    </div>
                  </div>
                  <div className="mt-3">
                    <label className="block text-sm font-medium text-gray-700">Chatbot</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {selectedPlanning.detailDevPlanning.useChatbot ? '✓ Có sử dụng' : '✗ Không sử dụng'}
                    </p>
                  </div>
                </div>
              )}

              {/* Customer Details */}
              {selectedPlanning.forCustomer && selectedPlanning.detailCustomerPlanning && (
                <div className="border border-purple-200 rounded-lg p-4 bg-purple-50">
                  <h3 className="text-sm font-semibold text-purple-900 mb-3">Chi tiết cho Customer</h3>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Số dự án</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedPlanning.detailCustomerPlanning.numberOfProjects}</p>
                  </div>
                  <div className="mt-3">
                    <label className="block text-sm font-medium text-gray-700">Chatbot</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {selectedPlanning.detailCustomerPlanning.useChatbot ? '✓ Có sử dụng' : '✗ Không sử dụng'}
                    </p>
                  </div>
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Trạng thái</label>
                <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold border mt-1 ${
                  selectedPlanning.isDeleted 
                    ? 'bg-red-100 text-red-800 border-red-200' 
                    : 'bg-green-100 text-green-800 border-green-200'
                }`}>
                  {selectedPlanning.isDeleted ? 'Đã vô hiệu' : 'Hoạt động'}
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Ngày tạo</label>
                  <p className="mt-1 text-sm text-gray-900">{formatDate(selectedPlanning.createdDate)}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Ngày cập nhật</label>
                  <p className="mt-1 text-sm text-gray-900">{formatDate(selectedPlanning.updateDate)}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
