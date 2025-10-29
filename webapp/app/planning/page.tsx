"use client";

import { useState, useEffect } from "react";
import { usePlanningManagement } from "@/hooks/usePlanningManagement";
import { UserPlanning } from "@/types/planning.type";
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
  const { activeUserPlanning, getUserPlannings, getActiveUserPlanning, isLoading, error } = usePlanningManagement();
  const [userPlannings, setUserPlannings] = useState<UserPlanning[]>([]);
  const [activePlanning, setActivePlanning] = useState<UserPlanning | null>(null);

  useEffect(() => {
    if (user) {
      const fetchUserPlannings = async () => {
        const plannings = await getUserPlannings(user.id);
        const active = await getActiveUserPlanning(user.id);
        setUserPlannings(plannings);
        setActivePlanning(active);
      };
      fetchUserPlannings();
    }
  }, [user, getUserPlannings, getActiveUserPlanning]);

  const formatDuration = (daysLimit: number): string => {
    if (daysLimit >= 365) {
      const years = Math.floor(daysLimit / 365);
      return `${years} năm`;
    } else if (daysLimit >= 30) {
      const months = Math.floor(daysLimit / 30);
      return `${months} tháng`;
    } else {
      return `${daysLimit} ngày`;
    }
  };

  const getStatusColor = (isEnable: boolean): string => {
    return isEnable ? "text-green-600 bg-green-100" : "text-red-600 bg-red-100";
  };

  const getStatusText = (isEnable: boolean): string => {
    return isEnable ? "Đang hoạt động" : "Đã hết hạn";
  };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getBadgeInfo = (planning: any) => {
    const modelType = planning.aiModel?.modelType || 'basic';
    switch (modelType) {
      case 'enterprise':
        return { text: "Enterprise", color: "purple", icon: FaCrown };
      case 'pro':
        return { text: "Popular", color: "blue", icon: FaRocket };
      case 'developer':
        return { text: "Developer", color: "orange", icon: FaStar };
      default:
        return { text: "Basic", color: "green", icon: FaStar };
    }
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
              Quản lý gói AI dịch vụ
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              Theo dõi và quản lý các gói AI dịch vụ của bạn
            </p>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* Active Planning */}
          {activePlanning ? (
            <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-6 sm:mb-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                  Gói đang hoạt động
                </h2>
                <span className={`px-3 py-1 rounded-full text-xs sm:text-sm font-medium w-fit ${getStatusColor(activePlanning.isEnable)}`}>
                  {getStatusText(activePlanning.isEnable)}
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">
                    {activePlanning.planning?.name || "Gói AI"}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 mb-4">
                    {activePlanning.planning?.description || "Gói dịch vụ AI"}
                  </p>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <FaClock className="text-blue-600 text-sm sm:text-base flex-shrink-0" />
                      <span className="text-xs sm:text-sm text-gray-600">
                        Có hiệu lực đến: {new Date(activePlanning.expireDate).toLocaleDateString('vi-VN')}
                      </span>
                    </div>
                    {activePlanning.planning?.detailDevPlanning && (
                      <>
                        <div className="flex items-center gap-2">
                          <FaProjectDiagram className="text-purple-600 text-sm sm:text-base flex-shrink-0" />
                          <span className="text-xs sm:text-sm text-gray-600">
                            Số dự án: {activePlanning.planning.detailDevPlanning.numberOfJoinedProjects}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FaDatabase className="text-green-600 text-sm sm:text-base flex-shrink-0" />
                          <span className="text-xs sm:text-sm text-gray-600">
                            Số sản phẩm: {activePlanning.planning.detailDevPlanning.numberOfProducts}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FaHeadset className="text-orange-600 text-sm sm:text-base flex-shrink-0" />
                          <span className="text-xs sm:text-sm text-gray-600">
                            Chatbot: {activePlanning.planning.detailDevPlanning.useChatbot ? 'Có' : 'Không'}
                          </span>
                        </div>
                      </>
                    )}
                    {activePlanning.planning?.detailCustomerPlanning && (
                      <>
                        <div className="flex items-center gap-2">
                          <FaProjectDiagram className="text-purple-600 text-sm sm:text-base flex-shrink-0" />
                          <span className="text-xs sm:text-sm text-gray-600">
                            Số dự án: {activePlanning.planning.detailCustomerPlanning.numberOfProjects}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FaHeadset className="text-orange-600 text-sm sm:text-base flex-shrink-0" />
                          <span className="text-xs sm:text-sm text-gray-600">
                            Chatbot: {activePlanning.planning.detailCustomerPlanning.useChatbot ? 'Có' : 'Không'}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                  <h4 className="font-medium text-gray-900 mb-3 text-sm sm:text-base">Thông tin gói</h4>
                  <div className="space-y-2 text-xs sm:text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Giá:</span>
                      <span className="font-medium text-right">
                        {activePlanning.price.toLocaleString("vi-VN")} VND
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Mua lúc:</span>
                      <span className="font-medium text-right">
                        {new Date(activePlanning.transactionDate).toLocaleDateString("vi-VN")}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Order ID:</span>
                      <span className="font-medium text-right">{activePlanning.orderId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Giá:</span>
                      <span className="font-medium text-right">{activePlanning.price.toLocaleString('vi-VN')} VND</span>
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
                Chưa có gói AI nào
              </h2>
              <p className="text-sm sm:text-base text-gray-600 mb-6">
                Bạn chưa có gói AI dịch vụ nào. Hãy chọn một gói phù hợp để bắt đầu sử dụng AI.
              </p>
              <button
                onClick={() => router.push("/planning/pricing")}
                className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
              >
                <FaRocket />
                Xem các gói AI
              </button>
            </div>
          )}

          {/* Planning History */}
          {userPlannings.length > 0 && (
            <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">
                Lịch sử gói AI
              </h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Gói AI
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
                    {userPlannings.map((userPlanning, index) => {
                      const badgeInfo = getBadgeInfo(userPlanning.planning || {});
                      const BadgeIcon = badgeInfo.icon;
                      
                      return (
                        <tr key={`${userPlanning.userId}-${userPlanning.planningId}-${index}`}>
                          <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center mr-2 sm:mr-3 ${
                                badgeInfo.color === 'purple' ? 'bg-purple-100' : 
                                badgeInfo.color === 'blue' ? 'bg-blue-100' : 
                                badgeInfo.color === 'orange' ? 'bg-orange-100' : 'bg-green-100'
                              }`}>
                                <BadgeIcon className={`text-xs sm:text-sm ${
                                  badgeInfo.color === 'purple' ? 'text-purple-600' : 
                                  badgeInfo.color === 'blue' ? 'text-blue-600' : 
                                  badgeInfo.color === 'orange' ? 'text-orange-600' : 'text-green-600'
                                }`} />
                              </div>
                              <div>
                                <div className="text-xs sm:text-sm font-medium text-gray-900">
                                  {userPlanning.planning?.name || "Gói AI"}
                                </div>
                                <div className="text-xs sm:text-sm text-gray-500">
                                  {userPlanning.price.toLocaleString("vi-VN")} VND
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">
                            {formatDuration(
                              Math.ceil(
                                (new Date(userPlanning.expireDate).getTime() - 
                                 new Date(userPlanning.transactionDate).getTime()) / 
                                (1000 * 60 * 60 * 24)
                              )
                            )}
                          </td>
                          <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(userPlanning.isEnable)}`}>
                              {getStatusText(userPlanning.isEnable)}
                            </span>
                          </td>
                          <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                            {new Date(userPlanning.transactionDate).toLocaleDateString("vi-VN")}
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