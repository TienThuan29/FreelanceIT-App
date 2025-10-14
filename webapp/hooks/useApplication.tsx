'use client';
import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import useAxios from './useAxios';
import { Api } from '@/configs/api';

interface ApplicationCreateRequest {
  projectId: string;
  coverLetter?: string;
  expectedRate?: number;
  deliveryTime?: number;
}

interface ApplicationState {
  isLoading: boolean;
  error: string | null;
}

export const useApplication = () => {
  const axiosInstance = useAxios();
  const [state, setState] = useState<ApplicationState>({
    isLoading: false,
    error: null,
  });

  // Helper function to handle API errors
  const handleError = useCallback((error: any, operation: string) => {
    const errorMessage = error.response?.data?.message || error.message || `Failed to ${operation}`;
    setState(prev => ({ ...prev, error: errorMessage, isLoading: false }));
    toast.error(errorMessage);
    console.error(`Error ${operation}:`, error);
  }, []);

  // Create application
  const createApplication = useCallback(async (applicationData: ApplicationCreateRequest): Promise<boolean> => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const response = await axiosInstance.post(Api.Application.CREATE, applicationData);
      
      setState(prev => ({ ...prev, isLoading: false }));
      
      toast.success(response.data.message || 'Gửi đơn ứng tuyển thành công!');
      return true;
    } catch (error) {
      handleError(error, 'create application');
      return false;
    }
  }, [axiosInstance, handleError]);

  // Check if user has applied to a project
  const checkUserAppliedToProject = useCallback(async (projectId: string): Promise<boolean> => {
    try {
      const response = await axiosInstance.get(`${Api.Application.CHECK_APPLIED}/${projectId}`);
      return response.data.dataResponse?.hasApplied || false;
    } catch (error) {
      console.error('Error checking application status:', error);
      return false;
    }
  }, [axiosInstance]);

  // Get applications by developer
  const getApplicationsByDeveloper = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const response = await axiosInstance.get(Api.Application.GET_BY_DEVELOPER);
      
      setState(prev => ({ ...prev, isLoading: false }));
      return response.data.dataResponse || [];
    } catch (error) {
      handleError(error, 'fetch developer applications');
      return [];
    }
  }, [axiosInstance, handleError]);

  // Get applications by project
  const getApplicationsByProject = useCallback(async (projectId: string) => {
    try {
      const response = await axiosInstance.get(`${Api.Application.GET_BY_PROJECT}/${projectId}`);
      return response.data.dataResponse || [];
    } catch (error) {
      console.error('Error fetching applications by project:', error);
      return [];
    }
  }, [axiosInstance]);

  // Utility functions
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  return {
    // State
    isLoading: state.isLoading,
    error: state.error,

    // Actions
    createApplication,
    checkUserAppliedToProject,
    getApplicationsByDeveloper,
    getApplicationsByProject,

    // Utilities
    clearError,
  };
};

export default useApplication;
