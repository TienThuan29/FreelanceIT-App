/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FaCheckCircle, FaSpinner } from 'react-icons/fa';
import { usePayOS } from '@/hooks/usePayOS';

function PayOSSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderCode = searchParams.get('orderCode');
  
  const { getPaymentStatus } = usePayOS();
  const [loading, setLoading] = useState(true);
  const [paymentInfo, setPaymentInfo] = useState<any>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const verifyPayment = async () => {
      if (!orderCode) {
        setError('Không tìm thấy mã đơn hàng');
        setLoading(false);
        return;
      }

      try {
        console.log('Verifying PayOS payment for orderCode:', orderCode);
        const orderCodeNumber = parseInt(orderCode, 10);
        
        if (isNaN(orderCodeNumber)) {
          setError('Mã đơn hàng không hợp lệ');
          setLoading(false);
          return;
        }

        const result = await getPaymentStatus(orderCodeNumber);
        
        console.log('Payment verification result:', result);
        
        if (!result) {
          setError('Không tìm thấy thông tin thanh toán');
          setLoading(false);
          return;
        }

        setPaymentInfo(result);

        if (result.status !== 'PAID') {
          setError('Thanh toán chưa hoàn tất. Vui lòng thử lại.');
        }
      } catch (err: any) {
        console.error('Error verifying payment:', err);
        setError(err.message || 'Có lỗi xảy ra khi xác thực thanh toán');
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [orderCode, getPaymentStatus]);

  const handleBackToPlanning = () => {
    router.push('/planning');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <FaSpinner className="animate-spin text-6xl text-blue-600 mx-auto mb-4" />
          <p className="text-xl text-gray-700">Đang xác thực thanh toán...</p>
        </div>
      </div>
    );
  }

  if (error || !paymentInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-100">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="mb-6">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-5xl">❌</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Xác thực thất bại
            </h1>
            <p className="text-gray-600">
              {error || 'Không thể xác thực thanh toán'}
            </p>
          </div>

          <button
            onClick={handleBackToPlanning}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200"
          >
            Quay lại trang gói dịch vụ
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
        <div className="text-center mb-6">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaCheckCircle className="text-5xl text-green-500" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Thanh toán thành công! 🎉
          </h1>
          <p className="text-gray-600">
            Đơn hàng của bạn đã được xử lý thành công
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-6 mb-6 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Mã đơn hàng:</span>
            <span className="font-semibold text-gray-800">{paymentInfo.orderCode}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Số tiền:</span>
            <span className="font-semibold text-green-600">
              {paymentInfo.amount?.toLocaleString('vi-VN')} đ
            </span>
          </div>

          {paymentInfo.description && (
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Mô tả:</span>
              <span className="font-medium text-gray-800 text-right">
                {paymentInfo.description}
              </span>
            </div>
          )}

          <div className="flex justify-between items-center">
            <span className="text-gray-600">Trạng thái:</span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
              Đã thanh toán
            </span>
          </div>

          {paymentInfo.transactionDateTime && (
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Thời gian:</span>
              <span className="font-medium text-gray-800">
                {new Date(paymentInfo.transactionDateTime).toLocaleString('vi-VN')}
              </span>
            </div>
          )}
        </div>

        <div className="space-y-3">
          <button
            onClick={handleBackToPlanning}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 shadow-md hover:shadow-lg"
          >
            Quay lại trang gói dịch vụ
          </button>
          
          <button
            onClick={() => router.push('/purchase-history')}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg transition duration-200"
          >
            Xem lịch sử giao dịch
          </button>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500 text-center">
            Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi! 💙
          </p>
        </div>
      </div>
    </div>
  );
}

export default function PayOSSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
          <div className="text-center">
            <FaSpinner className="animate-spin text-6xl text-blue-600 mx-auto mb-4" />
            <p className="text-xl text-gray-700">Đang tải...</p>
          </div>
        </div>
      }
    >
      <PayOSSuccessContent />
    </Suspense>
  );
}
