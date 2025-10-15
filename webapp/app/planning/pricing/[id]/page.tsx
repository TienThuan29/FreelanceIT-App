"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  FaCheckCircle,
  FaArrowLeft,
  FaShoppingCart,
  FaClock,
  FaUsers,
  FaStar,
  FaCrown,
  FaRocket,
  FaDatabase,
  FaProjectDiagram,
  FaHeadset,
} from "react-icons/fa";
import { usePlanningManagement } from "@/hooks/usePlanningManagement";

import { useMoMo, CreateMomoPaymentRequest } from "@/hooks/useMomo";
import { Planning } from "@/types/planning.type";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";


export default function PlanningPackageDetail() {
  const { user } = useAuth();
  const params = useParams();
  const router = useRouter();
  const { getPlanningById, purchasePlanning, isLoading, error } = usePlanningManagement();
  const { createMomoPayment, isLoading: momoLoading, error: momoError } = useMoMo();
  const [planningData, setPlanningData] = useState<Planning | null>(null);
  const [purchaseLoading, setPurchaseLoading] = useState(false);

  useEffect(() => {
    if (params.id) {
      const fetchPlanning = async () => {
        const planning = await getPlanningById(params.id as string);
        if (planning) {
          setPlanningData(planning);
        }
      };
      fetchPlanning();
    }
  }, [params.id, getPlanningById]);

  const handleBackToPricing = () => {
    router.push("/planning/pricing");
  };  const handlePurchasePackage = async (paymentMethod: 'momo' | 'paypal') => {
    if (!planningData) {
      console.log(planningData);
      console.error("User or planning data not available");
      return;
    }

    console.log("user ", user);
    console.log("Purchase planning:", planningData);
    console.log("Payment method:", paymentMethod);

    try {
      setPurchaseLoading(true);
      const purchaseRequest = {
        planningId: planningData.id,
        orderId: `ORDER-${Date.now()}`,
        price: planningData.price,
      };


      if (paymentMethod === 'momo') {
        // Handle MoMo payment
        const momoPaymentRequest: CreateMomoPaymentRequest = {
          userId: user?.id || '',
          planningId: planningData.id,
          amount: planningData.price,
          orderInfo: `Thanh toán gói Pro - 30 ngày`,
        };

        console.log("Momo payment request:", momoPaymentRequest);
        const momoResponse = await createMomoPayment(momoPaymentRequest);


        if (momoResponse && momoResponse.payUrl) {
          // Redirect to MoMo payment page
          window.open(momoResponse.payUrl);
          toast.success('Redirecting to MoMo payment...');
        } else {
          throw new Error('Failed to create MoMo payment');
        }
      } else if (paymentMethod === 'paypal') {
        // Handle PayPal payment (existing flow)
        const purchaseRequest = {
          planningId: planningData.id,
          orderId: `ORDER-${Date.now()}`,
          price: planningData.price,
          paymentMethod: paymentMethod,
        };

        const response = await purchasePlanning(purchaseRequest);

        if (response) {
          // Redirect to payment success page or handle payment flow
          console.log("response", response);
          router.push(`/planning/pricing/success?planningId=${response.planningId}&paymentMethod=${paymentMethod}`);
        } else {
          console.error("Failed to purchase planning");
        }
      }
    } catch (error) {
      console.error("Planning purchase failed:", error);
      toast.error('Payment failed. Please try again.');
    } finally {
      setPurchaseLoading(false);
    }
  };

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

  const formatStorage = (storage?: number): string => {
    if (!storage) return "Không giới hạn";
    if (storage >= 1024) {
      return `${(storage / 1024).toFixed(1)} GB`;
    }
    return `${storage} MB`;
  };

  const getBadgeInfo = (planning: Planning) => {
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center items-center py-8 sm:py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 sm:mt-6 text-gray-600 text-sm sm:text-base">Đang tải thông tin gói...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!planningData) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center py-8 sm:py-12">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
            Không tìm thấy gói
          </h2>
          <p className="text-sm sm:text-base text-gray-600 mb-6">
            Gói dịch vụ bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
          </p>
          <button
            onClick={handleBackToPricing}
            className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
          >
            <FaArrowLeft />
            Quay lại trang gói
          </button>
        </div>
      </div>
    );
  }

  // Split description by "." and filter out empty strings
  const descriptions = planningData.description
    ? planningData.description
        .split(".")
        .map((desc) => desc.trim())
        .filter((desc) => desc.length > 0)
    : ["Quản lý dự án hiệu quả", "Tối ưu hóa quy trình làm việc"];

  const badgeInfo = getBadgeInfo(planningData);
  const BadgeIcon = badgeInfo.icon;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <div className="mb-6 sm:mb-8">
            <button
              onClick={handleBackToPricing}
              className="cursor-pointer inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors text-sm sm:text-base"
            >
              <FaArrowLeft />
              Quay lại trang gói
            </button>
          </div>

          {/* Package Header */}
          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4 sm:mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center ${
                  badgeInfo.color === 'purple' ? 'bg-purple-100' : 
                  badgeInfo.color === 'blue' ? 'bg-blue-100' : 
                  badgeInfo.color === 'orange' ? 'bg-orange-100' : 'bg-green-100'
                }`}>
                  <BadgeIcon className={`text-xl sm:text-2xl ${
                    badgeInfo.color === 'purple' ? 'text-purple-600' : 
                    badgeInfo.color === 'blue' ? 'text-blue-600' : 
                    badgeInfo.color === 'orange' ? 'text-orange-600' : 'text-green-600'
                  }`} />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                    {planningData.name}
                  </h1>
                  <p className="text-sm sm:text-base lg:text-lg text-gray-600">
                    Gói dịch vụ quản lý dự án và lập kế hoạch chuyên nghiệp
                  </p>
                </div>
              </div>
              <div className="mt-4 lg:mt-0">
                <div className="text-left sm:text-right">
                  <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
                    {planningData.price.toLocaleString("vi-VN")}
                  </div>
                  <div className="text-sm sm:text-base text-gray-600">VND / {formatDuration(planningData.daysLimit)}</div>
                </div>
              </div>
            </div>

            {/* Package Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
              <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-blue-50 rounded-lg">
                <FaClock className="text-blue-600 text-lg sm:text-xl flex-shrink-0" />
                <div>
                  <div className="font-semibold text-gray-900 text-sm sm:text-base">
                    {formatDuration(planningData.daysLimit)}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600">Thời hạn sử dụng</div>
                </div>
              </div>
              <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-green-50 rounded-lg">
                <FaProjectDiagram className="text-green-600 text-lg sm:text-xl flex-shrink-0" />
                <div>
                  <div className="font-semibold text-gray-900 text-sm sm:text-base">
                    {planningData.dailyLimit}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600">Requests/ngày</div>
                </div>
              </div>
              <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-purple-50 rounded-lg">
                <FaDatabase className="text-purple-600 text-lg sm:text-xl flex-shrink-0" />
                <div>
                  <div className="font-semibold text-gray-900 text-sm sm:text-base">
                    {planningData.aiModel?.maxTokens?.toLocaleString() || "N/A"}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600">Max Tokens</div>
                </div>
              </div>
              <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-orange-50 rounded-lg">
                <FaHeadset className="text-orange-600 text-lg sm:text-xl flex-shrink-0" />
                <div>
                  <div className="font-semibold text-gray-900 text-sm sm:text-base">
                    {planningData.aiModel?.responseTime || "standard"}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600">Response Time</div>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="mb-6 sm:mb-8">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">
                Tính năng bao gồm
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                {planningData.aiModel?.features?.length > 0 ? (
                  planningData.aiModel.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-2 sm:gap-3">
                      <FaCheckCircle className="text-green-500 mt-1 flex-shrink-0 text-sm sm:text-base" />
                      <span className="text-sm sm:text-base text-gray-700">{feature}</span>
                    </div>
                  ))
                ) : (
                  descriptions.map((desc, idx) => (
                    <div key={idx} className="flex items-start gap-2 sm:gap-3">
                      <FaCheckCircle className="text-green-500 mt-1 flex-shrink-0 text-sm sm:text-base" />
                      <span className="text-sm sm:text-base text-gray-700">{desc}</span>
                    </div>
                  ))
                )}
              </div>
            </div>            {/* Error Display */}
            {(error || momoError) && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{error || momoError}</p>
              </div>
            )}{/* Purchase Buttons */}
            <div className="text-center">
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-4">
                {/* Momo Payment Button */}
                <button
                  onClick={() => handlePurchasePackage('momo')}
                  disabled={purchaseLoading}
                  className={`cursor-pointer inline-flex items-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold rounded-lg transition-colors shadow-lg hover:shadow-xl ${
                    purchaseLoading
                      ? "bg-gray-400 text-white cursor-not-allowed"
                      : "bg-pink-600 hover:bg-pink-700 text-white"
                  }`}
                >
                  {purchaseLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white"></div>
                      <span className="text-sm sm:text-base">Đang xử lý...</span>
                    </>
                  ) : (
                    <>
                      <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center">
                        <span className="text-pink-600 font-bold text-xs">M</span>
                      </div>
                      <span className="text-sm sm:text-base">Thanh toán MoMo</span>
                    </>
                  )}
                </button>

                {/* PayPal Payment Button */}
                <button
                  onClick={() => handlePurchasePackage('paypal')}
                  disabled={purchaseLoading}
                  className={`cursor-pointer inline-flex items-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold rounded-lg transition-colors shadow-lg hover:shadow-xl ${
                    purchaseLoading
                      ? "bg-gray-400 text-white cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700 text-white"
                  }`}
                >
                  {purchaseLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white"></div>
                      <span className="text-sm sm:text-base">Đang xử lý...</span>
                    </>
                  ) : (
                    <>
                      <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-bold text-xs">P</span>
                      </div>
                      <span className="text-sm sm:text-base">Thanh toán PayPal</span>
                    </>
                  )}
                </button>
              </div>

              <p className="text-xs sm:text-sm text-gray-500 mt-3">
                Dùng thử miễn phí trong 7 ngày. Hủy bất cứ lúc nào.
              </p>
            </div>
          </div>

          {/* Additional Information */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            {/* What's Included */}
            <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">
                Bao gồm những gì?
              </h3>
              <ul className="space-y-2 sm:space-y-3">
                <li className="flex items-start gap-2 sm:gap-3">
                  <FaCheckCircle className="text-green-500 mt-1 flex-shrink-0 text-sm sm:text-base" />
                  <span className="text-sm sm:text-base text-gray-700">
                    Quản lý dự án không giới hạn
                  </span>
                </li>
                <li className="flex items-start gap-2 sm:gap-3">
                  <FaCheckCircle className="text-green-500 mt-1 flex-shrink-0 text-sm sm:text-base" />
                  <span className="text-sm sm:text-base text-gray-700">
                    Lập kế hoạch và theo dõi tiến độ
                  </span>
                </li>
                <li className="flex items-start gap-2 sm:gap-3">
                  <FaCheckCircle className="text-green-500 mt-1 flex-shrink-0 text-sm sm:text-base" />
                  <span className="text-sm sm:text-base text-gray-700">
                    Báo cáo và phân tích chi tiết
                  </span>
                </li>
                <li className="flex items-start gap-2 sm:gap-3">
                  <FaCheckCircle className="text-green-500 mt-1 flex-shrink-0 text-sm sm:text-base" />
                  <span className="text-sm sm:text-base text-gray-700">
                    Hỗ trợ AI {planningData.aiModel?.modelType || "basic"}
                  </span>
                </li>
              </ul>
            </div>

            {/* FAQ */}
            <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">
                Câu hỏi thường gặp
              </h3>
              <div className="space-y-3 sm:space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1 sm:mb-2 text-sm sm:text-base">
                    Có thể hủy gói bất cứ lúc nào không?
                  </h4>
                  <p className="text-gray-600 text-xs sm:text-sm">
                    Có, bạn có thể hủy gói bất cứ lúc nào mà không bị phạt phí.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1 sm:mb-2 text-sm sm:text-base">
                    Gói có hiệu lực ngay lập tức không?
                  </h4>
                  <p className="text-gray-600 text-xs sm:text-sm">
                    Có, gói sẽ có hiệu lực ngay sau khi thanh toán thành công.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1 sm:mb-2 text-sm sm:text-base">
                    Có thể nâng cấp gói không?
                  </h4>
                  <p className="text-gray-600 text-xs sm:text-sm">
                    Có, bạn có thể nâng cấp gói bất cứ lúc nào và chỉ trả tiền
                    chênh lệch.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
  );
}