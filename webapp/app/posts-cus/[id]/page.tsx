"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { ProjectStatus } from '@/types/shared.type';
import Footer from '@/components/Footer';
import useAllProjects from '@/hooks/useAllProjects';
import useApplication from '@/hooks/useApplication';

export default function ProjectDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { user, isAuthenticated } = useAuth();
    const { currentProject, isLoadingDetail, getProjectById } = useAllProjects();
    const { createApplication, checkUserAppliedToProject, isLoading: isApplicationLoading } = useApplication();
    const [isApplying, setIsApplying] = useState(false);
    const [hasApplied, setHasApplied] = useState(false);

    const projectId = params?.id as string;

    useEffect(() => {
        if (projectId) {
            getProjectById(projectId);
            
            // Check if user has already applied to this project
            if (isAuthenticated) {
                checkUserAppliedToProject(projectId).then(setHasApplied);
            }
        }
    }, [projectId, getProjectById, isAuthenticated, checkUserAppliedToProject]);

    const formatCurrency = (amount: number | undefined) => {
        if (!amount) return 'Thỏa thuận';
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    };

    const formatDate = (date: Date | string | undefined) => {
        if (!date) return 'Chưa xác định';
        const dateObj = typeof date === 'string' ? new Date(date) : date;
        return new Intl.DateTimeFormat('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format(dateObj);
    };

    const formatDateDistance = (date: Date | string | undefined) => {
        if (!date) return 'Chưa xác định';
        const now = new Date();
        const dateObj = typeof date === 'string' ? new Date(date) : date;
        const diffInDays = Math.ceil((dateObj.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

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

    const getStatusColor = (status: ProjectStatus) => {
        switch (status) {
            case ProjectStatus.OPEN_APPLYING: return 'bg-green-100 text-green-800';
            case ProjectStatus.IN_PROGRESS: return 'bg-blue-100 text-blue-800';
            case ProjectStatus.COMPLETED: return 'bg-gray-100 text-gray-800';
            case ProjectStatus.CANCELLED: return 'bg-red-100 text-red-800';
            case ProjectStatus.DRAFT: return 'bg-yellow-100 text-yellow-800';
            case ProjectStatus.CLOSED_APPLYING: return 'bg-orange-100 text-orange-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusText = (status: ProjectStatus) => {
        switch (status) {
            case ProjectStatus.OPEN_APPLYING: return 'Đang tuyển';
            case ProjectStatus.IN_PROGRESS: return 'Đang thực hiện';
            case ProjectStatus.COMPLETED: return 'Hoàn thành';
            case ProjectStatus.CANCELLED: return 'Đã hủy';
            case ProjectStatus.DRAFT: return 'Bản nháp';
            case ProjectStatus.CLOSED_APPLYING: return 'Đóng đơn ứng tuyển';
            default: return 'Không xác định';
        }
    };

    const handleApply = async () => {
        if (!isAuthenticated) {
            router.push('/login');
            return;
        }

        if (!currentProject) {
            return;
        }

        setIsApplying(true);
        
        try {
            const success = await createApplication({
                projectId: currentProject.id,
                coverLetter: `Tôi quan tâm đến dự án "${currentProject.title}" và muốn ứng tuyển cho vị trí này.`,
                expectedRate: currentProject.budget ? Math.floor(currentProject.budget * 0.8) : undefined,
                deliveryTime: currentProject.estimateDuration || 30
            });

            if (success) {
                setHasApplied(true);
            }
        } catch (error) {
            console.error('Error applying to project:', error);
        } finally {
            setIsApplying(false);
        }
    };

    if (isLoadingDetail) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Đang tải thông tin dự án...</p>
                </div>
            </div>
        );
    }

    if (!currentProject) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-gray-400 text-6xl mb-4">🔍</div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Không tìm thấy dự án
                    </h3>
                    <p className="text-gray-500 mb-6">
                        Dự án bạn tìm kiếm không tồn tại hoặc đã bị xóa
                    </p>
                    <Link
                        href="/posts-cus"
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Quay lại danh sách dự án
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="min-h-screen bg-gray-50">
                {/* Breadcrumbs */}
                <div className="bg-white border-b border-gray-100">
                    <div className="container mx-auto px-4 py-4">
                        <div className="flex items-center text-sm">
                            <Link href="/" className="text-gray-500 hover:text-gray-700">Trang chủ</Link>
                            <svg className="w-4 h-4 mx-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                            <Link href="/posts-cus" className="text-gray-500 hover:text-gray-700">Dự án Freelance</Link>
                            <svg className="w-4 h-4 mx-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                             <span className="text-blue-600 font-medium">{currentProject.title}</span>
                        </div>
                    </div>
                </div>

                <div className="container mx-auto px-4 py-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Project Header */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <h1 className="text-2xl font-bold text-gray-900 mb-2">{currentProject.title}</h1>
                                        <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                                            <span className="flex items-center">
                                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                Đăng: {formatDate(currentProject.createdDate)}
                                            </span>
                                            <span className="flex items-center">
                                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                </svg>
                                                {currentProject.views || 0} lượt xem
                                            </span>
                                        </div>
                                        <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(currentProject.status)}`}>
                                            {getStatusText(currentProject.status)}
                                        </span>
                                    </div>
                                    {currentProject.imageUrl && (
                                        <div className="ml-6 w-32 h-32 rounded-lg overflow-hidden flex-shrink-0">
                                            <img
                                                src={currentProject.imageUrl}
                                                alt={currentProject.title}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    )}
                                </div>

                                {/* Project Description */}
                                {currentProject.description && (
                                    <div className="mb-6">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Mô tả dự án</h3>
                                        <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                                            {currentProject.description}
                                        </div>
                                    </div>
                                )}

                                {/* Required Skills */}
                                {currentProject.requiredSkills && currentProject.requiredSkills.length > 0 && (
                                    <div className="mb-6">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Kỹ năng yêu cầu</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {currentProject.requiredSkills.map((skill, index) => (
                                                <span key={index} className="px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-md border border-blue-200">
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Project Details */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {currentProject.category && (
                                        <div>
                                            <h4 className="text-sm font-medium text-gray-500 mb-1">Danh mục</h4>
                                            <p className="text-gray-900">{currentProject.category}</p>
                                        </div>
                                    )}

                                    {currentProject.projectType && typeof currentProject.projectType === 'object' && (
                                        <div>
                                            <h4 className="text-sm font-medium text-gray-500 mb-1">Loại dự án</h4>
                                            <p className="text-gray-900">{currentProject.projectType.name}</p>
                                        </div>
                                    )}

                                    {currentProject.estimateDuration && (
                                        <div>
                                            <h4 className="text-sm font-medium text-gray-500 mb-1">Thời gian ước tính</h4>
                                            <p className="text-gray-900">{currentProject.estimateDuration} ngày</p>
                                        </div>
                                    )}

                                    {currentProject.location && (
                                        <div>
                                            <h4 className="text-sm font-medium text-gray-500 mb-1">Địa điểm</h4>
                                            <p className="text-gray-900">{currentProject.location}</p>
                                        </div>
                                    )}

                                    {currentProject.isRemote !== undefined && (
                                        <div>
                                            <h4 className="text-sm font-medium text-gray-500 mb-1">Hình thức làm việc</h4>
                                            <p className="text-gray-900">{currentProject.isRemote ? 'Remote' : 'Tại văn phòng'}</p>
                                        </div>
                                    )}

                                    {currentProject.startDate && (
                                        <div>
                                            <h4 className="text-sm font-medium text-gray-500 mb-1">Ngày bắt đầu</h4>
                                            <p className="text-gray-900">{formatDate(currentProject.startDate)}</p>
                                        </div>
                                    )}

                                    {currentProject.endDate && (
                                        <div>
                                            <h4 className="text-sm font-medium text-gray-500 mb-1">Ngày kết thúc</h4>
                                            <p className="text-gray-900">{formatDate(currentProject.endDate)}</p>
                                        </div>
                                    )}
                                </div>

                                {/* Attachments */}
                                {currentProject.attachments && currentProject.attachments.length > 0 && (
                                    <div className="mt-6">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Tài liệu đính kèm</h3>
                                        <div className="space-y-2">
                                            {currentProject.attachments.map((attachment, index) => (
                                                <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                                                    <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                                                    </svg>
                                                    <span className="text-gray-700">{attachment}</span>
                                                    <button className="ml-auto text-blue-600 hover:text-blue-800 text-sm">
                                                        Tải xuống
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Apply Section */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 top-6">
                                <div className="text-center mb-6">
                                    <div className="text-3xl font-bold text-blue-600 mb-2">
                                        {formatCurrency(currentProject.budget)}
                                    </div>
                                    <div className="text-sm text-gray-500">Ngân sách dự án</div>
                                </div>

                                <div className="space-y-4 mb-6">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-500">Trạng thái:</span>
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(currentProject.status)}`}>
                                            {getStatusText(currentProject.status)}
                                        </span>
                                    </div>

                                    {currentProject.endDate && (
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-500">Hạn ứng tuyển:</span>
                                            <span className="text-sm font-medium text-amber-600">
                                                {formatDateDistance(currentProject.endDate)}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                 {currentProject.status === ProjectStatus.OPEN_APPLYING ? (
                                     hasApplied ? (
                                         <div className="text-center py-3 px-4 bg-green-100 text-green-800 rounded-lg border border-green-200">
                                             <div className="flex items-center justify-center">
                                                 <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                 </svg>
                                                 Đã ứng tuyển
                                             </div>
                                         </div>
                                     ) : (
                                         <button
                                             onClick={handleApply}
                                             disabled={isApplying || isApplicationLoading}
                                             className="cursor-pointer w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                                         >
                                             {isApplying || isApplicationLoading ? 'Đang gửi...' : (isAuthenticated ? 'Ứng tuyển ngay' : 'Đăng nhập để ứng tuyển')}
                                         </button>
                                     )
                                 ) : (
                                     <div className="text-center py-3 px-4 bg-gray-100 text-gray-500 rounded-lg">
                                         Dự án không còn nhận ứng tuyển
                                     </div>
                                 )}

                                {!isAuthenticated && (
                                    <div className="mt-4 text-center">
                                        <Link href="/login" className="text-sm text-blue-600 hover:text-blue-800">
                                            Đăng nhập để ứng tuyển
                                        </Link>
                                    </div>
                                )}
                            </div>

                            {/* Project Stats */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Thống kê dự án</h3>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-500">Lượt xem:</span>
                                        <span className="text-sm font-medium">{currentProject.views || 0}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-500">Ngày đăng:</span>
                                        <span className="text-sm font-medium">{formatDate(currentProject.createdDate)}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-500">Cập nhật lần cuối:</span>
                                        <span className="text-sm font-medium">{formatDate(currentProject.updatedDate)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Share Project */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Chia sẻ dự án</h3>
                                <div className="flex space-x-3">
                                    <button className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg hover:bg-blue-700 transition-colors text-sm">
                                        Facebook
                                    </button>
                                    <button className="flex-1 bg-green-600 text-white py-2 px-3 rounded-lg hover:bg-green-700 transition-colors text-sm">
                                        Zalo
                                    </button>
                                    <button className="flex-1 bg-gray-600 text-white py-2 px-3 rounded-lg hover:bg-gray-700 transition-colors text-sm">
                                        Copy Link
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}
