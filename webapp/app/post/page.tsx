"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import type { Project } from '@/types';
import { mockProjects } from '@/data/mockProjects';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Role } from '@/types/user.type';
import Footer from '@/components/Footer';
import NavbarAuthenticated from '@/components/NavbarAuthenticated'; // Import NavbarAuthenticated component

export default function PostPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [filter, setFilter] = useState({
    search: '',
    skills: '',
    budget: '',
    status: 'open',
    sort: 'newest'
  });

  // Rest of the state and helper functions...
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setProjects(mockProjects);
      setLoading(false);
    }, 1000);
  }, []);

  // Your existing filter and formatting functions
  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(filter.search.toLowerCase()) ||
      project.description.toLowerCase().includes(filter.search.toLowerCase());
    const matchesSkills = filter.skills === '' ||
      project.skills.some(skill => skill.toLowerCase().includes(filter.skills.toLowerCase()));
    const matchesStatus = filter.status === 'all' || project.status === filter.status;

    return matchesSearch && matchesSkills && matchesStatus;
  }).sort((a, b) => {
    if (filter.sort === 'newest') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else if (filter.sort === 'deadline') {
      return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
    } else if (filter.sort === 'budget-high') {
      return b.budget - a.budget;
    } else if (filter.sort === 'budget-low') {
      return a.budget - b.budget;
    }
    return 0;
  });

  const getStatusColor = (status: Project['status']) => {
    switch (status) {
      case 'open': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: Project['status']) => {
    switch (status) {
      case 'open': return 'Đang tuyển';
      case 'in_progress': return 'Đang thực hiện';
      case 'completed': return 'Hoàn thành';
      case 'cancelled': return 'Đã hủy';
      default: return 'Không xác định';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  const formatDateDistance = (date: Date) => {
    const now = new Date();
    const diffInDays = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    if (diffInDays < 0) {
      return `Đã hết hạn ${Math.abs(diffInDays)} ngày trước`;
    } else if (diffInDays === 0) {
      return 'Hết hạn hôm nay';
    } else if (diffInDays === 1) {
      return 'Còn 1 ngày';
    } else if (diffInDays <= 7) {
      return `Còn ${diffInDays} ngày`;
    } else if (diffInDays <= 30) {
      const weeks = Math.floor(diffInDays / 7);
      return `Còn ${weeks} tuần`;
    } else {
      const months = Math.floor(diffInDays / 30);
      return `Còn ${months} tháng`;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Replace the custom header with NavbarAuthenticated component */}
        <NavbarAuthenticated />

        {/* Breadcrumbs */}
        <div className="bg-gray-50 border-b border-gray-100">
          <div className="container mx-auto px-4 py-2">
            <div className="flex items-center text-sm">
              <Link href="/" className="text-gray-500 hover:text-gray-700">Trang chủ</Link>
              <svg className="w-4 h-4 mx-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <span className="text-blue-600 font-medium">Dự án Freelance</span>
            </div>
          </div>
        </div>

        {/* Quick Filter Categories - TopCV style */}
        <div className="bg-white border-b border-gray-200 py-3">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 overflow-x-auto pb-2 scrollbar-hide">
                <a href="#" className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-full text-sm font-medium whitespace-nowrap">Tất cả dự án</a>
                <a href="#" className="px-3 py-1.5 hover:bg-gray-50 text-gray-700 rounded-full text-sm whitespace-nowrap">Frontend</a>
                <a href="#" className="px-3 py-1.5 hover:bg-gray-50 text-gray-700 rounded-full text-sm whitespace-nowrap">Backend</a>
                <a href="#" className="px-3 py-1.5 hover:bg-gray-50 text-gray-700 rounded-full text-sm whitespace-nowrap">Full Stack</a>
                <a href="#" className="px-3 py-1.5 hover:bg-gray-50 text-gray-700 rounded-full text-sm whitespace-nowrap">Mobile</a>
                <a href="#" className="px-3 py-1.5 hover:bg-gray-50 text-gray-700 rounded-full text-sm whitespace-nowrap">UI/UX</a>
                <a href="#" className="px-3 py-1.5 hover:bg-gray-50 text-gray-700 rounded-full text-sm whitespace-nowrap">DevOps</a>
              </div>
              <div className="hidden lg:block">
                <span className="text-sm text-gray-500">Tìm thấy {filteredProjects.length} dự án phù hợp</span>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Filter Toggle */}
        <div className="lg:hidden bg-white shadow-sm py-2 sticky top-16 z-40">
          <div className="container mx-auto px-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="w-full flex items-center justify-center space-x-2 bg-blue-50 hover:bg-blue-100 text-blue-600 py-2 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
              <span className="font-medium">{isSidebarOpen ? "Ẩn bộ lọc" : "Hiện bộ lọc"}</span>
            </button>
          </div>
        </div>

        <div className="container mx-auto flex-1">
          <div className="flex flex-col lg:flex-row">
            {/* Sidebar Filter with scrollbar-hide */}
            <div className={`lg:w-64 bg-white shadow-sm lg:block ${isSidebarOpen ? 'block' : 'hidden'} lg:sticky lg:top-16 lg:h-[calc(100vh-64px)] overflow-y-auto scrollbar-hide`}
              style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
              <div className="p-4 border-r border-gray-200 h-full">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-base font-semibold text-gray-900">Bộ lọc dự án</h2>
                  <button
                    onClick={() => setIsSidebarOpen(false)}
                    className="p-1 text-gray-500 hover:text-gray-700 lg:hidden"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Search */}
                <div className="mb-5">
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">
                    Tìm kiếm
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Tìm kiếm dự án..."
                      value={filter.search}
                      onChange={(e) => setFilter(prev => ({ ...prev, search: e.target.value }))}
                      className="w-full pl-9 pr-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    <svg className="absolute left-2.5 top-2 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>

                {/* Skills Filter */}
                <div className="mb-5">
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">
                    Kỹ năng
                  </label>
                  <input
                    type="text"
                    placeholder="React, Node.js..."
                    value={filter.skills}
                    onChange={(e) => setFilter(prev => ({ ...prev, skills: e.target.value }))}
                    className="w-full px-2.5 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                {/* Status Filter */}
                <div className="mb-5">
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">
                    Trạng thái
                  </label>
                  <select
                    value={filter.status}
                    onChange={(e) => setFilter(prev => ({ ...prev, status: e.target.value }))}
                    className="w-full px-2.5 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="all">Tất cả</option>
                    <option value="open">Đang tuyển</option>
                    <option value="in_progress">Đang thực hiện</option>
                    <option value="completed">Hoàn thành</option>
                  </select>
                </div>

                {/* Budget Range - Improved Layout */}
                <div className="mb-5">
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">
                    Mức ngân sách
                  </label>
                  <div className="grid grid-cols-2 gap-1.5 text-sm">
                    <button
                      onClick={() => setFilter(prev => ({ ...prev, budget: 'low' }))}
                      className={`px-2 py-1.5 rounded text-xs border ${filter.budget === 'low' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'text-gray-700 border-gray-200 hover:bg-gray-50'}`}
                    >
                      &lt; 5 triệu
                    </button>
                    <button
                      onClick={() => setFilter(prev => ({ ...prev, budget: 'medium' }))}
                      className={`px-2 py-1.5 rounded text-xs border ${filter.budget === 'medium' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'text-gray-700 border-gray-200 hover:bg-gray-50'}`}
                    >
                      5-10 triệu
                    </button>
                    <button
                      onClick={() => setFilter(prev => ({ ...prev, budget: 'high' }))}
                      className={`px-2 py-1.5 rounded text-xs border ${filter.budget === 'high' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'text-gray-700 border-gray-200 hover:bg-gray-50'}`}
                    >
                      10-20 triệu
                    </button>
                    <button
                      onClick={() => setFilter(prev => ({ ...prev, budget: 'premium' }))}
                      className={`px-2 py-1.5 rounded text-xs border ${filter.budget === 'premium' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'text-gray-700 border-gray-200 hover:bg-gray-50'}`}
                    >
                      &gt; 20 triệu
                    </button>
                  </div>
                </div>

                {/* Location filter (new) */}
                <div className="mb-5">
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">
                    Địa điểm
                  </label>
                  <select
                    className="w-full px-2.5 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="">Tất cả</option>
                    <option value="hcm">TP. Hồ Chí Minh</option>
                    <option value="hn">Hà Nội</option>
                    <option value="dn">Đà Nẵng</option>
                    <option value="remote">Remote</option>
                  </select>
                </div>

                {/* Clear Filters */}
                <button
                  onClick={() => setFilter({ search: '', skills: '', budget: '', status: 'open', sort: 'newest' })}
                  className="w-full px-3 py-1.5 text-gray-600 border border-gray-300 rounded hover:bg-gray-50 transition-colors text-xs"
                >
                  Xóa bộ lọc
                </button>

                {/* Quick Stats */}
                <div className="mt-5 bg-gray-50 rounded p-3 border border-gray-100">
                  <h3 className="text-xs font-medium text-gray-700 mb-2">Thống kê</h3>
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600">Tổng dự án:</span>
                      <span className="font-medium">{projects.length}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600">Đang tuyển:</span>
                      <span className="font-medium text-green-600">{projects.filter(p => p.status === 'open').length}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600">Có thể apply:</span>
                      <span className="font-medium text-blue-600">{filteredProjects.filter(p => p.status === 'open').length}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-4 lg:p-6">
              {/* Rest of your existing content */}
              {/* Header with Sort */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    Dự án Freelance IT
                  </h1>
                  <p className="text-gray-600">
                    {filteredProjects.length} dự án phù hợp với lựa chọn của bạn
                  </p>
                </div>

                <div className="mt-4 md:mt-0">
                  <label className="flex items-center space-x-2">
                    <span className="text-sm text-gray-700">Sắp xếp:</span>
                    <select
                      value={filter.sort}
                      onChange={(e) => setFilter(prev => ({ ...prev, sort: e.target.value }))}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    >
                      <option value="newest">Mới nhất</option>
                      <option value="deadline">Deadline gần nhất</option>
                      <option value="budget-high">Ngân sách cao đến thấp</option>
                      <option value="budget-low">Ngân sách thấp đến cao</option>
                    </select>
                  </label>
                </div>
              </div>

              {/* Featured Projects */}
              {filteredProjects.some(p => p.featured) && (
                <div className="mb-8">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    Dự án nổi bật
                  </h2>

                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-1 rounded-xl">
                    {filteredProjects.filter(p => p.featured).slice(0, 1).map(project => (
                      <div key={project.id} className="bg-white rounded-lg shadow-md border border-blue-100 overflow-hidden">
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-1 text-xs font-medium flex justify-between">
                          <span>Dự án nổi bật</span>
                          <span>✨ Được tài trợ</span>
                        </div>
                        <div className="p-6">
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex-1">
                              <h3 className="text-xl font-bold text-gray-900 mb-2">
                                {project.title}
                              </h3>
                              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-3">
                                <span className="flex items-center">
                                  <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                  </svg>
                                  Đăng: {formatDate(project.createdAt)}
                                </span>
                                <span className="flex items-center text-amber-600 font-medium">
                                  <svg className="w-4 h-4 mr-1 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  {formatDateDistance(project.deadline)}
                                </span>
                              </div>
                            </div>
                            <div className="flex flex-col items-end space-y-2">
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                                {getStatusText(project.status)}
                              </span>
                              <div className="text-right">
                                <div className="text-2xl font-bold text-blue-600">
                                  {formatCurrency(project.budget)}
                                </div>
                              </div>
                            </div>
                          </div>

                          <p className="text-gray-700 mb-4">
                            {project.description}
                          </p>

                          <div className="flex flex-wrap gap-2 mb-5">
                            {project.skills.map(skill => (
                              <span key={skill} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-md">
                                {skill}
                              </span>
                            ))}
                          </div>

                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4 border-t border-gray-100">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 border border-gray-200">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                              </div>
                              <div className="text-sm">
                                <p className="font-medium text-gray-900">Công ty ABC Tech</p>
                                <p className="text-gray-500">TP. Hồ Chí Minh</p>
                              </div>
                            </div>
                            <div className="flex space-x-3">
                              <button
                                onClick={() => router.push(`/detail-post/${project.id}`)}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex-1 sm:flex-none flex justify-center items-center"
                              >
                                Apply ngay
                              </button>
                              <button
                                onClick={() => router.push(`/detail-post/${project.id}`)}
                                className="px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors text-sm font-medium flex items-center justify-center"
                              >
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                                Chi tiết
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Projects Grid - Now with horizontal layout cards */}
              <div className="space-y-6">
                {filteredProjects.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-gray-400 text-6xl mb-4">🔍</div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Không tìm thấy dự án nào
                    </h3>
                    <p className="text-gray-500">
                      Thử thay đổi bộ lọc hoặc tìm kiếm với từ khóa khác
                    </p>
                  </div>
                ) : (
                  filteredProjects
                    .filter(p => !p.featured)
                    .map(project => (
                      <div key={project.id} className="bg-white rounded-lg shadow-sm hover:shadow transition-shadow border border-gray-200 group">
                        <div className="p-6">
                          <div className="flex flex-col md:flex-row gap-6 relative">
                            {/* Left Column - Company/Project Info */}
                            <div className="md:w-3/5">
                              <div className="flex items-start gap-4">
                                {/* Company Logo/Avatar */}
                                <div className="w-40 h-40 rounded-lg bg-gray-100 border border-gray-200 flex-shrink-0 flex items-center justify-center overflow-hidden">
                                  <img
                                    src={`https://ui-avatars.com/api/?name=ABC+Tech&background=0D8ABC&color=fff&size=200&bold=true`}
                                    alt="Công ty ABC Tech"
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      e.currentTarget.onerror = null;
                                      e.currentTarget.src = "https://via.placeholder.com/80x80?text=ABC";
                                    }}
                                  />
                                </div>

                                {/* Project Title and Description */}
                                <div className="flex-1">
                                  <h3 className="text-lg font-semibold text-gray-900 mb-1.5 line-clamp-1 hover:text-blue-600">
                                    <a href={`/detail-post/${project.id}`}>{project.title}</a>
                                  </h3>
                                  <div className="text-sm text-gray-500 mb-2">
                                    <span className="font-medium">Công ty ABC Tech</span> • <span>TP. Hồ Chí Minh</span>
                                  </div>
                                  <p className="text-gray-700 mb-3 line-clamp-2 text-sm">
                                    {project.description}
                                  </p>

                                  {/* Skills Tags */}
                                  <div className="flex flex-wrap gap-2">
                                    {project.skills.slice(0, 4).map(skill => (
                                      <span key={skill} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-md">
                                        {skill}
                                      </span>
                                    ))}
                                    {project.skills.length > 4 && (
                                      <span className="px-2 py-1 bg-gray-50 text-gray-600 text-xs rounded-md">
                                        +{project.skills.length - 4}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Right Column - Project Details (moved to far right) */}
                            <div className="md:w-2/5 flex flex-col justify-between md:pl-6 pt-4 md:pt-0">
                              <div className="flex flex-row md:flex-col justify-between items-end">
                                {/* Budget */}
                                <div className="mb-3 text-right">
                                  <div className="text-xl font-bold text-blue-600">
                                    {formatCurrency(project.budget)}
                                  </div>
                                  <div className="text-xs text-gray-500">Ngân sách dự án</div>
                                </div>

                                {/* Status and Deadline */}
                                <div className="flex flex-col items-end">
                                  <span className={`px-3 py-1 rounded-full text-xs font-medium mb-2 ${getStatusColor(project.status)}`}>
                                    {getStatusText(project.status)}
                                  </span>
                                  <span className="flex items-center text-sm text-amber-600">
                                    <svg className="w-4 h-4 mr-1 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    {formatDateDistance(project.deadline)}
                                  </span>
                                </div>
                              </div>

                              {/* Footer Info - Date and Actions */}
                              <div className="flex flex-row justify-between items-center mt-4 pt-3 border-t border-gray-100">
                                {/* Post Date */}
                                <div className="text-xs text-gray-500 flex items-center">
                                  <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                  </svg>
                                  <span>Đăng: {formatDate(project.createdAt)}</span>
                                </div>

                                {/* Actions - Only visible on hover */}
                                <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                  <button
                                    onClick={() => router.push(`/detail-post/${project.id}`)}
                                    className="px-3 py-1 text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 transition-colors text-sm"
                                  >
                                    Chi tiết
                                  </button>
                                  {project.status === 'open' && (
                                    <button
                                      onClick={() => router.push(`/detail-post/${project.id}`)}
                                      className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
                                    >
                                      Apply
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                )}
              </div>

              {/* Pagination */}
              <div className="mt-8 flex justify-center">
                <nav className="inline-flex rounded-md shadow">
                  <a href="#" className="px-3 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                    Trước
                  </a>
                  <a href="#" className="px-3 py-2 border-t border-b border-gray-300 bg-blue-50 text-sm font-medium text-blue-600">
                    1
                  </a>
                  <a href="#" className="px-3 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                    2
                  </a>
                  <a href="#" className="px-3 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                    3
                  </a>
                  <span className="px-3 py-2 border-t border-b border-gray-300 bg-white text-sm text-gray-500">
                    ...
                  </span>
                  <a href="#" className="px-3 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                    10
                  </a>
                  <a href="#" className="px-3 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                    Sau
                  </a>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
