"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  FaCheckCircle,
  FaArrowLeft,
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
import { useSeePay, CreateSeePayPaymentRequest } from "@/hooks/useSeePay";
import { Planning } from "@/types/planning.type";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";


export default function PlanningPackageDetail() {
  const { user } = useAuth();
  const params = useParams();
  const router = useRouter();
  const { getPlanningByIdPublic, purchasePlanning, isLoading, error } = usePlanningManagement();
  const { createMomoPayment, error: momoError } = useMoMo();
  const { createSeePayPayment, submitPaymentForm, error: seePayError } = useSeePay();
  const [planningData, setPlanningData] = useState<Planning | null>(null);
  const [purchaseLoading, setPurchaseLoading] = useState(false);

  useEffect(() => {
    if (params.id) {
      const fetchPlanning = async () => {
        const planning = await getPlanningByIdPublic(params.id as string);
        if (planning) {
          setPlanningData(planning);
        }
      };
      fetchPlanning();
    }
  }, [params.id, getPlanningByIdPublic]);

  const handleBackToPricing = () => {
    router.push("/planning/pricing");
  };  const handlePurchasePackage = async (paymentMethod: 'momo' | 'sepay' | 'paypal') => {
    if (!planningData) {
      console.error("User or planning data not available");
      return;
    }

    try {
      setPurchaseLoading(true);

      if (paymentMethod === 'momo') {
        // Handle MoMo payment
        const momoPaymentRequest: CreateMomoPaymentRequest = {
          userId: user?.id || '',
          planningId: planningData.id,
          amount: planningData.price,
          orderInfo: `Thanh toán gói ${planningData.name}`,
        };

        const momoResponse = await createMomoPayment(momoPaymentRequest);

        if (momoResponse && momoResponse.payUrl) {
          // Redirect to MoMo payment page in the same window
          toast.success('Đang chuyển đến trang thanh toán MoMo...');
          window.location.href = momoResponse.payUrl;
        } else {
          throw new Error('Không nhận được link thanh toán từ MoMo');
        }
      } else if (paymentMethod === 'sepay') {
        // Handle SeePay payment
        const seePayPaymentRequest: CreateSeePayPaymentRequest = {
          userId: user?.id || '',
          planningId: planningData.id,
          amount: planningData.price,
          description: `Thanh toán gói ${planningData.name}`,
        };

        const seePayResponse = await createSeePayPayment(seePayPaymentRequest);

        if (seePayResponse && seePayResponse.checkoutUrl && seePayResponse.formFields) {
          // Submit SeePay payment form
          toast.success('Đang chuyển đến trang thanh toán SeePay...');
          submitPaymentForm(seePayResponse.checkoutUrl, seePayResponse.formFields);
        } else {
          throw new Error('Không nhận được thông tin thanh toán từ SeePay');
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

  const getBadgeInfo = (planning: Planning) => {
    const modelType = planning.name.toLowerCase().includes('enterprise') ? 'enterprise' :
                     planning.name.toLowerCase().includes('pro') ? 'pro' :
                     planning.name.toLowerCase().includes('developer') ? 'developer' : 'basic';
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
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

  // Split description by ";" to get features
  const features = planningData.description
    ? planningData.description
        .split(";")
        .map((desc) => desc.trim())
        .filter((desc) => desc.length > 0)
    : ["Quản lý dự án hiệu quả", "Tối ưu hóa quy trình làm việc"];

  const badgeInfo = getBadgeInfo(planningData);
  const BadgeIcon = badgeInfo.icon;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
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
                  <div className="text-sm sm:text-base text-gray-600">VND</div>
                </div>
              </div>
            </div>

            {/* Package Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
              <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-blue-50 rounded-lg">
                <FaUsers className="text-blue-600 text-lg sm:text-xl flex-shrink-0" />
                <div>
                  <div className="font-semibold text-gray-900 text-sm sm:text-base">
                    {planningData.forDeveloper ? 'Developer' : ''}
                    {planningData.forDeveloper && planningData.forCustomer ? ' & ' : ''}
                    {planningData.forCustomer ? 'Customer' : ''}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600">Loại khách hàng</div>
                </div>
              </div>
              <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-green-50 rounded-lg">
                <FaStar className="text-green-600 text-lg sm:text-xl flex-shrink-0" />
                <div>
                  <div className="font-semibold text-gray-900 text-sm sm:text-base">
                    {planningData.price.toLocaleString("vi-VN")} VND
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600">Giá gói</div>
                </div>
              </div>
              
              {/* Developer Details */}
              {planningData.forDeveloper && planningData.detailDevPlanning && (
                <>
                  <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-purple-50 rounded-lg">
                    <FaProjectDiagram className="text-purple-600 text-lg sm:text-xl flex-shrink-0" />
                    <div>
                      <div className="font-semibold text-gray-900 text-sm sm:text-base">
                        {planningData.detailDevPlanning.numberOfJoinedProjects === 999 ? 'Không giới hạn' : planningData.detailDevPlanning.numberOfJoinedProjects}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-600">Dự án tham gia</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-orange-50 rounded-lg">
                    <FaDatabase className="text-orange-600 text-lg sm:text-xl flex-shrink-0" />
                    <div>
                      <div className="font-semibold text-gray-900 text-sm sm:text-base">
                        {planningData.detailDevPlanning.numberOfProducts === 999 ? 'Không giới hạn' : planningData.detailDevPlanning.numberOfProducts}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-600">Sản phẩm</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-teal-50 rounded-lg">
                    <FaHeadset className="text-teal-600 text-lg sm:text-xl flex-shrink-0" />
                    <div>
                      <div className="font-semibold text-gray-900 text-sm sm:text-base">
                        {planningData.detailDevPlanning.useChatbot ? 'Có' : 'Không'}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-600">Chatbot hỗ trợ</div>
                    </div>
                  </div>
                </>
              )}
              
              {/* Customer Details */}
              {planningData.forCustomer && planningData.detailCustomerPlanning && (
                <>
                  <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-indigo-50 rounded-lg">
                    <FaProjectDiagram className="text-indigo-600 text-lg sm:text-xl flex-shrink-0" />
                    <div>
                      <div className="font-semibold text-gray-900 text-sm sm:text-base">
                        {planningData.detailCustomerPlanning.numberOfProjects === 999 ? 'Không giới hạn' : planningData.detailCustomerPlanning.numberOfProjects}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-600">Dự án</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-teal-50 rounded-lg">
                    <FaHeadset className="text-teal-600 text-lg sm:text-xl flex-shrink-0" />
                    <div>
                      <div className="font-semibold text-gray-900 text-sm sm:text-base">
                        {planningData.detailCustomerPlanning.useChatbot ? 'Có' : 'Không'}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-600">Chatbot hỗ trợ</div>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Features */}
            <div className="mb-6 sm:mb-8">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">
                Tính năng bao gồm
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                {features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-2 sm:gap-3">
                    <FaCheckCircle className="text-green-500 mt-1 flex-shrink-0 text-sm sm:text-base" />
                    <span className="text-sm sm:text-base text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>            {/* Error Display */}
            {(error || momoError || seePayError) && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{error || momoError || seePayError}</p>
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

                {/* SeePay Payment Button */}
                <button
                  onClick={() => handlePurchasePackage('sepay')}
                  disabled={purchaseLoading}
                  className={`cursor-pointer inline-flex items-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold rounded-lg transition-colors shadow-lg hover:shadow-xl ${
                    purchaseLoading
                      ? "bg-gray-400 text-white cursor-not-allowed"
                      : "bg-green-600 hover:bg-green-700 text-white"
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
                        <span className="text-green-600 font-bold text-xs">S</span>
                      </div>
                      <span className="text-sm sm:text-base">Thanh toán SeePay</span>
                    </>
                  )}
                </button>
              </div>

              {/* <p className="text-xs sm:text-sm text-gray-500 mt-3">
                Dùng thử miễn phí trong 7 ngày. Hủy bất cứ lúc nào.
              </p> */}
            </div>
          </div>
        </div>
  );
}