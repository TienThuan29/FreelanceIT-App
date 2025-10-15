'use client';
import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import useAxios from './useAxios';
import { Api } from '@/configs/api';
import { Planning, UserPlanning, PlanningPurchaseRequest } from '@/types/planning.type';
import { mockPlanningAPI } from '@/data/mockPlanningData';

interface UsePlanningManagementReturn {
  plannings: Planning[];
  userPlannings: UserPlanning[];
  activeUserPlanning: UserPlanning | null;
  isLoading: boolean;
  error: string | null;
  getAllPlannings: () => Promise<Planning[]>;
  getPlanningById: (id: string) => Promise<Planning | null>;
  getUserPlannings: (userId?: string) => Promise<UserPlanning[]>;
  getActiveUserPlanning: (userId?: string) => Promise<UserPlanning | null>;
  purchasePlanning: (purchaseRequest: PlanningPurchaseRequest) => Promise<UserPlanning | null>;
  confirmPayment: (orderId: string) => Promise<UserPlanning | null>;
  refreshPlannings: () => Promise<void>;
  refreshUserPlannings: (userId?: string) => Promise<void>;
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

  // Get all plannings (using mock data)
  const getAllPlannings = useCallback(async (): Promise<Planning[]> => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const plannings = await mockPlanningAPI.getAllPlannings();
      
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
  }, [handleError]);

  // Get planning by ID
  const getPlanningById = useCallback(async (id: string): Promise<Planning | null> => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const planning = await mockPlanningAPI.getPlanningById(id);
      
      setState(prev => ({
        ...prev,
        isLoading: false,
      }));

      return planning;
    } catch (error) {
      handleError(error, 'fetch planning by id');
      return null;
    }
  }, [handleError]);

  // Get user plannings
  const getUserPlannings = useCallback(async (userId?: string): Promise<UserPlanning[]> => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      // Use mock user ID if not provided
      const mockUserId = userId || 'user-1';
      const userPlannings = await mockPlanningAPI.getUserPlannings(mockUserId);
      
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
  }, [handleError]);

  // Get active user planning
  const getActiveUserPlanning = useCallback(async (userId?: string): Promise<UserPlanning | null> => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      // Use mock user ID if not provided
      const mockUserId = userId || 'user-1';
      const activeUserPlanning = await mockPlanningAPI.getActiveUserPlanning(mockUserId);
      
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
  }, [handleError]);

  // Purchase planning
  const purchasePlanning = useCallback(async (purchaseRequest: PlanningPurchaseRequest): Promise<UserPlanning | null> => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      // Use mock user ID
      const mockUserId = 'user-1';
      const userPlanning = await mockPlanningAPI.purchasePlanning(mockUserId, purchaseRequest);
      
      setState(prev => ({
        ...prev,
        userPlannings: [...prev.userPlannings, userPlanning],
        activeUserPlanning: userPlanning,
        isLoading: false,
      }));

      toast.success('Planning purchased successfully');
      return userPlanning;
    } catch (error) {
      handleError(error, 'purchase planning');
      return null;
    }
  }, [handleError]);

  // Confirm payment
  const confirmPayment = useCallback(async (orderId: string): Promise<UserPlanning | null> => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const userPlanning = await mockPlanningAPI.confirmPayment(orderId);
      
      setState(prev => ({
        ...prev,
        userPlannings: prev.userPlannings.map(up => 
          up.orderId === orderId ? userPlanning : up
        ),
        activeUserPlanning: userPlanning.isEnable ? userPlanning : prev.activeUserPlanning,
        isLoading: false,
      }));

      toast.success('Payment confirmed successfully');
      return userPlanning;
    } catch (error) {
      handleError(error, 'confirm payment');
      return null;
    }
  }, [handleError]);

  // Refresh plannings
  const refreshPlannings = useCallback(async () => {
    await getAllPlannings();
  }, [getAllPlannings]);

  // Refresh user plannings
  const refreshUserPlannings = useCallback(async (userId?: string) => {
    await Promise.all([getUserPlannings(userId), getActiveUserPlanning(userId)]);
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
