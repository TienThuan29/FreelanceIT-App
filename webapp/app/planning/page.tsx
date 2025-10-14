"use client";

import { useState, useEffect } from "react";
import { usePlanningManagement } from "@/hooks/usePlanningManagement";
import { UserPlanning, PaymentStatus } from "@/types/planning.type";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import {
  FaProjectDiagram,
  FaClock,
  FaCheckCircle,
  FaExclamationTriangle,
  FaCrown,
  FaRocket,
  FaStar,
  FaDatabase,
  FaHeadset,
} from "react-icons/fa";

export default function PlanningDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const { activeUserPlanning, getUserPlannings, isLoading, error } = usePlanningManagement();
  const [userPlannings, setUserPlannings] = useState<UserPlanning[]>([]);

  useEffect(() => {
    if (user) {
      const fetchUserPlannings = async () => {
        const plannings = await getUserPlannings();
        setUserPlannings(plannings);
      };
      fetchUserPlannings();
    }
  }, [user, getUserPlannings]);

  const formatDuration = (startDate: Date, endDate: Date): string => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 30) {
      return `${diffDays} ngày`;
    } else if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return `${months} tháng`;
    } else {
      const years = Math.floor(diffDays / 365);
      return `${years} năm`;
    }
  };

  const getStatusColor = (status: PaymentStatus): string => {
    switch (status) {
      case PaymentStatus.COMPLETED:
        return "text-green-600 bg-green-100";
      case PaymentStatus.PENDING:
        return "text-yellow-600 bg-yellow-100";
      case PaymentStatus.FAILED:
        return "text-red-600 bg-red-100";
      case PaymentStatus.REFUNDED:
        return "text-gray-600 bg-gray-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusText = (status: PaymentStatus): string => {
    switch (status) {
      case PaymentStatus.COMPLETED:
        return "Hoàn thành";
      case PaymentStatus.PENDING:
        return "Đang xử lý";
      case PaymentStatus.FAILED:
        return "Thất bại";
      case PaymentStatus.REFUNDED:
        return "Đã hoàn tiền";
      default:
        return "Không xác định";
    }
  };

  const getBadgeInfo = (planning: any) => {
    if (planning.prioritySupport) {
      return { text: "Premium", color: "purple", icon: FaCrown };
    }
    if (planning.price > 1000000) {
      return { text: "Popular", color: "blue", icon: FaRocket };
    }
    return { text: "Basic", color: "green", icon: FaStar };
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex justify-center items-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-6 text-gray-600">Đang tải thông tin...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
              Quản lý dự án và lập kế hoạch
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              Tối ưu hóa quy trình làm việc và quản lý dự án hiệu quả
            </p>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* Active Planning */}
          {activeUserPlanning ? (
            <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-6 sm:mb-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                  Gói đang hoạt động
                </h2>
                <span className={`px-3 py-1 rounded-full text-xs sm:text-sm font-medium w-fit ${getStatusColor(activeUserPlanning.paymentStatus)}`}>
                  {getStatusText(activeUserPlanning.paymentStatus)}
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">
                    {activeUserPlanning.planning.name}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 mb-4">
                    {activeUserPlanning.planning.description}
                  </p>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <FaClock className="text-blue-600 text-sm sm:text-base flex-shrink-0" />
                      <span className="text-xs sm:text-sm text-gray-600">
                        Thời hạn: {formatDuration(activeUserPlanning.startDate, activeUserPlanning.endDate)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaProjectDiagram className="text-green-600 text-sm sm:text-base flex-shrink-0" />
                      <span className="text-xs sm:text-sm text-gray-600">
                        Dự án tối đa: {!activeUserPlanning.planning.maxProjects || activeUserPlanning.planning.maxProjects >= 999999 
                          ? 'Không giới hạn' 
                          : activeUserPlanning.planning.maxProjects}
                      </span>
                    </div>
                    {activeUserPlanning.planning.maxStorage && (
                      <div className="flex items-center gap-2">
                        <FaDatabase className="text-purple-600 text-sm sm:text-base flex-shrink-0" />
                        <span className="text-xs sm:text-sm text-gray-600">
                          Lưu trữ: {activeUserPlanning.planning.maxStorage >= 1024 
                            ? `${(activeUserPlanning.planning.maxStorage / 1024).toFixed(1)} GB`
                            : `${activeUserPlanning.planning.maxStorage} MB`}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <FaHeadset className="text-orange-600 text-sm sm:text-base flex-shrink-0" />
                      <span className="text-xs sm:text-sm text-gray-600">
                        Hỗ trợ: {activeUserPlanning.planning.prioritySupport ? "Ưu tiên" : "Tiêu chuẩn"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                  <h4 className="font-medium text-gray-900 mb-3 text-sm sm:text-base">Thông tin gói</h4>
                  <div className="space-y-2 text-xs sm:text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Giá:</span>
                      <span className="font-medium text-right">
                        {activeUserPlanning.planning.price.toLocaleString("vi-VN")} {activeUserPlanning.planning.currency}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Bắt đầu:</span>
                      <span className="font-medium text-right">
                        {new Date(activeUserPlanning.startDate).toLocaleDateString("vi-VN")}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Kết thúc:</span>
                      <span className="font-medium text-right">
                        {new Date(activeUserPlanning.endDate).toLocaleDateString("vi-VN")}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Phương thức:</span>
                      <span className="font-medium text-right">{activeUserPlanning.paymentMethod || "N/A"}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 mb-6 sm:mb-8 text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaExclamationTriangle className="text-gray-400 text-xl sm:text-2xl" />
              </div>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                Chưa có gói dịch vụ nào
              </h2>
              <p className="text-sm sm:text-base text-gray-600 mb-6">
                Bạn chưa có gói dịch vụ quản lý dự án nào. Hãy chọn một gói phù hợp để bắt đầu.
              </p>
              <button
                onClick={() => router.push("/planning/pricing")}
                className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
              >
                <FaRocket />
                Xem các gói dịch vụ
              </button>
            </div>
          )}

          {/* Planning History */}
          {userPlannings.length > 0 && (
            <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">
                Lịch sử gói dịch vụ
              </h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Gói dịch vụ
                      </th>
                      <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Thời hạn
                      </th>
                      <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Trạng thái
                      </th>
                      <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ngày mua
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {userPlannings.map((userPlanning) => {
                      const badgeInfo = getBadgeInfo(userPlanning.planning);
                      const BadgeIcon = badgeInfo.icon;
                      
                      return (
                        <tr key={userPlanning.id}>
                          <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center mr-2 sm:mr-3 ${
                                badgeInfo.color === 'purple' ? 'bg-purple-100' : 
                                badgeInfo.color === 'blue' ? 'bg-blue-100' : 'bg-green-100'
                              }`}>
                                <BadgeIcon className={`text-xs sm:text-sm ${
                                  badgeInfo.color === 'purple' ? 'text-purple-600' : 
                                  badgeInfo.color === 'blue' ? 'text-blue-600' : 'text-green-600'
                                }`} />
                              </div>
                              <div>
                                <div className="text-xs sm:text-sm font-medium text-gray-900">
                                  {userPlanning.planning.name}
                                </div>
                                <div className="text-xs sm:text-sm text-gray-500">
                                  {userPlanning.planning.price.toLocaleString("vi-VN")} {userPlanning.planning.currency}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">
                            {formatDuration(userPlanning.startDate, userPlanning.endDate)}
                          </td>
                          <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(userPlanning.paymentStatus)}`}>
                              {getStatusText(userPlanning.paymentStatus)}
                            </span>
                          </td>
                          <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                            {new Date(userPlanning.createdDate).toLocaleDateString("vi-VN")}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
  );
}