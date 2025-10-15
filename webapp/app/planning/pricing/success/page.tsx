// "use client";

// import { useEffect, useState, useCallback } from "react";
// import { useSearchParams, useRouter } from "next/navigation";
// import { usePlanningManagement } from "@/hooks/usePlanningManagement";
// import { UserPlanning } from "@/types/planning.type";
// import {
//   FaCheckCircle,
//   FaTimesCircle,
//   FaArrowLeft,
//   FaHome,
//   FaProjectDiagram,
//   FaClock,
//   FaHeadset,
// } from "react-icons/fa";
// import { useAuth } from "@/contexts/AuthContext";

// export default function PlanningPaymentSuccessPage() {
//   const searchParams = useSearchParams();
//   const { user } = useAuth();
//   const router = useRouter();
//   const { getUserPlannings, getActiveUserPlanning, isLoading, error } = usePlanningManagement();
//   const [userPlanning, setUserPlanning] = useState<UserPlanning | null>(null);
//   const [isProcessing, setIsProcessing] = useState(true);
//   const [hasProcessed, setHasProcessed] = useState(false);

//   const handlePaymentCompletion = useCallback(async () => {
//     if (hasProcessed) return;

//     try {
//       setHasProcessed(true);
//       const planningId = searchParams.get('planningId');

//       if (!planningId) {
//         console.error("No planning ID found in URL");
//         setIsProcessing(false);
//         return;
//       }

//       // Get user plannings to find the specific one
//       const userPlannings = await getUserPlannings(user?.id);
//       const foundPlanning = userPlannings.find(up => up.planningId === planningId);

//       if (foundPlanning) {
//         setUserPlanning(foundPlanning);
//       } else {
//         // Try to get active user planning as fallback
//         const activePlanning = await getActiveUserPlanning(user?.id);
//         if (activePlanning) {
//           setUserPlanning(activePlanning);
//         }
//       }
//     } catch (error) {
//       console.error("Error processing payment:", error);
//     } finally {
//       setIsProcessing(false);
//     }
//   }, [getUserPlannings, getActiveUserPlanning, searchParams, hasProcessed]);

//   useEffect(() => {
//     handlePaymentCompletion();
//   }, [handlePaymentCompletion]);

//   const handleGoToHome = () => {
//     router.push("/");
//   };

//   const handleGoToPlanning = () => {
//     router.push("/planning");
//   };

//   const formatDuration = (startDate: Date, endDate: Date): string => {
//     const start = new Date(startDate);
//     const end = new Date(endDate);
//     const diffTime = Math.abs(end.getTime() - start.getTime());
//     const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

//     if (diffDays < 30) {
//       return `${diffDays} ngày`;
//     } else if (diffDays < 365) {
//       const months = Math.floor(diffDays / 30);
//       return `${months} tháng`;
//     } else {
//       const years = Math.floor(diffDays / 365);
//       return `${years} năm`;
//     }
//   };

//   if (isProcessing) {
//     return (
//       <div className="max-w-2xl mx-auto px-4 sm:px-6">
//         <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 text-center">
//           <div className="flex justify-center mb-4 sm:mb-6">
//             <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-blue-600"></div>
//           </div>
//           <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
//             Đang xử lý thanh toán...
//           </h2>
//           <p className="text-sm sm:text-base text-gray-600">
//             Vui lòng chờ trong giây lát, chúng tôi đang xác nhận thanh toán
//             của bạn.
//           </p>
//         </div>
//       </div>
//     );
//   }

//   const isPaymentSuccessful = userPlanning?.isEnable === true;

//   return (
//     <div className="max-w-2xl mx-auto px-4 sm:px-6">
//           <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
//             {/* Payment Status Icon */}
//             <div className="text-center mb-4 sm:mb-6">
//               {isPaymentSuccessful ? (
//                 <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-full mb-3 sm:mb-4">
//                   <FaCheckCircle className="text-green-600 text-2xl sm:text-3xl" />
//                 </div>
//               ) : (
//                 <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-red-100 rounded-full mb-3 sm:mb-4">
//                   <FaTimesCircle className="text-red-600 text-2xl sm:text-3xl" />
//                 </div>
//               )}

