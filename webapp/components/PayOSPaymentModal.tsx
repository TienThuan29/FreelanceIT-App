'use client';

import { useState, useEffect, useCallback } from 'react';
import { FaTimes, FaCheckCircle, FaCopy, FaQrcode, FaExternalLinkAlt, FaSpinner } from 'react-icons/fa';
import { QRCodeSVG } from 'qrcode.react';
import { toast } from 'sonner';
import { PayOSPaymentResponse, usePayOS } from '@/hooks/usePayOS';

interface PayOSPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  paymentData: PayOSPaymentResponse;
  onPaymentComplete?: () => void;
}

export const PayOSPaymentModal: React.FC<PayOSPaymentModalProps> = ({
  isOpen,
  onClose,
  paymentData,
  onPaymentComplete
}) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isCheckingPayment, setIsCheckingPayment] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'PENDING' | 'PROCESSING' | 'PAID' | 'CANCELLED'>('PENDING');
  const { getPaymentStatus } = usePayOS();

  // Debug: Log payment data
  useEffect(() => {
    if (isOpen && paymentData) {
      console.log('PayOS Payment Data:', paymentData);
      console.log('QR Code:', paymentData.qrCode);
    }
  }, [isOpen, paymentData]);

  // Auto-check payment status every 5 seconds
  const checkPaymentStatus = useCallback(async () => {
    if (!paymentData?.orderCode || paymentStatus === 'PAID') return;

    try {
      setIsCheckingPayment(true);
      const status = await getPaymentStatus(paymentData.orderCode);
      
      if (status) {
        console.log('Payment status checked:', status);
        setPaymentStatus(status.status);
        
        if (status.status === 'PAID') {
          toast.success('Thanh toán thành công! 🎉');
          onPaymentComplete?.();
          
          // Redirect to PayOS success page after 2 seconds
          setTimeout(() => {
            onClose();
            window.location.href = `/planning/pricing/payos-success?orderCode=${paymentData.orderCode}`;
          }, 2000);
        } else if (status.status === 'CANCELLED') {
          toast.error('Thanh toán đã bị hủy');
        }
      }
    } catch (error) {
      console.error('Error checking payment status:', error);
    } finally {
      setIsCheckingPayment(false);
    }
  }, [paymentData?.orderCode, paymentStatus, getPaymentStatus, onPaymentComplete, onClose]);

  // Poll payment status every 5 seconds
  useEffect(() => {
    if (!isOpen || !paymentData?.orderCode) return;

    // Check immediately when modal opens
    checkPaymentStatus();

    // Then check every 5 seconds
    const interval = setInterval(checkPaymentStatus, 5000);

    return () => clearInterval(interval);
  }, [isOpen, paymentData?.orderCode, checkPaymentStatus]);

  useEffect(() => {
    // Prevent body scroll when modal is open
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    toast.success(`Đã sao chép ${fieldName}`);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 backdrop-blur-md backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-t-2xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-1">Thanh toán PayOS</h2>
                <p className="text-blue-100 text-sm">Quét mã QR hoặc chuyển khoản thủ công</p>
              </div>
              <button
                onClick={onClose}
                className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors"
              >
                <FaTimes size={24} />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Payment Status Banner */}
            {paymentStatus === 'PAID' && (
              <div className="bg-green-50 border-2 border-green-500 rounded-xl p-4 flex items-center gap-3">
                <FaCheckCircle className="text-green-500 text-3xl" />
                <div>
                  <h3 className="text-green-800 font-bold text-lg">Thanh toán thành công!</h3>
                  <p className="text-green-600 text-sm">Đơn hàng của bạn đã được xác nhận</p>
                </div>
              </div>
            )}

            {paymentStatus === 'PENDING' && isCheckingPayment && (
              <div className="bg-blue-50 border-2 border-blue-300 rounded-xl p-4 flex items-center gap-3">
                <FaSpinner className="text-blue-500 text-2xl animate-spin" />
                <div>
                  <h3 className="text-blue-800 font-semibold">Đang kiểm tra thanh toán...</h3>
                  <p className="text-blue-600 text-sm">Vui lòng chờ trong giây lát</p>
                </div>
              </div>
            )}

            {/* QR Code Section */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 text-center">
              <div className="inline-flex items-center gap-2 mb-4 text-blue-700">
                <FaQrcode className="text-2xl" />
                <h3 className="text-lg font-semibold">Quét mã QR để thanh toán</h3>
              </div>
              
              <div className="bg-white p-4 rounded-xl inline-block shadow-lg">
                {paymentData?.qrCode ? (
                  <QRCodeSVG
                    value={paymentData.qrCode}
                    size={280}
                    level="H"
                    includeMargin={true}
                    className="mx-auto"
                  />
                ) : (
                  <div className="w-[280px] h-[280px] flex items-center justify-center bg-gray-100 rounded-lg">
                    <div className="text-center">
                      <FaQrcode className="text-6xl text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">Đang tải QR code...</p>
                    </div>
                  </div>
                )}
              </div>

              <p className="text-sm text-gray-600 mt-4">
                Sử dụng ứng dụng ngân hàng để quét mã QR
              </p>

              {/* Open in App Button */}
              <a
                href={paymentData.checkoutUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                <FaExternalLinkAlt />
                Mở trang thanh toán
              </a>
            </div>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">Hoặc chuyển khoản thủ công</span>
              </div>
            </div>

            {/* Transfer Info */}
            <div className="space-y-4">
              {/* Bank Name */}
              <div className="bg-gray-50 rounded-lg p-4">
                <label className="text-sm text-gray-600 mb-1 block">Ngân hàng</label>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-lg">{paymentData.accountName || 'VietQR'}</span>
                </div>
              </div>

              {/* Account Number */}
              <div className="bg-gray-50 rounded-lg p-4">
                <label className="text-sm text-gray-600 mb-1 block">Số tài khoản</label>
                <div className="flex items-center justify-between">
                  <span className="font-mono font-semibold text-lg">{paymentData.accountNumber}</span>
                  <button
                    onClick={() => copyToClipboard(paymentData.accountNumber, 'Số tài khoản')}
                    className="text-blue-600 hover:text-blue-700 p-2 rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    {copiedField === 'Số tài khoản' ? (
                      <FaCheckCircle className="text-green-600" />
                    ) : (
                      <FaCopy />
                    )}
                  </button>
                </div>
              </div>

              {/* Amount */}
              <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-200">
                <label className="text-sm text-blue-700 mb-1 block font-medium">Số tiền</label>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-2xl text-blue-900">
                    {formatAmount(paymentData.amount)}
                  </span>
                  <button
                    onClick={() => copyToClipboard(paymentData.amount.toString(), 'Số tiền')}
                    className="text-blue-600 hover:text-blue-700 p-2 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    {copiedField === 'Số tiền' ? (
                      <FaCheckCircle className="text-green-600" />
                    ) : (
                      <FaCopy />
                    )}
                  </button>
                </div>
              </div>

              {/* Description */}
              <div className="bg-yellow-50 rounded-lg p-4 border-2 border-yellow-200">
                <label className="text-sm text-yellow-700 mb-1 block font-medium">
                  Nội dung chuyển khoản (Bắt buộc)
                </label>
                <div className="flex items-center justify-between">
                  <span className="font-mono font-semibold text-yellow-900 break-all">
                    {paymentData.description}
                  </span>
                  <button
                    onClick={() => copyToClipboard(paymentData.description, 'Nội dung')}
                    className="text-yellow-600 hover:text-yellow-700 p-2 rounded-lg hover:bg-yellow-100 transition-colors flex-shrink-0 ml-2"
                  >
                    {copiedField === 'Nội dung' ? (
                      <FaCheckCircle className="text-green-600" />
                    ) : (
                      <FaCopy />
                    )}
                  </button>
                </div>
                <p className="text-xs text-yellow-700 mt-2">
                  ⚠️ Vui lòng nhập chính xác nội dung này khi chuyển khoản
                </p>
              </div>

              {/* Order Code */}
              <div className="bg-gray-50 rounded-lg p-4">
                <label className="text-sm text-gray-600 mb-1 block">Mã đơn hàng</label>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-gray-900">{paymentData.orderCode}</span>
                  <button
                    onClick={() => copyToClipboard(paymentData.orderCode.toString(), 'Mã đơn hàng')}
                    className="text-blue-600 hover:text-blue-700 p-2 rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    {copiedField === 'Mã đơn hàng' ? (
                      <FaCheckCircle className="text-green-600" />
                    ) : (
                      <FaCopy />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Important Note */}
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
              <div className="flex items-start gap-3">
                <FaCheckCircle className="text-blue-600 mt-1 flex-shrink-0" />
                <div className="text-sm text-blue-900">
                  <p className="font-semibold mb-2">Lưu ý quan trọng:</p>
                  <ul className="list-disc list-inside space-y-1 text-blue-800">
                    <li>Giao dịch sẽ tự động được xác nhận sau khi chuyển khoản thành công</li>
                    <li>Vui lòng chuyển khoản đúng số tiền và nội dung</li>
                    <li>Không đóng cửa sổ này cho đến khi thanh toán hoàn tất</li>
                    <li>Link thanh toán có hiệu lực trong 15 phút</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-gray-50 px-6 py-4 rounded-b-2xl border-t">
            <button
              onClick={onClose}
              className="w-full py-3 px-6 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-semibold"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
