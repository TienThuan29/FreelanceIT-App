'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useDeveloperProfile } from '@/hooks/useDeveloperProfile';
import { useAuth } from '@/contexts/AuthContext';
import Image from 'next/image';

const DeveloperDetailPage: React.FC = () => {
    const router = useRouter();
    const params = useParams();
    const developerId = params?.id as string;
    
    const { user, isAuthenticated, isLoading: authLoading } = useAuth();
    const {
        userProfile,
        developerProfile,
        isLoading,
        error,
        getDeveloperProfile,
        clearErrors
    } = useDeveloperProfile();

    const [activeTab, setActiveTab] = useState<'overview' | 'skills' | 'portfolio'>('overview');

    // Load developer profile when component mounts
    useEffect(() => {
        if (developerId && isAuthenticated && user?.role === 'CUSTOMER') {
            getDeveloperProfile(developerId);
        }
    }, [developerId, getDeveloperProfile, isAuthenticated, user]);

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
            case 'JUNIOR': return 'Junior Developer';
            case 'MID': return 'Mid-level Developer';
            case 'SENIOR': return 'Senior Developer';
            case 'LEAD': return 'Lead Developer';
            default: return level;
        }
    };

    const handleRetry = () => {
        clearErrors();
        if (developerId) {
            getDeveloperProfile(developerId);
        }
    };

    const handleContact = () => {
        // TODO: Implement contact/hire functionality
        alert('Chức năng liên hệ sẽ được triển khai sớm!');
    };

    if (authLoading) {
        return (
            <>  
                <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                    <div className="text-center">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                        {/* <h3 className="text-xl font-semibold text-gray-700 mb-2">Đang kiểm tra quyền truy cập...</h3> */}
                        {/* <p className="text-gray-500">Vui lòng chờ trong giây lát</p> */}
                    </div>
                </div>
            </>
        );
    }

    if (!isAuthenticated) {
        return (
            <>
                <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-8 max-w-md mx-auto">
                        <h3 className="text-xl font-semibold text-yellow-800 mb-2">Yêu cầu đăng nhập</h3>
                        <p className="text-yellow-600 mb-4">Bạn cần đăng nhập để xem chi tiết developer</p>
                        <button
                            onClick={() => router.push('/login')}
                            className="bg-yellow-600 text-white px-6 py-3 rounded-lg hover:bg-yellow-700 transition-colors duration-200 font-medium w-full"
                        >
                            Đăng nhập ngay
                        </button>
                    </div>
                </div>
            </>
        );
    }

    if (user?.role !== 'CUSTOMER') {
        return (
            <>
                <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                    <div className="bg-red-50 border border-red-200 rounded-xl p-8 max-w-md mx-auto">
                        <h3 className="text-xl font-semibold text-red-800 mb-2">Không có quyền truy cập</h3>
                        <p className="text-red-600 mb-4">Chỉ khách hàng mới có thể xem chi tiết developer</p>
                        <button
                            onClick={() => router.push('/')}
                            className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors duration-200 font-medium w-full"
                        >
                            Về trang chủ
                        </button>
                    </div>
                </div>
            </>
        );
    }

    if (isLoading) {
        return (
            <>
                <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                    <div className="text-center">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">Đang tải thông tin developer...</h3>
                        <p className="text-gray-500">Vui lòng chờ trong giây lát</p>
                    </div>
                </div>
            </>
        );
    }

    if (error) {
        return (
            <>
                <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                    <div className="bg-red-50 border border-red-200 rounded-xl p-8 max-w-md mx-auto">
                        <h3 className="text-xl font-semibold text-red-800 mb-2">Có lỗi xảy ra</h3>
                        <p className="text-red-600 mb-4">{error}</p>
                        <button
                            onClick={handleRetry}
                            className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors duration-200 font-medium w-full"
                        >
                            Thử lại
                        </button>
                    </div>
                </div>
            </>
        );
    }

    if (!userProfile || !developerProfile) {
        return (
            <>
                <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-8 max-w-md mx-auto">
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">Không tìm thấy developer</h3>
                        <p className="text-gray-600 mb-4">Developer này không tồn tại hoặc không còn khả dụng</p>
                        <button
                            onClick={() => router.push('/posts-dev')}
                            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium w-full"
                        >
                            Quay lại danh sách
                        </button>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <div className="min-h-screen bg-gray-50">
                {/* Header */}
                <div className="bg-white border-b border-gray-200">
                    <div className="container mx-auto px-4 py-6">
                        <button
                            onClick={() => router.push('/posts-dev')}
                            className="flex items-center text-gray-600 hover:text-gray-800 mb-4 transition-colors duration-200 cursor-pointer"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Quay lại danh sách
                        </button>
                        
                        <div className="flex flex-col md:flex-row gap-6 items-start">
                            {/* Avatar */}
                            <div className="flex-shrink-0">
                                {userProfile.avatarUrl ? (
                                    <Image
                                        src={userProfile.avatarUrl}
                                        alt={userProfile.fullname}
                                        width={120}
                                        height={120}
                                        className="w-30 h-30 rounded-full object-cover"
                                    />
                                ) : (
                                    <div className="w-30 h-30 rounded-full bg-gray-100 flex items-center justify-center">
                                        <span className="text-gray-500 text-4xl font-semibold">
                                            {userProfile.fullname?.charAt(0)?.toUpperCase() || 'D'}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Basic Info */}
                            <div className="flex-1 min-w-0">
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                    <div>
                                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                            {userProfile.fullname}
                                        </h1>
                                        <p className="text-xl text-gray-600 mb-3">
                                            {developerProfile.title || 'Developer'}
                                        </p>
                                        {developerProfile.developerLevel && (
                                            <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getLevelColor(developerProfile.developerLevel)}`}>
                                                {getLevelText(developerProfile.developerLevel)}
                                            </span>
                                        )}
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex flex-col sm:flex-row gap-3">
                                        <button
                                            onClick={handleContact}
                                            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
                                        >
                                            Liên hệ ngay
                                        </button>
                                        <button className="bg-white border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium">
                                            Lưu vào danh sách yêu thích
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="container mx-auto px-4 py-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Tabs */}
                            <div className="bg-white rounded-lg border border-gray-200">
                                <div className="border-b border-gray-200">
                                    <nav className="flex space-x-8 px-6">
                                        <button
                                            onClick={() => setActiveTab('overview')}
                                            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                                                activeTab === 'overview'
                                                    ? 'border-blue-500 text-blue-600'
                                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                                            }`}
                                        >
                                            Tổng quan
                                        </button>
                                        <button
                                            onClick={() => setActiveTab('skills')}
                                            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                                                activeTab === 'skills'
                                                    ? 'border-blue-500 text-blue-600'
                                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                                            }`}
                                        >
                                            Kỹ năng
                                        </button>
                                        <button
                                            onClick={() => setActiveTab('portfolio')}
                                            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                                                activeTab === 'portfolio'
                                                    ? 'border-blue-500 text-blue-600'
                                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                                            }`}
                                        >
                                            Portfolio
                                        </button>
                                    </nav>
                                </div>

                                <div className="p-6">
                                    {/* Overview Tab */}
                                    {activeTab === 'overview' && (
                                        <div className="space-y-6">
                                            {/* Bio */}
                                            {developerProfile.bio && (
                                                <div>
                                                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Giới thiệu</h3>
                                                    <p className="text-gray-600 leading-relaxed">
                                                        {developerProfile.bio}
                                                    </p>
                                                </div>
                                            )}

                                            {/* Experience */}
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-900 mb-3">Kinh nghiệm</h3>
                                                <div className="bg-blue-50 rounded-lg p-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                                            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6" />
                                                            </svg>
                                                        </div>
                                                        <div>
                                                            <p className="font-semibold text-gray-900">
                                                                {developerProfile.experienceYears || 0} năm kinh nghiệm
                                                            </p>
                                                            <p className="text-gray-600">
                                                                {developerProfile.totalProjects || 0} dự án đã hoàn thành
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Languages */}
                                            {developerProfile.languages && developerProfile.languages.length > 0 && (
                                                <div>
                                                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Ngôn ngữ</h3>
                                                    <div className="flex flex-wrap gap-2">
                                                        {developerProfile.languages.map((language, index) => (
                                                            <span
                                                                key={index}
                                                                className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium"
                                                            >
                                                                {language}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Timezone */}
                                            {developerProfile.timezone && (
                                                <div>
                                                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Múi giờ</h3>
                                                    <p className="text-gray-600">{developerProfile.timezone}</p>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Skills Tab */}
                                    {activeTab === 'skills' && (
                                        <div className="space-y-6">
                                            {developerProfile.skills && developerProfile.skills.length > 0 ? (
                                                <div>
                                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Kỹ năng chuyên môn</h3>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        {developerProfile.skills.map((skill, index) => (
                                                            <div key={index} className="bg-gray-50 rounded-lg p-4">
                                                                <h4 className="font-semibold text-gray-900 mb-2">{skill.name}</h4>
                                                                <p className="text-gray-600 text-sm">Kỹ năng chuyên môn</p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="text-center py-8">
                                                    <div className="text-gray-400 text-4xl mb-4">🛠️</div>
                                                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Chưa có thông tin kỹ năng</h3>
                                                    <p className="text-gray-500">Developer chưa cập nhật thông tin kỹ năng</p>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Portfolio Tab */}
                                    {activeTab === 'portfolio' && (
                                        <div className="space-y-6">
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Liên kết</h3>
                                                <div className="space-y-3">
                                                    {developerProfile.githubUrl && (
                                                        <a
                                                            href={developerProfile.githubUrl}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                                                        >
                                                            <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center">
                                                                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                                                                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                                                                </svg>
                                                            </div>
                                                            <span className="text-gray-700 font-medium">GitHub Profile</span>
                                                        </a>
                                                    )}
                                                    
                                                    {developerProfile.linkedinUrl && (
                                                        <a
                                                            href={developerProfile.linkedinUrl}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                                                        >
                                                            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                                                                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                                                                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                                                                </svg>
                                                            </div>
                                                            <span className="text-gray-700 font-medium">LinkedIn Profile</span>
                                                        </a>
                                                    )}

                                                    {developerProfile.cvUrl && (
                                                        <a
                                                            href={developerProfile.cvUrl}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                                                        >
                                                            <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
                                                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                                </svg>
                                                            </div>
                                                            <span className="text-gray-700 font-medium">CV/Resume</span>
                                                        </a>
                                                    )}
                                                </div>
                                            </div>

                                            {(!developerProfile.githubUrl && !developerProfile.linkedinUrl && !developerProfile.cvUrl) && (
                                                <div className="text-center py-8">
                                                    <div className="text-gray-400 text-4xl mb-4">🔗</div>
                                                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Chưa có liên kết portfolio</h3>
                                                    <p className="text-gray-500">Developer chưa cập nhật thông tin portfolio</p>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Contact Card */}
                            <div className="bg-white rounded-lg border border-gray-200 p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Thông tin liên hệ</h3>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                                            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">Trạng thái</p>
                                            <p className="text-sm text-green-600">
                                                {developerProfile.isAvailable ? 'Sẵn sàng làm việc' : 'Đang bận'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">Giá/giờ</p>
                                            <p className="text-sm text-gray-600">
                                                {developerProfile.hourlyRate || 0} VND
                                            </p>
                                        </div>
                                    </div>

                                    {developerProfile.rating && (
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                                                <svg className="w-4 h-4 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">Đánh giá</p>
                                                <div className="flex items-center gap-1">
                                                    <span className="text-sm font-medium text-gray-900">
                                                        {developerProfile.rating.toFixed(1)}
                                                    </span>
                                                    <span className="text-xs text-gray-500">
                                                        ({Math.floor(Math.random() * 50) + 10} đánh giá)
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <button
                                    onClick={handleContact}
                                    className="w-full mt-4 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
                                >
                                    Liên hệ ngay
                                </button>
                            </div>

                            {/* Quick Stats */}
                            <div className="bg-white rounded-lg border border-gray-200 p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Thống kê nhanh</h3>
                                <div className="space-y-4">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Kinh nghiệm</span>
                                        <span className="font-medium text-gray-900">
                                            {developerProfile.experienceYears || 0} năm
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Dự án hoàn thành</span>
                                        <span className="font-medium text-gray-900">
                                            {developerProfile.totalProjects || 0}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Cấp độ</span>
                                        <span className="font-medium text-gray-900">
                                            {getLevelText(developerProfile.developerLevel || '')}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default DeveloperDetailPage;
