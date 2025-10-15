'use client';
import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import useAxios from './useAxios';
import { Api } from '@/configs/api';

// MoMo Payment Types
export type CreateMomoPaymentRequest = {
    userId: string;
    planningId: string;
    amount: number;
    orderInfo: string;
}

export interface MoMoPaymentRequest {
    orderId: string;
    amount: number;
    orderInfo: string;
    returnUrl: string;
    notifyUrl: string;
    extraData?: string;
    requestType?: 'payWithATM' | 'payWithCC' | 'captureWallet';
    signature?: string;
}

export interface MoMoPaymentResponse {
    partnerCode: string;
    orderId: string;
    requestId: string;
    amount: number;
    responseTime: number;
    message: string;
    resultCode: number;
    payUrl?: string;
    applink?: string;
}

export interface MoMoCallbackData {
    partnerCode: string;
    orderId: string;
    requestId: string;
    amount: number;
    orderInfo: string;
    orderType: string;
    transId: string;
    resultCode: number;
    message: string;
    payType: string;
    responseTime: number;
    extraData: string;
    signature: string;
}

export interface MoMoTransactionStatus {
    orderId: string;
    resultCode: number;
    message: string;
    transId?: string;
    amount?: number;
    payType?: string;
    status: 'pending' | 'success' | 'failed' | 'cancelled';
}

interface UseMoMoReturn {
    isLoading: boolean;
    error: string | null;
    paymentUrl: string | null;
    transactionStatus: MoMoTransactionStatus | null;
    createMomoPayment: (paymentData: CreateMomoPaymentRequest) => Promise<MoMoPaymentResponse | null>;
    createPayment: (paymentData: Omit<MoMoPaymentRequest, 'signature'>) => Promise<MoMoPaymentResponse | null>;
    checkTransactionStatus: (orderId: string) => Promise<MoMoTransactionStatus | null>;
    verifyCallback: (callbackData: MoMoCallbackData) => Promise<boolean>;
    refundPayment: (orderId: string, amount?: number, description?: string) => Promise<any>;
    clearError: () => void;
    clearPaymentData: () => void;
}