//               <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
//                 {isPaymentSuccessful
//                   ? "Thanh toán thành công!"
//                   : "Thanh toán thất bại"}
//               </h1>
//               <p className="text-sm sm:text-base text-gray-600">
//                 {isPaymentSuccessful
//                   ? "Cảm ơn bạn đã mua gói dịch vụ. Gói của bạn đã được kích hoạt."
//                   : "Có lỗi xảy ra trong quá trình thanh toán. Vui lòng thử lại."}
//               </p>
//             </div>

//             {/* Error Display */}
//             {error && (
//               <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
//                 <p className="text-red-600 text-sm">{error}</p>
//               </div>
//             )}

//             {/* Payment Details */}
//             {userPlanning && (
//               <div className="bg-gray-50 rounded-lg p-4 sm:p-6 mb-4 sm:mb-6">
//                 <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
//                   Chi tiết thanh toán
//                 </h3>
//                 <div className="space-y-2 sm:space-y-3">
//                   <div className="flex justify-between">
//                     <span className="text-xs sm:text-sm text-gray-600">Order ID:</span>
//                     <span className="font-medium text-xs sm:text-sm text-right">{userPlanning.orderId}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-xs sm:text-sm text-gray-600">Số tiền:</span>
//                     <span className="font-medium text-xs sm:text-sm text-right">
//                       {userPlanning.price?.toLocaleString("vi-VN")} VND
//                     </span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-xs sm:text-sm text-gray-600">Trạng thái:</span>
//                     <span
//                       className={`font-medium text-xs sm:text-sm ${
//                         userPlanning.isEnable
//                           ? "text-green-600"
//                           : "text-red-600"
//                       }`}
//                     >
//                       {userPlanning.isEnable ? "Thành công" : "Thất bại"}
//                     </span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-xs sm:text-sm text-gray-600">Thời gian mua:</span>
//                     <span className="font-medium text-xs sm:text-sm text-right">
//                       {new Date(userPlanning.transactionDate).toLocaleString("vi-VN")}
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* Package Information */}
//             {userPlanning?.planning && (
//               <div className="bg-blue-50 rounded-lg p-4 sm:p-6 mb-4 sm:mb-6">
//                 <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
//                   Thông tin gói dịch vụ
//                 </h3>
//                 <div className="space-y-2 sm:space-y-3">
//                   <div className="flex justify-between">
//                     <span className="text-xs sm:text-sm text-gray-600">Tên gói:</span>
//                     <span className="font-medium text-xs sm:text-sm text-right">
//                       {userPlanning.planning.name}
//                     </span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-xs sm:text-sm text-gray-600">Giá:</span>
//                     <span className="font-medium text-xs sm:text-sm text-right">
//                       {userPlanning.planning.price?.toLocaleString("vi-VN")} VND
//                     </span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-xs sm:text-sm text-gray-600">Thời hạn:</span>
//                     <span className="font-medium text-xs sm:text-sm text-right">
//                       {userPlanning.planning.daysLimit} ngày
//                     </span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-xs sm:text-sm text-gray-600">Requests/ngày:</span>
//                     <span className="font-medium text-xs sm:text-sm text-right">
//                       {userPlanning.planning.dailyLimit}
//                     </span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-xs sm:text-sm text-gray-600">Max Tokens:</span>
//                     <span className="font-medium text-xs sm:text-sm text-right">
//                       {userPlanning.planning.aiModel?.maxTokens?.toLocaleString() || "N/A"}
//                     </span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-xs sm:text-sm text-gray-600">Response Time:</span>
//                     <span className="font-medium text-xs sm:text-sm text-right">
//                       {userPlanning.planning.aiModel?.responseTime || "standard"}
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* Features Preview */}
//             {userPlanning?.planning && (
//               <div className="bg-green-50 rounded-lg p-4 sm:p-6 mb-4 sm:mb-6">
//                 <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
//                   Tính năng đã kích hoạt
//                 </h3>
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
//                   <div className="flex items-center gap-2 sm:gap-3">
//                     <FaProjectDiagram className="text-green-600 text-sm sm:text-base flex-shrink-0" />
//                     <span className="text-xs sm:text-sm text-gray-700">Quản lý dự án</span>
//                   </div>
//                   <div className="flex items-center gap-2 sm:gap-3">
//                     <FaClock className="text-green-600 text-sm sm:text-base flex-shrink-0" />
//                     <span className="text-xs sm:text-sm text-gray-700">Lập kế hoạch</span>
//                   </div>
//                   <div className="flex items-center gap-2 sm:gap-3">
//                     <FaHeadset className="text-green-600 text-sm sm:text-base flex-shrink-0" />
//                     <span className="text-xs sm:text-sm text-gray-700">
//                       Hỗ trợ AI {userPlanning.planning.aiModel?.modelType || "basic"}
//                     </span>
//                   </div>
//                   <div className="flex items-center gap-2 sm:gap-3">
//                     <FaCheckCircle className="text-green-600 text-sm sm:text-base flex-shrink-0" />
//                     <span className="text-xs sm:text-sm text-gray-700">Báo cáo chi tiết</span>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* Action Buttons */}
//             <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
//               {isPaymentSuccessful ? (
//                 <button
//                   onClick={handleGoToPlanning}
//                   className="flex-1 inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
//                 >
//                   <FaProjectDiagram />
//                   <span>Bắt đầu sử dụng</span>
//                 </button>
//               ) : (
//                 <button
//                   onClick={() => router.back()}
//                   className="flex-1 inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
//                 >
//                   <FaArrowLeft />
//                   <span>Thử lại</span>
//                 </button>
//               )}

