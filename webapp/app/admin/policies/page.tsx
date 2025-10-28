'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Shield, 
  Users, 
  Calendar, 
  Edit, 
  Eye, 
  Plus,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
  Globe,
  Lock,
  Unlock,
  Download
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export default function AdminPoliciesPage() {
  const [selectedPolicy, setSelectedPolicy] = useState<any>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Mock policies data
  const policies = [
    {
      id: '1',
      title: 'Điều khoản sử dụng dịch vụ',
      type: 'Terms of Service',
      category: 'Legal',
      status: 'active',
      version: '2.1',
      lastUpdated: '2024-01-20',
      effectiveDate: '2024-01-01',
      views: 1247,
      downloads: 89,
      description: 'Điều khoản và điều kiện sử dụng dịch vụ FreelanceIT Platform',
      content: 'Đây là nội dung chi tiết của điều khoản sử dụng dịch vụ...',
      author: 'Admin System',
      language: 'vi-VN',
      isPublic: true
    },
    {
      id: '2',
      title: 'Chính sách bảo mật thông tin',
      type: 'Privacy Policy',
      category: 'Privacy',
      status: 'active',
      version: '1.8',
      lastUpdated: '2024-01-18',
      effectiveDate: '2024-01-01',
      views: 892,
      downloads: 45,
      description: 'Chính sách bảo mật và xử lý thông tin cá nhân của người dùng',
      content: 'Đây là nội dung chi tiết của chính sách bảo mật...',
      author: 'Legal Team',
      language: 'vi-VN',
      isPublic: true
    },
    {
      id: '3',
      title: 'Chính sách hoàn tiền',
      type: 'Refund Policy',
      category: 'Financial',
      status: 'active',
      version: '1.3',
      lastUpdated: '2024-01-15',
      effectiveDate: '2024-01-01',
      views: 456,
      downloads: 23,
      description: 'Chính sách hoàn tiền và xử lý khiếu nại của khách hàng',
      content: 'Đây là nội dung chi tiết của chính sách hoàn tiền...',
      author: 'Finance Team',
      language: 'vi-VN',
      isPublic: true
    },
    {
      id: '4',
      title: 'Quy định về quyền sở hữu trí tuệ',
      type: 'Intellectual Property',
      category: 'Legal',
      status: 'draft',
      version: '1.0',
      lastUpdated: '2024-01-22',
      effectiveDate: '2024-02-01',
      views: 234,
      downloads: 12,
      description: 'Quy định về quyền sở hữu trí tuệ và bản quyền',
      content: 'Đây là nội dung chi tiết của quy định về quyền sở hữu trí tuệ...',
      author: 'Legal Team',
      language: 'vi-VN',
      isPublic: false
    },
    {
      id: '5',
      title: 'Chính sách xử lý vi phạm',
      type: 'Violation Policy',
      category: 'Compliance',
      status: 'active',
      version: '1.5',
      lastUpdated: '2024-01-12',
      effectiveDate: '2024-01-01',
      views: 678,
      downloads: 34,
      description: 'Chính sách xử lý các vi phạm và hành vi không phù hợp',
      content: 'Đây là nội dung chi tiết của chính sách xử lý vi phạm...',
      author: 'Compliance Team',
      language: 'vi-VN',
      isPublic: true
    },
    {
      id: '6',
      title: 'Quy định về bảo mật dữ liệu',
      type: 'Data Security',
      category: 'Security',
      status: 'review',
      version: '2.0',
      lastUpdated: '2024-01-25',
      effectiveDate: '2024-02-15',
      views: 345,
      downloads: 18,
      description: 'Quy định về bảo mật và bảo vệ dữ liệu người dùng',
      content: 'Đây là nội dung chi tiết của quy định về bảo mật dữ liệu...',
      author: 'Security Team',
      language: 'vi-VN',
      isPublic: false
    }
  ];

  const policyStats = {
    total: policies.length,
    active: policies.filter(p => p.status === 'active').length,
    draft: policies.filter(p => p.status === 'draft').length,
    review: policies.filter(p => p.status === 'review').length,
    totalViews: policies.reduce((sum, p) => sum + p.views, 0),
    totalDownloads: policies.reduce((sum, p) => sum + p.downloads, 0),
    publicPolicies: policies.filter(p => p.isPublic).length,
    privatePolicies: policies.filter(p => !p.isPublic).length
  };

  const categories = [
    { name: 'Legal', count: policies.filter(p => p.category === 'Legal').length, color: 'bg-red-100 text-red-800' },
    { name: 'Privacy', count: policies.filter(p => p.category === 'Privacy').length, color: 'bg-blue-100 text-blue-800' },
    { name: 'Financial', count: policies.filter(p => p.category === 'Financial').length, color: 'bg-green-100 text-green-800' },
    { name: 'Compliance', count: policies.filter(p => p.category === 'Compliance').length, color: 'bg-purple-100 text-purple-800' },
    { name: 'Security', count: policies.filter(p => p.category === 'Security').length, color: 'bg-orange-100 text-orange-800' }
  ];

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('vi-VN');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'draft': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'review': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'inactive': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'Hoạt động';
      case 'draft': return 'Bản nháp';
      case 'review': return 'Đang xem xét';
      case 'inactive': return 'Không hoạt động';
      default: return 'Không xác định';
    }
  };

  const filteredPolicies = policies.filter(policy => {
    const matchesSearch = policy.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         policy.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || policy.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const StatCard = ({ title, value, icon: Icon, color, subtitle, delay = 0 }: any) => (
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
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-3xl font-bold text-gray-900"
              >
                {typeof value === 'number' ? value.toLocaleString() : value}
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
      </div>
    </motion.div>
  );

  const handleViewPolicy = (policy: any) => {
    setSelectedPolicy(policy);
    setIsViewModalOpen(true);
  };

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
            <h1 className="text-3xl font-bold text-gray-900">Quản lý chính sách</h1>
            <p className="text-gray-500 text-sm mt-1">
              Quản lý các chính sách, điều khoản và quy định của hệ thống
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center space-x-2">
              <Filter className="w-4 h-4" />
              <span>Lọc</span>
            </button>
            <button 
              onClick={() => setIsCreateModalOpen(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Tạo chính sách</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Tổng chính sách"
          value={policyStats.total}
          icon={FileText}
          color="bg-gradient-to-r from-blue-500 to-blue-600"
          subtitle="Tất cả chính sách"
          delay={0.1}
        />
        <StatCard
          title="Đang hoạt động"
          value={policyStats.active}
          icon={CheckCircle}
          color="bg-gradient-to-r from-green-500 to-green-600"
          subtitle="Chính sách có hiệu lực"
          delay={0.2}
        />
        <StatCard
          title="Lượt xem"
          value={policyStats.totalViews}
          icon={Eye}
          color="bg-gradient-to-r from-purple-500 to-purple-600"
          subtitle="Tổng lượt xem"
          delay={0.3}
        />
        <StatCard
          title="Lượt tải"
          value={policyStats.totalDownloads}
          icon={Download}
          color="bg-gradient-to-r from-orange-500 to-orange-600"
          subtitle="Tổng lượt tải xuống"
          delay={0.4}
        />
      </div>

      {/* Categories Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="bg-white rounded-xl shadow-lg border border-gray-100 p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Shield className="w-5 h-5 mr-2 text-blue-600" />
          Phân loại chính sách
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {categories.map((category, index) => (
            <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${category.color} mb-2`}>
                {category.name}
              </div>
              <p className="text-2xl font-bold text-gray-900">{category.count}</p>
              <p className="text-xs text-gray-500">chính sách</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Search and Filter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="bg-white rounded-xl shadow-lg border border-gray-100 p-6"
      >
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Tìm kiếm chính sách..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="active">Hoạt động</option>
            <option value="draft">Bản nháp</option>
            <option value="review">Đang xem xét</option>
            <option value="inactive">Không hoạt động</option>
          </select>
        </div>
      </motion.div>

      {/* Policies Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.7 }}
        className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden"
      >
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Danh sách chính sách</h3>
          <p className="text-sm text-gray-500 mt-1">Quản lý và theo dõi tất cả các chính sách hệ thống</p>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 border-b border-gray-200">
                <TableHead className="font-semibold text-gray-700">Tiêu đề</TableHead>
                <TableHead className="font-semibold text-gray-700">Loại</TableHead>
                <TableHead className="font-semibold text-gray-700">Danh mục</TableHead>
                <TableHead className="font-semibold text-gray-700">Trạng thái</TableHead>
                <TableHead className="font-semibold text-gray-700">Phiên bản</TableHead>
                <TableHead className="font-semibold text-gray-700">Cập nhật</TableHead>
                <TableHead className="font-semibold text-gray-700">Lượt xem</TableHead>
                <TableHead className="font-semibold text-gray-700">Công khai</TableHead>
                <TableHead className="font-semibold text-gray-700 text-center">Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPolicies.map((policy, index) => (
                <TableRow key={policy.id} className="hover:bg-gray-50 transition-colors">
                  <TableCell>
                    <div>
                      <p className="font-semibold text-gray-900">{policy.title}</p>
                      <p className="text-sm text-gray-500 max-w-xs truncate">{policy.description}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {policy.type}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      policy.category === 'Legal' ? 'bg-red-100 text-red-800' :
                      policy.category === 'Privacy' ? 'bg-blue-100 text-blue-800' :
                      policy.category === 'Financial' ? 'bg-green-100 text-green-800' :
                      policy.category === 'Compliance' ? 'bg-purple-100 text-purple-800' :
                      'bg-orange-100 text-orange-800'
                    }`}>
                      {policy.category}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(policy.status)}`}>
                      {getStatusLabel(policy.status)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="font-mono text-sm text-gray-700">v{policy.version}</span>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="text-sm text-gray-700">{formatDate(policy.lastUpdated)}</p>
                      <p className="text-xs text-gray-500">by {policy.author}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center text-sm text-gray-600">
                      <Eye className="w-3 h-3 mr-1" />
                      {policy.views.toLocaleString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    {policy.isPublic ? (
                      <div className="flex items-center text-green-600">
                        <Globe className="w-4 h-4 mr-1" />
                        <span className="text-sm">Công khai</span>
                      </div>
                    ) : (
                      <div className="flex items-center text-gray-600">
                        <Lock className="w-4 h-4 mr-1" />
                        <span className="text-sm">Riêng tư</span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <button
                        onClick={() => handleViewPolicy(policy)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Xem chi tiết"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors" title="Chỉnh sửa">
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </motion.div>

      {/* View Policy Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">{selectedPolicy?.title}</DialogTitle>
            <DialogDescription>
              {selectedPolicy?.description}
            </DialogDescription>
          </DialogHeader>

          {selectedPolicy && (
            <div className="space-y-6 mt-4">
              {/* Policy Info */}
              <div className="bg-gray-50 rounded-xl p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Loại</p>
                    <p className="font-medium text-gray-900">{selectedPolicy.type}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Danh mục</p>
                    <p className="font-medium text-gray-900">{selectedPolicy.category}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phiên bản</p>
                    <p className="font-medium text-gray-900">v{selectedPolicy.version}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Ngôn ngữ</p>
                    <p className="font-medium text-gray-900">{selectedPolicy.language}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Cập nhật lần cuối</p>
                    <p className="font-medium text-gray-900">{formatDate(selectedPolicy.lastUpdated)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Có hiệu lực từ</p>
                    <p className="font-medium text-gray-900">{formatDate(selectedPolicy.effectiveDate)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Tác giả</p>
                    <p className="font-medium text-gray-900">{selectedPolicy.author}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Trạng thái</p>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(selectedPolicy.status)}`}>
                      {getStatusLabel(selectedPolicy.status)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Policy Content */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Nội dung chính sách</h4>
                <div className="prose max-w-none">
                  <p className="text-gray-700 leading-relaxed">{selectedPolicy.content}</p>
                </div>
              </div>

              {/* Statistics */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center">
                    <Eye className="w-5 h-5 text-blue-600 mr-2" />
                    <div>
                      <p className="text-sm text-blue-600 font-medium">Lượt xem</p>
                      <p className="text-xl font-bold text-blue-900">{selectedPolicy.views.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="flex items-center">
                    <Download className="w-5 h-5 text-green-600 mr-2" />
                    <div>
                      <p className="text-sm text-green-600 font-medium">Lượt tải</p>
                      <p className="text-xl font-bold text-green-900">{selectedPolicy.downloads.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Create Policy Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">Tạo chính sách mới</DialogTitle>
            <DialogDescription>
              Tạo một chính sách hoặc điều khoản mới cho hệ thống
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tiêu đề <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nhập tiêu đề chính sách"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Loại <span className="text-red-500">*</span>
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="">Chọn loại chính sách</option>
                  <option value="Terms of Service">Điều khoản sử dụng</option>
                  <option value="Privacy Policy">Chính sách bảo mật</option>
                  <option value="Refund Policy">Chính sách hoàn tiền</option>
                  <option value="Intellectual Property">Quyền sở hữu trí tuệ</option>
                  <option value="Violation Policy">Chính sách xử lý vi phạm</option>
                  <option value="Data Security">Bảo mật dữ liệu</option>
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mô tả <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Mô tả ngắn gọn về chính sách"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nội dung <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={8}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Nội dung chi tiết của chính sách"
              />
            </div>
            
            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="px-6 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Hủy
              </button>
              <button className="px-6 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                Tạo chính sách
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