export const useMoMo = (): UseMoMoReturn => {
    const axiosInstance = useAxios();
    const [state, setState] = useState({
        isLoading: false,
        error: null as string | null,
        paymentUrl: null as string | null,
        transactionStatus: null as MoMoTransactionStatus | null,
    });
    // Helper function to handle API errors
    const handleError = useCallback((error: any, operation: string) => {
        const errorMessage = error.response?.data?.message || error.message || `Failed to ${operation}`;
        setState(prev => ({ ...prev, error: errorMessage, isLoading: false }));
        toast.error(errorMessage);
        console.error(`Error ${operation}:`, error);
    }, []);

    // Create MoMo payment (using the correct API request format)
    const createMomoPayment = useCallback(async (
        paymentData: CreateMomoPaymentRequest
    ): Promise<MoMoPaymentResponse | null> => {
        console.log("Payment request data:", paymentData);
        try {
            setState(prev => ({ ...prev, isLoading: true, error: null }));

            const response = await axiosInstance.post(Api.Momo.CREATE_PAYMENT, paymentData);
            console.log("response", response.data);


            const paymentResponse: MoMoPaymentResponse = response.data.data || response.data;

            setState(prev => ({
                ...prev,
                isLoading: false,
                paymentUrl: paymentResponse.payUrl || null,
            }));

            if (paymentResponse.resultCode === 0) {
                toast.success('MoMo payment created successfully');
                return paymentResponse;
            } else {
                throw new Error(paymentResponse.message || 'Failed to create MoMo payment');
            }
        } catch (error: any) {
            if (error.response) {
                console.error("MoMo API error response:", error.response.data);
            } else {
                console.error("Other error:", error.message);
            }
            handleError(error, 'create MoMo payment');
            return null;
        }
    }, [axiosInstance, handleError]);

    // Create MoMo payment (legacy format)
    const createPayment = useCallback(async (
        paymentData: Omit<MoMoPaymentRequest, 'signature'>
    ): Promise<MoMoPaymentResponse | null> => {
        try {
            setState(prev => ({ ...prev, isLoading: true, error: null }));

            const response = await axiosInstance.post(Api.Momo.CREATE_PAYMENT, paymentData);

            const paymentResponse: MoMoPaymentResponse = response.data.data;

            console.log("paymentResponse", paymentResponse);
            setState(prev => ({
                ...prev,
                isLoading: false,
                paymentUrl: paymentResponse.payUrl || null,
            }));

            if (paymentResponse.resultCode === 0) {
                toast.success('Payment URL created successfully');
                return paymentResponse;
            } else {
                throw new Error(paymentResponse.message || 'Failed to create payment');
            }
        } catch (error: any) {
            handleError(error, 'create MoMo payment');
            return null;
        }
    }, [axiosInstance, handleError]);

    // Check transaction status
    const checkTransactionStatus = useCallback(async (orderId: string): Promise<MoMoTransactionStatus | null> => {
        try {
            setState(prev => ({ ...prev, isLoading: true, error: null })); const response = await axiosInstance.get(`${Api.Momo.CHECK_STATUS}/${orderId}`);

            const statusData = response.data.data;

            const transactionStatus: MoMoTransactionStatus = {
                orderId: statusData.orderId,
                resultCode: statusData.resultCode,
                message: statusData.message,
                transId: statusData.transId,
                amount: statusData.amount,
                payType: statusData.payType,
                status: getStatusFromResultCode(statusData.resultCode),
            };

            setState(prev => ({
                ...prev,
                isLoading: false,
                transactionStatus,
            }));

            return transactionStatus;
        } catch (error: any) {
            handleError(error, 'check transaction status');
            return null;
        }
    }, [axiosInstance, handleError]);

    // Verify MoMo callback
    const verifyCallback = useCallback(async (callbackData: MoMoCallbackData): Promise<boolean> => {
        try {
            setState(prev => ({ ...prev, isLoading: true, error: null })); const response = await axiosInstance.post(Api.Momo.VERIFY_CALLBACK, callbackData);

            const isValid = response.data.data.isValid;

            const transactionStatus: MoMoTransactionStatus = {
                orderId: callbackData.orderId,
                resultCode: callbackData.resultCode,
                message: callbackData.message,
                transId: callbackData.transId,
                amount: callbackData.amount,
                payType: callbackData.payType,
                status: getStatusFromResultCode(callbackData.resultCode),
            };

            setState(prev => ({
                ...prev,
                isLoading: false,
                transactionStatus,
            }));

            if (isValid && callbackData.resultCode === 0) {
                toast.success('Payment verified successfully');
            } else if (callbackData.resultCode !== 0) {
                toast.error(callbackData.message || 'Payment failed');
            }

            return isValid;
        } catch (error: any) {
            handleError(error, 'verify MoMo callback');
            return false;
        }
    }, [axiosInstance, handleError]);

    // Refund payment
    const refundPayment = useCallback(async (
        orderId: string,
        amount?: number,
        description?: string
    ): Promise<any> => {
        try {
            setState(prev => ({ ...prev, isLoading: true, error: null }));

            const refundData = {
                orderId,
                amount,
                description: description || `Refund for order ${orderId}`,
            }; const response = await axiosInstance.post(Api.Momo.REFUND, refundData);

            const refundResult = response.data.data;

            setState(prev => ({ ...prev, isLoading: false }));

            if (refundResult.resultCode === 0) {
                toast.success('Refund processed successfully');
            } else {
                toast.error(refundResult.message || 'Refund failed');
            }

            return refundResult;
        } catch (error: any) {
            handleError(error, 'process refund');
            return null;
        }
    }, [axiosInstance, handleError]);

    // Helper function to convert result code to status
    const getStatusFromResultCode = (resultCode: number): MoMoTransactionStatus['status'] => {
        switch (resultCode) {
            case 0:
                return 'success';
            case 1006:
            case 1001:
            case 1002:
                return 'cancelled';
            case 9000:
                return 'pending';
            default:
                return 'failed';
        }
    };

    // Clear error
    const clearError = useCallback(() => {
        setState(prev => ({ ...prev, error: null }));
    }, []);

    // Clear payment data
    const clearPaymentData = useCallback(() => {
        setState(prev => ({
            ...prev,
            paymentUrl: null,
            transactionStatus: null,
            error: null,
        }));
    }, []);
    return {
        isLoading: state.isLoading,
        error: state.error,
        paymentUrl: state.paymentUrl,
        transactionStatus: state.transactionStatus,
        createMomoPayment,
        createPayment,
        checkTransactionStatus,
        verifyCallback,
        refundPayment,
        clearError,
        clearPaymentData,
    };
};