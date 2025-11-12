'use client';
import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import useAxios from './useAxios';
import { Api } from '@/configs/api';
import { Planning, UserPlanning, PlanningPurchaseRequest } from '@/types/planning.type';

interface UsePlanningManagementReturn {
  plannings: Planning[];
  userPlannings: UserPlanning[];
  activeUserPlanning: UserPlanning | null;
  currentUserPlanning: UserPlanning | null;
  isLoading: boolean;
  error: string | null;
  getAllPlannings: () => Promise<Planning[]>;
  getAllPlanningsPublic: () => Promise<Planning[]>;
  getPlanningById: (id: string) => Promise<Planning | null>;
  getPlanningByIdPublic: (id: string) => Promise<Planning | null>;
  getUserPlannings: (userId?: string) => Promise<UserPlanning[]>;
  getActiveUserPlanning: (userId?: string) => Promise<UserPlanning | null>;
  getCurrentUserPlanning: (userId?: string) => Promise<UserPlanning | null>;
  purchasePlanning: (purchaseRequest: PlanningPurchaseRequest) => Promise<UserPlanning | null>;
  confirmPayment: (orderId: string) => Promise<UserPlanning | null>;
  refreshPlannings: () => Promise<void>;
  refreshUserPlannings: (userId?: string) => Promise<void>;
  clearError: () => void;
  createPlanning: (planningData: Partial<Planning>) => Promise<Planning | null>;
  updatePlanning: (id: string, planningData: Partial<Planning>) => Promise<Planning | null>;
  deletePlanning: (id: string) => Promise<boolean>;
}

