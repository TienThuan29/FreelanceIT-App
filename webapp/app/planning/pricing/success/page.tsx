"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMoMo } from "@/hooks/useMomo";
import { usePayOS } from "@/hooks/usePayOS";
import { FaCheckCircle, FaSpinner } from "react-icons/fa";
import { motion } from "framer-motion";

function PaymentSuccessPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const momoHook = useMoMo();
  const { getPaymentStatus } = usePayOS();
  const [processing, setProcessing] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'momo' | 'payos' | null>(null);

  useEffect(() => {
    let isProcessed = false; // Prevent double processing

    const handlePayOSCallback = async (orderCode: string) => {
      console.log("Processing PayOS callback, orderCode:", orderCode);

      try {
        // Check payment status từ PayOS
        const status = await getPaymentStatus(Number(orderCode));
        
        console.log("PayOS payment status:", status);

        if (status && status.status === 'PAID') {
          setSuccess(true);
          setPaymentMethod('payos');
        } else {
          setError('Thanh toán chưa được xác nhận. Vui lòng kiểm tra lại.');
        }
      } catch (err) {
        console.error("Error checking PayOS status:", err);
        setError('Không thể kiểm tra trạng thái thanh toán');
      } finally {
        setProcessing(false);
      }
    };

    const handleMoMoCallback = async () => {
      // Get all parameters from URL
      const partnerCode = searchParams.get('partnerCode');
      const orderId = searchParams.get('orderId');
      const requestId = searchParams.get('requestId');
      const amount = searchParams.get('amount');
      const orderInfo = searchParams.get('orderInfo');
      const orderType = searchParams.get('orderType');
      const transId = searchParams.get('transId');
      const resultCode = searchParams.get('resultCode');
      const message = searchParams.get('message');
      const payType = searchParams.get('payType');
      const responseTime = searchParams.get('responseTime');
      const extraData = searchParams.get('extraData');
      const signature = searchParams.get('signature');

      console.log("Payment success - MoMo URL params:", {
        partnerCode,
        orderId,
        resultCode,
        extraData
      });

      // Check if payment was successful
      if (resultCode !== '0') {
        setError(message || 'Thanh toán thất bại');
        setProcessing(false);
        return;
      }

      isProcessed = true; // Mark as processing

      // Prepare callback data
      const callbackData = {
        partnerCode,
        orderId,
        requestId,
        amount: parseInt(amount || '0'),
        orderInfo,
        orderType,
        transId,
        resultCode: parseInt(resultCode || '0'),
        message,
        payType,
        responseTime: parseInt(responseTime || '0'),
        extraData,
        signature
      };

      console.log("Sending MoMo callback data to backend:", callbackData);

      // Call backend to process the payment
      try {
        const result = await momoHook.processCallback(callbackData);
        setSuccess(result);
        setPaymentMethod('momo');
        
        if (!result) {
          setError('Không thể xử lý thanh toán. Vui lòng liên hệ hỗ trợ.');
        }
      } catch (err) {
        console.error("MoMo callback error:", err);
        setSuccess(false);
        setError('Không thể xử lý thanh toán. Vui lòng liên hệ hỗ trợ.');
      } finally {
        setProcessing(false);
      }
    };

    const processCallback = async () => {
      if (isProcessed) return;
      isProcessed = true;

      // Detect payment method from URL parameters
      const orderCode = searchParams.get('orderCode'); // PayOS
      const momoOrderId = searchParams.get('orderId'); // MoMo
      const partnerCode = searchParams.get('partnerCode'); // MoMo

      if (orderCode) {
        // PayOS callback
        console.log("Detected PayOS payment");
        await handlePayOSCallback(orderCode);
      } else if (momoOrderId && partnerCode) {
        // MoMo callback
        console.log("Detected MoMo payment");
        await handleMoMoCallback();
      } else {
        setProcessing(false);
        setError('Thông tin thanh toán không hợp lệ');
      }
    };

    processCallback();
    
    // Cleanup function
    return () => {
      isProcessed = true; // Prevent any pending calls
    };
  }, [searchParams, momoHook, getPaymentStatus]);

  const handleGoBack = () => {
    router.push('/planning/pricing');
  };

  const handleViewTransactions = () => {
    router.push('/purchase-history');
  };

  if (processing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-2xl p-12 max-w-md w-full text-center"
        >
          <FaSpinner className="animate-spin text-6xl text-blue-600 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Đang xử lý thanh toán...
          </h2>
          <p className="text-gray-600">
            Vui lòng chờ trong giây lát
          </p>
        </motion.div>
      </div>
    );
  }

  if (error || !success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-100">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-2xl p-12 max-w-md w-full text-center"
        >
          <div className="text-6xl text-red-500 mb-6">❌</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Thanh toán thất bại
          </h2>
          <p className="text-gray-600 mb-8">
            {error || 'Đã có lỗi xảy ra trong quá trình xử lý thanh toán'}
          </p>
          <button
            onClick={handleGoBack}
            className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg"
          >
            Quay lại trang gói dịch vụ
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-2xl shadow-2xl p-12 max-w-md w-full text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        >
          <FaCheckCircle className="text-6xl text-green-500 mx-auto mb-6" />
        </motion.div>

        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          Thanh toán thành công!
        </h2>

        <p className="text-gray-600 mb-8">
          Cảm ơn bạn đã mua gói dịch vụ. Gói của bạn đã được kích hoạt.
        </p>

        <div className="space-y-3">
          <button
            onClick={handleViewTransactions}
            className="w-full px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg"
          >
            Xem lịch sử giao dịch
          </button>

          <button
            onClick={handleGoBack}
            className="w-full px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-all"
          >
            Quay lại trang gói dịch vụ
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="bg-white rounded-2xl shadow-2xl p-12 max-w-md w-full text-center">
          <FaSpinner className="animate-spin text-6xl text-blue-600 mx-auto mb-6" />
          <p className="text-gray-600">Đang tải...</p>
        </div>
      </div>
    }>
      <PaymentSuccessPageContent />
    </Suspense>
  );
}
