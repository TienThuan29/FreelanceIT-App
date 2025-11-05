'use client';
import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import useAxios from './useAxios';
import { Api } from '@/configs/api';

export interface PayOSCreatePaymentRequest {
  userId: string;
  planningId: string;
  amount: number;
  description: string;
  returnUrl?: string;
  cancelUrl?: string;
}

export interface PayOSPaymentResponse {
  bin: string;
  accountNumber: string;
  accountName: string;
  amount: number;
  description: string;
  orderCode: number;
  currency: string;
  paymentLinkId: string;
  status: string;
  checkoutUrl: string;
  qrCode: string;
}

export interface PayOSPaymentStatus {
  orderCode: number;
  amount: number;
  description: string;
  status: 'PENDING' | 'PROCESSING' | 'PAID' | 'CANCELLED';
}

interface UsePayOSReturn {
  isLoading: boolean;
  error: string | null;
  paymentData: PayOSPaymentResponse | null;
  paymentStatus: PayOSPaymentStatus | null;
  createPaymentLink: (paymentRequest: PayOSCreatePaymentRequest) => Promise<PayOSPaymentResponse | null>;
  getPaymentStatus: (orderCode: number) => Promise<PayOSPaymentStatus | null>;
  cancelPaymentLink: (orderCode: number, reason?: string) => Promise<any>;
  clearError: () => void;
  clearPaymentData: () => void;
}

export const usePayOS = (): UsePayOSReturn => {
  const axiosInstance = useAxios();
  const [state, setState] = useState({
    isLoading: false,
    error: null as string | null,
    paymentData: null as PayOSPaymentResponse | null,
    paymentStatus: null as PayOSPaymentStatus | null,
  });

  const handleError = useCallback((error: any, operation: string) => {
    const errorMessage = error.response?.data?.message || error.message || `Lỗi khi ${operation}`;
    setState(prev => ({ ...prev, error: errorMessage, isLoading: false }));
    toast.error(errorMessage);
    console.error(`Error ${operation}:`, error);
  }, []);

  const createPaymentLink = useCallback(async (
    paymentRequest: PayOSCreatePaymentRequest
  ): Promise<PayOSPaymentResponse | null> => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      const response = await axiosInstance.post(Api.PayOS.CREATE_PAYMENT, paymentRequest);
      const paymentResponse: PayOSPaymentResponse = response.data.dataResponse || response.data.data || response.data;

      if (!paymentResponse || !paymentResponse.checkoutUrl) {
        throw new Error('Không nhận được thông tin thanh toán từ PayOS');
      }

      setState(prev => ({
        ...prev,
        isLoading: false,
        paymentData: paymentResponse,
      }));

      toast.success('Tạo link thanh toán thành công!');
      return paymentResponse;
    } catch (error: any) {
      handleError(error, 'tạo link thanh toán');
      return null;
    }
  }, [axiosInstance, handleError]);

  const getPaymentStatus = useCallback(async (orderCode: number): Promise<PayOSPaymentStatus | null> => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      const response = await axiosInstance.get(`${Api.PayOS.PAYMENT_STATUS}/${orderCode}`);
      const statusData: PayOSPaymentStatus = response.data.dataResponse || response.data.data || response.data;

      setState(prev => ({
        ...prev,
        isLoading: false,
        paymentStatus: statusData,
      }));

      return statusData;
    } catch (error: any) {
      handleError(error, 'lấy trạng thái thanh toán');
      return null;
    }
  }, [axiosInstance, handleError]);

  const cancelPaymentLink = useCallback(async (
    orderCode: number,
    reason?: string
  ): Promise<any> => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      const response = await axiosInstance.post(`${Api.PayOS.CANCEL_PAYMENT}/${orderCode}`, { reason });
      const result = response.data.dataResponse || response.data.data || response.data;

      setState(prev => ({ ...prev, isLoading: false }));

      toast.success('Đã hủy thanh toán');
      return result;
    } catch (error: any) {
      handleError(error, 'hủy thanh toán');
      return null;
    }
  }, [axiosInstance, handleError]);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  const clearPaymentData = useCallback(() => {
    setState(prev => ({
      ...prev,
      paymentData: null,
      paymentStatus: null,
      error: null,
    }));
  }, []);

  return {
    isLoading: state.isLoading,
    error: state.error,
    paymentData: state.paymentData,
    paymentStatus: state.paymentStatus,
    createPaymentLink,
    getPaymentStatus,
    cancelPaymentLink,
    clearError,
    clearPaymentData,
  };
};