export const usePlanningManagement = (): UsePlanningManagementReturn => {
  const axiosInstance = useAxios();
  const [state, setState] = useState({
    plannings: [] as Planning[],
    userPlannings: [] as UserPlanning[],
    activeUserPlanning: null as UserPlanning | null,
    currentUserPlanning: null as UserPlanning | null,
    isLoading: false,
    error: null as string | null,
  });

  const handleError = useCallback((error: any, operation: string) => {
    const errorMessage = error.response?.data?.message || error.message || `Failed to ${operation}`;
    setState(prev => ({ ...prev, error: errorMessage, isLoading: false }));
    toast.error(errorMessage);
    console.error(`Error ${operation}:`, error);
  }, []);

  const getAllPlannings = useCallback(async (): Promise<Planning[]> => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      const response = await axiosInstance.get(Api.Planning.ADMIN_PLANNINGS);
      const plannings: Planning[] = response.data.dataResponse || [];

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

  const getAllPlanningsPublic = useCallback(async (): Promise<Planning[]> => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      const response = await axiosInstance.get(Api.Planning.GET_ALL_PLANNINGS);
      const plannings: Planning[] = response.data.dataResponse || [];

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

  const getPlanningById = useCallback(async (id: string): Promise<Planning | null> => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      const response = await axiosInstance.get(`${Api.Planning.ADMIN_PLANNINGS}/${id}`);
      const planning: Planning | null = response.data.dataResponse || null;

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

  const getPlanningByIdPublic = useCallback(async (id: string): Promise<Planning | null> => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      const response = await axiosInstance.get(`${Api.Planning.GET_PLANNING_BY_ID}/${id}`);
      const planning: Planning | null = response.data.dataResponse || null;

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
      setState(prev => ({ ...prev, isLoading: false }));
      return [];
    }
  }, [axiosInstance, handleError]);

  const getActiveUserPlanning = useCallback(async (_userId?: string): Promise<UserPlanning | null> => {
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

  const getCurrentUserPlanning = useCallback(async (_userId?: string): Promise<UserPlanning | null> => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const response = await axiosInstance.get(Api.Planning.GET_CURRENT_USER_PLANNING);
      const currentUserPlanning = response.data.dataResponse || null;
      
      setState(prev => ({
        ...prev,
        currentUserPlanning,
        isLoading: false,
      }));

      return currentUserPlanning;
    } catch (error: any) {
      // Only show error toast for actual errors (not 404 for missing planning)
      // Check if it's a 404 error which might be a normal case
      if (error.response?.status === 404) {
        // No planning found - this is normal, don't show error toast
        setState(prev => ({
          ...prev,
          currentUserPlanning: null,
          isLoading: false,
        }));
        return null;
      }
      // For other errors, show toast
      handleError(error, 'fetch current user planning');
      setState(prev => ({ ...prev, isLoading: false }));
      return null;
    }
  }, [axiosInstance, handleError]);

  const purchasePlanning = useCallback(async (purchaseRequest: PlanningPurchaseRequest): Promise<UserPlanning | null> => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const response = await axiosInstance.post(Api.Planning.PURCHASE_PLANNING, purchaseRequest);
      const userPlanning: UserPlanning = response.data.dataResponse;
      
      setState(prev => ({
        ...prev,
        userPlannings: [...prev.userPlannings, userPlanning],
        activeUserPlanning: userPlanning,
        isLoading: false,
      }));

      toast.success('Mua gói planning thành công');
      return userPlanning;
    } catch (error) {
      handleError(error, 'purchase planning');
      return null;
    }
  }, [axiosInstance, handleError]);

  const confirmPayment = useCallback(async (orderId: string): Promise<UserPlanning | null> => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const response = await axiosInstance.post(`${Api.Planning.CONFIRM_PAYMENT}/${orderId}/confirm-payment`);
      const userPlanning: UserPlanning = response.data.dataResponse;
      
      setState(prev => ({
        ...prev,
        userPlannings: prev.userPlannings.map(up =>
          up.orderId === orderId ? userPlanning : up
        ),
        activeUserPlanning: userPlanning.isEnable ? userPlanning : prev.activeUserPlanning,
        isLoading: false,
      }));

      toast.success('Xác nhận thanh toán thành công');
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

  // Admin CRUD operations
  const createPlanning = useCallback(async (planningData: Partial<Planning>): Promise<Planning | null> => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const response = await axiosInstance.post(Api.Planning.ADMIN_PLANNINGS, planningData);
      const newPlanning: Planning = response.data.dataResponse;
      
      setState(prev => ({
        ...prev,
        plannings: [...prev.plannings, newPlanning],
        isLoading: false,
      }));

      toast.success('Tạo gói planning thành công');
      return newPlanning;
    } catch (error) {
      handleError(error, 'create planning');
      return null;
    }
  }, [axiosInstance, handleError]);

  const updatePlanning = useCallback(async (id: string, planningData: Partial<Planning>): Promise<Planning | null> => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const response = await axiosInstance.put(`${Api.Planning.ADMIN_PLANNINGS}/${id}`, planningData);
      const updatedPlanning: Planning = response.data.dataResponse;
      
      setState(prev => ({
        ...prev,
        plannings: prev.plannings.map(p => p.id === id ? updatedPlanning : p),
        isLoading: false,
      }));

      toast.success('Cập nhật gói planning thành công');
      return updatedPlanning;
    } catch (error) {
      handleError(error, 'update planning');
      return null;
    }
  }, [axiosInstance, handleError]);

  const deletePlanning = useCallback(async (id: string): Promise<boolean> => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      await axiosInstance.delete(`${Api.Planning.ADMIN_PLANNINGS}/${id}`);
      
      setState(prev => ({
        ...prev,
        plannings: prev.plannings.filter(p => p.id !== id),
        isLoading: false,
      }));

      toast.success('Xóa gói planning thành công');
      return true;
    } catch (error) {
      handleError(error, 'delete planning');
      return false;
    }
  }, [axiosInstance, handleError]);

  // Clear error
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  return {
    plannings: state.plannings,
    userPlannings: state.userPlannings,
    activeUserPlanning: state.activeUserPlanning,
    currentUserPlanning: state.currentUserPlanning,
    isLoading: state.isLoading,
    error: state.error,
    getAllPlannings,
    getAllPlanningsPublic,
    getPlanningById,
    getPlanningByIdPublic,
    getUserPlannings,
    getActiveUserPlanning,
    getCurrentUserPlanning,
    purchasePlanning,
    confirmPayment,
    refreshPlannings,
    refreshUserPlannings,
    clearError,
    createPlanning,
    updatePlanning,
    deletePlanning,
  };
};