//               <button
//                 onClick={handleGoToHome}
//                 className="flex-1 inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm sm:text-base"
//               >
//                 <FaHome />
//                 <span>Về trang chủ</span>
//               </button>
//             </div>
//           </div>
//         </div>
//   );
// }



"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { FaCheckCircle, FaTimesCircle, FaArrowLeft, FaHome } from "react-icons/fa";

export default function PaymentResultPage() {

  const searchParams = useSearchParams();
  const router = useRouter();


  // Lấy resultCode từ URL
  const resultCode = searchParams.get("resultCode");
  const isSuccess = resultCode === "0"; // 0 là thành công theo MoMo

  const handleGoBack = () => router.back();
  const handleGoHome = () => router.push("/");

  const orderId = searchParams.get("orderId");
  const amount = searchParams.get("amount");
  const orderInfo = searchParams.get("orderInfo");

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 mt-10">
      <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 text-center">
        <div className="mb-4">
          {isSuccess ? (
            <FaCheckCircle className="text-green-600 text-5xl mx-auto" />
          ) : (
            <FaTimesCircle className="text-red-600 text-5xl mx-auto" />
          )}
        </div>
        <h1 className="text-2xl font-bold mb-2">
          {isSuccess ? "Thanh toán thành công!" : "Thanh toán thất bại"}
        </h1>
        <p className="text-gray-600 mb-4">{orderInfo}</p>

        {orderId && (
          <div className="text-sm text-gray-700 mb-1">Order ID: {orderId}</div>
        )}
        {amount && (
          <div className="text-sm text-gray-700 mb-3">
            Số tiền: {Number(amount).toLocaleString("vi-VN")} VND
          </div>
        )}

        <div className="flex justify-center gap-3 mt-4">
          {!isSuccess && (
            <button
              onClick={handleGoBack}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Thử lại
            </button>
          )}
          <button
            onClick={handleGoHome}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            Trang chủ
          </button>
        </div>
      </div>
    </div>
  );
}


