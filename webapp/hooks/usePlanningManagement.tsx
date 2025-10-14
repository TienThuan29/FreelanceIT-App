'use client';
import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import useAxios from './useAxios';
import { Api } from '@/configs/api';
import { Planning, UserPlanning, PlanningPurchaseRequest, PaymentStatus } from '@/types/planning.type';

interface UsePlanningManagementReturn {
  plannings: Planning[];
  userPlannings: UserPlanning[];
  activeUserPlanning: UserPlanning | null;
  isLoading: boolean;
  error: string | null;
  getAllPlannings: () => Promise<Planning[]>;
  getPlanningById: (id: string) => Promise<Planning | null>;
  getUserPlannings: () => Promise<UserPlanning[]>;
  getActiveUserPlanning: () => Promise<UserPlanning | null>;
  purchasePlanning: (purchaseRequest: PlanningPurchaseRequest) => Promise<UserPlanning | null>;
  confirmPayment: (userPlanningId: string, transactionId: string) => Promise<UserPlanning | null>;
  refreshPlannings: () => Promise<void>;
  refreshUserPlannings: () => Promise<void>;
  clearError: () => void;
}

export const usePlanningManagement = (): UsePlanningManagementReturn => {
  const axiosInstance = useAxios();
  const [state, setState] = useState({
    plannings: [] as Planning[],
    userPlannings: [] as UserPlanning[],
    activeUserPlanning: null as UserPlanning | null,
    isLoading: false,
    error: null as string | null,
  });

  // Helper function to handle API errors
  const handleError = useCallback((error: any, operation: string) => {
    const errorMessage = error.response?.data?.message || error.message || `Failed to ${operation}`;
    setState(prev => ({ ...prev, error: errorMessage, isLoading: false }));
    toast.error(errorMessage);
    console.error(`Error ${operation}:`, error);
  }, []);

  // Get all plannings (public endpoint)
  const getAllPlannings = useCallback(async (): Promise<Planning[]> => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const response = await axiosInstance.get(Api.Planning.GET_ALL_PLANNINGS);
      const plannings = response.data.dataResponse || [];
      
      setState(prev => ({
        ...prev,
        plannings,
        isLoading: false,
      }));

      return plannings;
    } catch (error) {
      handleError(error, 'fetch plannings');
      return [];
    }
  }, [axiosInstance, handleError]);

  // Get planning by ID
  const getPlanningById = useCallback(async (id: string): Promise<Planning | null> => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const response = await axiosInstance.get(`${Api.Planning.GET_PLANNING_BY_ID}/${id}`);
      const planning = response.data.dataResponse;
      
      setState(prev => ({
        ...prev,
        isLoading: false,
      }));

      return planning;
    } catch (error) {
      handleError(error, 'fetch planning by id');
      return null;
    }
  }, [axiosInstance, handleError]);

  // Get user plannings
  const getUserPlannings = useCallback(async (): Promise<UserPlanning[]> => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const response = await axiosInstance.get(Api.Planning.GET_USER_PLANNINGS);
      const userPlannings = response.data.dataResponse || [];
      
      setState(prev => ({
        ...prev,
        userPlannings,
        isLoading: false,
      }));

      return userPlannings;
    } catch (error) {
      handleError(error, 'fetch user plannings');
      return [];
    }
  }, [axiosInstance, handleError]);

  // Get active user planning
  const getActiveUserPlanning = useCallback(async (): Promise<UserPlanning | null> => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const response = await axiosInstance.get(Api.Planning.GET_ACTIVE_USER_PLANNING);
      const activeUserPlanning = response.data.dataResponse;
      
      setState(prev => ({
        ...prev,
        activeUserPlanning,
        isLoading: false,
      }));

      return activeUserPlanning;
    } catch (error) {
      handleError(error, 'fetch active user planning');
      return null;
    }
  }, [axiosInstance, handleError]);

  // Purchase planning
  const purchasePlanning = useCallback(async (purchaseRequest: PlanningPurchaseRequest): Promise<UserPlanning | null> => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const response = await axiosInstance.post(Api.Planning.PURCHASE_PLANNING, purchaseRequest);
      const userPlanning = response.data.dataResponse;
      
      setState(prev => ({
        ...prev,
        userPlannings: [...prev.userPlannings, userPlanning],
        isLoading: false,
      }));

      toast.success('Planning purchased successfully');
      return userPlanning;
    } catch (error) {
      handleError(error, 'purchase planning');
      return null;
    }
  }, [axiosInstance, handleError]);

  // Confirm payment
  const confirmPayment = useCallback(async (userPlanningId: string, transactionId: string): Promise<UserPlanning | null> => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const response = await axiosInstance.post(`${Api.Planning.CONFIRM_PAYMENT}/${userPlanningId}`, {
        transactionId
      });
      const userPlanning = response.data.dataResponse;
      
      setState(prev => ({
        ...prev,
        userPlannings: prev.userPlannings.map(up => 
          up.id === userPlanningId ? userPlanning : up
        ),
        activeUserPlanning: userPlanning.isActive ? userPlanning : prev.activeUserPlanning,
        isLoading: false,
      }));

      toast.success('Payment confirmed successfully');
      return userPlanning;
    } catch (error) {
      handleError(error, 'confirm payment');
      return null;
    }
  }, [axiosInstance, handleError]);

  // Refresh plannings
  const refreshPlannings = useCallback(async () => {
    await getAllPlannings();
  }, [getAllPlannings]);

  // Refresh user plannings
  const refreshUserPlannings = useCallback(async () => {
    await Promise.all([getUserPlannings(), getActiveUserPlanning()]);
  }, [getUserPlannings, getActiveUserPlanning]);

  // Clear error
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  return {
    plannings: state.plannings,
    userPlannings: state.userPlannings,
    activeUserPlanning: state.activeUserPlanning,
    isLoading: state.isLoading,
    error: state.error,
    getAllPlannings,
    getPlanningById,
    getUserPlannings,
    getActiveUserPlanning,
    purchasePlanning,
    confirmPayment,
    refreshPlannings,
    refreshUserPlannings,
    clearError,
  };
};
