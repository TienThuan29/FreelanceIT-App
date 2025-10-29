'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useDeveloperProfile } from '@/hooks/useDeveloperProfile';
import { useAuth } from '@/contexts/AuthContext';
import Image from 'next/image';
import performanceMonitor from '@/utils/performance';

const DevelopersListPage: React.FC = () => {
    const router = useRouter();
    const { user, isAuthenticated, isLoading: authLoading } = useAuth();
    const {
        developersList,
        totalAvailable,
        isLoadingList,
        listError,
        isFromCache,
        getDevelopersByPage,
        clearErrors,
        refreshDevelopersList,
        clearCache
    } = useDeveloperProfile();

    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(12);

    // Load developers when component mounts or pagination changes (only for customers)
    useEffect(() => {
        if (isAuthenticated && user?.role === 'CUSTOMER') {
            getDevelopersByPage(currentPage, pageSize);
        }
    }, [currentPage, pageSize, getDevelopersByPage, isAuthenticated, user]);

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
    };

    const handlePageSizeChange = (newPageSize: number) => {
        setPageSize(newPageSize);
        setCurrentPage(1); // Reset to first page when changing page size
    };

    const handleRetry = () => {
        clearErrors();
        getDevelopersByPage(currentPage, pageSize);
    };

    const handleRefresh = () => {
        refreshDevelopersList();
    };

    const handleClearCache = () => {
        clearCache();
        // Refresh the current page after clearing cache
        getDevelopersByPage(currentPage, pageSize, true);
    };

    const handleShowPerformanceStats = () => {
        performanceMonitor.logSummary();
        const metrics = performanceMonitor.getMetrics();
        const hitRate = performanceMonitor.getCacheHitRate();
        
        alert(`Performance Statistics:
Cache Hit Rate: ${hitRate.toFixed(2)}%
Total API Calls: ${metrics.apiCalls}
Average Response Time: ${metrics.averageResponseTime.toFixed(2)}ms

Check console for detailed logs.`);
    };

    const getLevelColor = (level: string) => {
        switch (level) {
            case 'JUNIOR': return 'bg-green-100 text-green-800';
            case 'MID': return 'bg-blue-100 text-blue-800';
            case 'SENIOR': return 'bg-purple-100 text-purple-800';
            case 'LEAD': return 'bg-orange-100 text-orange-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getLevelText = (level: string) => {
        switch (level) {
            case 'JUNIOR': return 'Junior';
            case 'MID': return 'Mid-level';
            case 'SENIOR': return 'Senior';
            case 'LEAD': return 'Lead';
            default: return level;
        }
    };

    return (
        <>
            <div className="min-h-screen bg-gray-50">
                {/* Hero Section */}
                {/* <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-16">
                    <div className="container mx-auto px-4 text-center">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">
                            Tìm kiếm Developer IT
                        </h1>
                        <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto leading-relaxed">
                            Dành cho <span className="font-semibold">Khách hàng</span> - Kết nối với những <span className="font-semibold">Developer tài năng</span> và <span className="font-semibold">sẵn sàng làm việc</span> tại Việt Nam
                        </p>
                    </div>
                </section> */}

                {/* Role Validation */}
                {authLoading ? (
                    <section className="py-20">
                        <div className="container mx-auto px-4 text-center">
                            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                            <h3 className="text-xl font-semibold text-gray-700 mb-2">Đang kiểm tra quyền truy cập...</h3>
                            <p className="text-gray-500">Vui lòng chờ trong giây lát</p>
                        </div>
                    </section>
                ) : !isAuthenticated ? (
                    <section className="py-20">
                        <div className="container mx-auto px-4 text-center">
                            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-8 max-w-md mx-auto">
                                <h3 className="text-xl font-semibold text-yellow-800 mb-2">Yêu cầu đăng nhập</h3>
                                <p className="text-yellow-600 mb-4">Bạn cần đăng nhập để xem danh sách developers</p>
                                <a
                                    href="/login"
                                    className="bg-yellow-600 text-white px-6 py-3 rounded-lg hover:bg-yellow-700 transition-colors duration-200 font-medium inline-block"
                                >
                                    Đăng nhập ngay
                                </a>
                            </div>
                        </div>
                    </section>
                ) : user?.role !== 'CUSTOMER' ? (
                    <section className="py-20">
                        <div className="container mx-auto px-4 text-center">
                            <div className="bg-red-50 border border-red-200 rounded-xl p-8 max-w-md mx-auto">
                                <h3 className="text-xl font-semibold text-red-800 mb-2">Không có quyền truy cập</h3>
                                <p className="text-red-600 mb-4">Chỉ khách hàng mới có thể xem danh sách developers</p>
                                <Link
                                    href="/"
                                    className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors duration-200 font-medium inline-block"
                                >
                                    Về trang chủ
                                </Link>
                            </div>
                        </div>
                    </section>
                ) : (
                    <>
                        {/* Filters Section */}
                        <section className="bg-white py-8 shadow-sm">
                            <div className="container mx-auto px-4">
                                <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <span className="text-gray-700 font-medium">Hiển thị:</span>
                                        <select
                                            value={pageSize}
                                            onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                                            className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        >
                                            <option value={6}>6</option>
                                            <option value={12}>12</option>
                                            <option value={24}>24</option>
                                            <option value={48}>48</option>
                                        </select>
                                        <span className="text-gray-500">developers/trang</span>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        {/* Cache Status */}
                                        {/* {isFromCache && (
                                            <div className="flex items-center gap-2 text-sm">
                                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                                <span className="text-green-600 font-medium">Từ cache</span>
                                            </div>
                                        )} */}

                                        {/* Refresh Button */}
                                        <button
                                            onClick={handleRefresh}
                                            disabled={isLoadingList}
                                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 text-sm font-medium"
                                        >
                                            <svg 
                                                className={`w-4 h-4 ${isLoadingList ? 'animate-spin' : ''}`} 
                                                fill="none" 
                                                stroke="currentColor" 
                                                viewBox="0 0 24 24"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                            </svg>
                                            Làm mới
                                        </button>

                                        {/* Clear Cache Button */}
                                        {/* <button
                                            onClick={handleClearCache}
                                            className="flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 text-sm font-medium"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                            Xóa cache
                                        </button> */}

                                        {/* Performance Stats Button */}
                                        {/* <button
                                            onClick={handleShowPerformanceStats}
                                            className="flex items-center gap-2 px-3 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors duration-200 text-sm font-medium"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                            </svg>
                                            Thống kê
                                        </button> */}
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Loading State */}
                        {isLoadingList && (
                            <section className="py-20">
                                <div className="container mx-auto px-4 text-center">
                                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                                    <h3 className="text-xl font-semibold text-gray-700 mb-2">Đang tải danh sách developers...</h3>
                                    <p className="text-gray-500">Vui lòng chờ trong giây lát</p>
                                </div>
                            </section>
                        )}

                        {/* Error State */}
                        {listError && (
                            <section className="py-20">
                                <div className="container mx-auto px-4 text-center">
                                    <div className="bg-red-50 border border-red-200 rounded-xl p-8 max-w-md mx-auto">
                                        <h3 className="text-xl font-semibold text-red-800 mb-2">Có lỗi xảy ra</h3>
                                        <p className="text-red-600 mb-4">{listError}</p>
                                        <button
                                            onClick={handleRetry}
                                            className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors duration-200 font-medium"
                                        >
                                            Thử lại
                                        </button>
                                    </div>
                                </div>
                            </section>
                        )}

                        {/* Developers Grid */}
                        {!isLoadingList && !listError && (
                            <section className="py-12">
                                <div className="container mx-auto px-4">
                                    {developersList.length > 0 ? (
                                        <>
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
                                                {developersList.map((developer, index) => (
                                                    <div
                                                        key={developer.userProfile.id || index}
                                                        className="bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200 p-6"
                                                    >
                                                        {/* Avatar and Basic Info */}
                                                        <div className="flex items-center mb-4">
                                                            <div className="flex-shrink-0">
                                                                {developer.userProfile.avatarUrl ? (
                                                                    <Image
                                                                        src={developer.userProfile.avatarUrl}
                                                                        alt={developer.userProfile.fullname}
                                                                        width={48}
                                                                        height={48}
                                                                        className="w-12 h-12 rounded-full object-cover"
                                                                    />
                                                                ) : (
                                                                    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                                                                        <span className="text-gray-500 text-lg font-semibold">
                                                                            {developer.userProfile.fullname?.charAt(0)?.toUpperCase() || 'D'}
                                                                        </span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <div className="ml-3 flex-1 min-w-0">
                                                                <h3 className="text-base font-semibold text-gray-900 truncate">
                                                                    {developer.userProfile.fullname}
                                                                </h3>
                                                                <p className="text-sm text-gray-600 truncate">
                                                                    {developer.developerProfile?.title || 'Developer'}
                                                                </p>
                                                            </div>
                                                        </div>

                                                        {/* Level Badge */}
                                                        {developer.developerProfile?.developerLevel && (
                                                            <div className="mb-3">
                                                                <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${getLevelColor(developer.developerProfile.developerLevel)}`}>
                                                                    {getLevelText(developer.developerProfile.developerLevel)}
                                                                </span>
                                                            </div>
                                                        )}

                                                        {/* Bio */}
                                                        {developer.developerProfile?.bio && (
                                                            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                                                                {developer.developerProfile.bio}
                                                            </p>
                                                        )}

                                                        {/* Skills */}
                                                        {developer.developerProfile?.skills && developer.developerProfile.skills.length > 0 && (
                                                            <div className="mb-4">
                                                                <div className="flex flex-wrap gap-1">
                                                                    {developer.developerProfile.skills.slice(0, 2).map((skill, skillIndex) => (
                                                                        <span
                                                                            key={skillIndex}
                                                                            className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded font-medium"
                                                                        >
                                                                            {skill.name}
                                                                        </span>
                                                                    ))}
                                                                    {developer.developerProfile.skills.length > 2 && (
                                                                        <span className="text-gray-500 text-xs px-2 py-1">
                                                                            +{developer.developerProfile.skills.length - 2}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        )}

                                                        {/* Key Stats */}
                                                        <div className="space-y-2 mb-4">
                                                            <div className="flex justify-between text-sm">
                                                                <span className="text-gray-600">Giá:</span>
                                                                <span className="font-medium text-green-600">
                                                                    {developer.developerProfile?.hourlyRate || 0} VND/h
                                                                </span>
                                                            </div>
                                                            <div className="flex justify-between text-sm">
                                                                <span className="text-gray-600">Kinh nghiệm:</span>
                                                                <span className="font-medium text-blue-600">
                                                                    {developer.developerProfile?.experienceYears || 0}+ năm
                                                                </span>
                                                            </div>
                                                            {developer.developerProfile?.rating && (
                                                                <div className="flex justify-between text-sm">
                                                                    <span className="text-gray-600">Đánh giá:</span>
                                                                    <div className="flex items-center">
                                                                        <span className="text-yellow-400 mr-1">★</span>
                                                                        <span className="font-medium">{developer.developerProfile.rating.toFixed(1)}</span>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>

                                                        {/* Action Button */}
                                                        <button 
                                                            onClick={() => router.push(`/posts-dev/${developer.userProfile.id}`)}
                                                            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200 text-sm font-medium cursor-pointer"
                                                        >
                                                            Xem chi tiết
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Pagination */}
                                            <div className="flex justify-center items-center space-x-4">
                                                <button
                                                    onClick={() => handlePageChange(currentPage - 1)}
                                                    disabled={currentPage === 1}
                                                    className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                                                >
                                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                                    </svg>
                                                    Trước
                                                </button>

                                                <div className="flex items-center space-x-2">
                                                    <span className="text-gray-600">Trang</span>
                                                    <span className="font-semibold text-blue-600">{currentPage}</span>
                                                </div>

                                                <button
                                                    onClick={() => handlePageChange(currentPage + 1)}
                                                    disabled={totalAvailable === 0 || (currentPage * pageSize) >= totalAvailable}
                                                    className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                                                >
                                                    Sau
                                                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="text-center py-20">
                                            <div className="text-gray-400 text-6xl mb-4">👥</div>
                                            <h3 className="text-2xl font-semibold text-gray-700 mb-2">
                                                Không tìm thấy developer nào
                                            </h3>
                                            <p className="text-gray-500 mb-6">
                                                Hiện tại không có developer nào đang sẵn sàng làm việc
                                            </p>
                                            <button
                                                onClick={() => getDevelopersByPage(1, pageSize)}
                                                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
                                            >
                                                Tải lại
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </section>
                        )}

                        {/* Stats Section */}
                        <section className="bg-white py-16">
                            <div className="container mx-auto px-4">
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                                    <div>
                                        <div className="text-3xl font-bold text-blue-600 mb-2">
                                            {totalAvailable || '0'}
                                        </div>
                                        <div className="text-gray-600">Developers hiện có</div>
                                    </div>
                                    <div>
                                        <div className="text-3xl font-bold text-green-600 mb-2">100%</div>
                                        <div className="text-gray-600">Sẵn sàng làm việc</div>
                                    </div>
                                    <div>
                                        <div className="text-3xl font-bold text-purple-600 mb-2">
                                            {developersList.filter(d => d.developerProfile?.developerLevel === 'SENIOR' || d.developerProfile?.developerLevel === 'LEAD').length}
                                        </div>
                                        <div className="text-gray-600">Senior+ Level</div>
                                    </div>
                                    <div>
                                        <div className="text-3xl font-bold text-orange-600 mb-2">24/7</div>
                                        <div className="text-gray-600">Hỗ trợ</div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </>
                )}
            </div>
        </>
    );
};

export default DevelopersListPage;