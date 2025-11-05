/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import useAxios from './useAxios';
import { Api } from '@/configs/api';

// SeePay Payment Types
export type CreateSeePayPaymentRequest = {
    userId: string;
    planningId: string;
    amount: number;
    description?: string;
}

export interface SeePayPaymentResponse {
    success: boolean;
    checkoutUrl: string;
    formFields: Record<string, any>;
    orderId: string;
}

interface UseSeePayReturn {
    isLoading: boolean;
    error: string | null;
    checkoutUrl: string | null;
    formFields: Record<string, any> | null;
    createSeePayPayment: (paymentData: CreateSeePayPaymentRequest) => Promise<SeePayPaymentResponse | null>;
    submitPaymentForm: (checkoutUrl: string, formFields: Record<string, any>) => void;
    clearError: () => void;
}

export const useSeePay = (): UseSeePayReturn => {
    const axiosInstance = useAxios();
    const [state, setState] = useState({
        isLoading: false,
        error: null as string | null,
        checkoutUrl: null as string | null,
        formFields: null as Record<string, string> | null,
    });

    // Helper function to handle API errors
    const handleError = useCallback((error: any, operation: string) => {
        const errorMessage = error.response?.data?.message || error.message || `Lỗi khi ${operation}`;
        setState(prev => ({ ...prev, error: errorMessage, isLoading: false }));
        toast.error(errorMessage);
        console.error(`Error ${operation}:`, error);
    }, []);

    // Create SeePay payment
    const createSeePayPayment = useCallback(async (
        paymentData: CreateSeePayPaymentRequest
    ): Promise<SeePayPaymentResponse | null> => {
        console.log("SeePay payment request data:", paymentData);
        try {
            setState(prev => ({ ...prev, isLoading: true, error: null }));

            const response = await axiosInstance.post(Api.SeePay.CREATE_PAYMENT, paymentData);
            console.log("Full SeePay response:", response.data);

            // Backend uses ResponseUtil which returns data in 'dataResponse'
            const paymentResponse: SeePayPaymentResponse = response.data.dataResponse || response.data.data || response.data;

            console.log("SeePay payment response:", paymentResponse);

            if (!paymentResponse || typeof paymentResponse !== 'object') {
                throw new Error('Invalid response from SeePay service');
            }

            setState(prev => ({
                ...prev,
                isLoading: false,
                checkoutUrl: paymentResponse.checkoutUrl || null,
                formFields: paymentResponse.formFields || null,
            }));

            if (paymentResponse.success && paymentResponse.checkoutUrl && paymentResponse.formFields) {
                toast.success('Tạo thanh toán SeePay thành công!');
                return paymentResponse;
            } else {
                throw new Error('Không thể tạo thanh toán SeePay');
            }
        } catch (error: any) {
            if (error.response) {
                console.error("SeePay API error response:", error.response.data);
            } else {
                console.error("Error creating SeePay payment:", error.message);
            }
            handleError(error, 'create SeePay payment');
            return null;
        }
    }, [axiosInstance, handleError]);

    // Submit payment form programmatically
    const submitPaymentForm = useCallback((checkoutUrl: string, formFields: Record<string, any>) => {
        // Create a form dynamically and submit it
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = checkoutUrl;
        form.style.display = 'none';

        Object.keys(formFields).forEach(field => {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = field;
            input.value = String(formFields[field]); // Ensure value is string
            form.appendChild(input);
        });

        document.body.appendChild(form);
        form.submit();
        document.body.removeChild(form);
    }, []);

    // Clear error
    const clearError = useCallback(() => {
        setState(prev => ({ ...prev, error: null }));
    }, []);

    return {
        isLoading: state.isLoading,
        error: state.error,
        checkoutUrl: state.checkoutUrl,
        formFields: state.formFields,
        createSeePayPayment,
        submitPaymentForm,
        clearError,
    };
};

