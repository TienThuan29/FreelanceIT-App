'use client';
import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import useAxios from './useAxios';
import { Api } from '@/configs/api';
import { ApplicationStatus } from '@/types/shared.type';

export interface ProjectApplication {
  id: string;
  projectId: string;
  developerId: string;
  coverLetter?: string;
  expectedRate?: number;
  deliveryTime?: number;
  rating?: number;
  status: ApplicationStatus;
  appliedDate?: Date | string;
  reviewedDate?: Date | string;
  notes?: string;
  createdDate?: Date | string;
  updatedDate?: Date | string;
  developer?: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    developerProfile?: {
      skills: Array<{
        id: string;
        name: string;
        proficiency: string;
        yearsOfExperience: number;
      }>;
      experience: number;
      bio?: string;
    };
  };
}

interface ApplicationManagementState {
  applications: ProjectApplication[];
  isLoading: boolean;
  isUpdating: boolean;
  error: string | null;
}

export const useApplicationManagement = () => {
  const axiosInstance = useAxios();
  const [state, setState] = useState<ApplicationManagementState>({
    applications: [],
    isLoading: false,
    isUpdating: false,
    error: null,
  });

  // Helper function to handle API errors
  const handleError = useCallback((error: any, operation: string) => {
    const errorMessage = error.response?.data?.message || error.message || `Failed to ${operation}`;
    setState(prev => ({ ...prev, error: errorMessage, isLoading: false, isUpdating: false }));
    toast.error(errorMessage);
    console.error(`Error ${operation}:`, error);
  }, []);

  // Get applications by project
  const getApplicationsByProject = useCallback(async (projectId: string): Promise<ProjectApplication[]> => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const response = await axiosInstance.get(`${Api.Application.GET_BY_PROJECT}/${projectId}`);
      const applications = response.data.dataResponse || [];
      
      setState(prev => ({
        ...prev,
        applications,
        isLoading: false,
      }));

      return applications;
    } catch (error) {
      handleError(error, 'fetch applications');
      return [];
    }
  }, [axiosInstance, handleError]);

  // Update application status
  const updateApplicationStatus = useCallback(async (
    applicationId: string, 
    status: ApplicationStatus, 
    notes?: string,
    projectId?: string,
    developerId?: string,
    expectedRate?: number
  ): Promise<ProjectApplication | null> => {
    try {
      setState(prev => ({ ...prev, isUpdating: true, error: null }));
      
      const response = await axiosInstance.put(`${Api.Application.UPDATE_STATUS}/${applicationId}/status`, {
        status,
        notes,
      });

      const updatedApplication = response.data.dataResponse;
      
      setState(prev => ({
        ...prev,
        applications: prev.applications.map(app => 
          app.id === applicationId ? updatedApplication : app
        ),
        isUpdating: false,
      }));

      // If status is ACCEPTED, add developer to project team
      if (status === ApplicationStatus.ACCEPTED && projectId && developerId) {
        try {
          await axiosInstance.post(`${Api.ProjectTeam.ADD_MEMBER}/${projectId}/members`, {
            developerId: developerId,
            agreedRate: expectedRate || 0,
            contractUrl: '' // Can be updated later
          });
          
          toast.success('Đã chấp nhận ứng tuyển và thêm vào đội ngũ dự án');
        } catch (teamError) {
          console.error('Error adding developer to project team:', teamError);
          console.error('Request details:', {
            projectId,
            developerId,
            expectedRate,
            endpoint: `${Api.ProjectTeam.ADD_MEMBER}/${projectId}/members`
          });
          
          // Check if it's a "already exists" error
          const errorMessage = (teamError as any).response?.data?.message || (teamError as any).message || '';
          if (errorMessage.includes('already') || errorMessage.includes('đã tồn tại')) {
            toast.success('Đã chấp nhận ứng tuyển (nhà phát triển đã có trong đội ngũ)');
          } else {
            toast.error('Đã chấp nhận ứng tuyển nhưng không thể thêm vào đội ngũ dự án');
          }
        }
      } else {
        toast.success(response.data.message || 'Cập nhật trạng thái thành công');
      }

      return updatedApplication;
    } catch (error) {
      handleError(error, 'update application status');
      return null;
    }
  }, [axiosInstance, handleError]);

  // Delete application
  const deleteApplication = useCallback(async (applicationId: string): Promise<boolean> => {
    try {
      setState(prev => ({ ...prev, isUpdating: true, error: null }));
      
      const response = await axiosInstance.delete(`${Api.Application.DELETE}/${applicationId}`);
      
      setState(prev => ({
        ...prev,
        applications: prev.applications.filter(app => app.id !== applicationId),
        isUpdating: false,
      }));

      toast.success(response.data.message || 'Xóa đơn ứng tuyển thành công');
      return true;
    } catch (error) {
      handleError(error, 'delete application');
      return false;
    }
  }, [axiosInstance, handleError]);

  // Get applications by developer (uses current authenticated user)
  const getApplicationsByDeveloper = useCallback(async (): Promise<ProjectApplication[]> => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const response = await axiosInstance.get(`${Api.Application.GET_BY_DEVELOPER}`);
      const applications = response.data.dataResponse || [];
      
      setState(prev => ({
        ...prev,
        applications,
        isLoading: false,
      }));

      return applications;
    } catch (error) {
      handleError(error, 'fetch applications by developer');
      return [];
    }
  }, [axiosInstance, handleError]);

  // Get application by ID
  const getApplicationById = useCallback(async (applicationId: string): Promise<ProjectApplication | null> => {
    try {
      const response = await axiosInstance.get(`${Api.Application.GET_BY_ID}/${applicationId}`);
      return response.data.dataResponse;
    } catch (error) {
      console.error('Error fetching application:', error);
      return null;
    }
  }, [axiosInstance]);

  // Utility functions
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  const clearApplications = useCallback(() => {
    setState(prev => ({ ...prev, applications: [] }));
  }, []);

  return {
    // State
    applications: state.applications,
    isLoading: state.isLoading,
    isUpdating: state.isUpdating,
    error: state.error,

    // Actions
    getApplicationsByProject,
    getApplicationsByDeveloper,
    updateApplicationStatus,
    deleteApplication,
    getApplicationById,

    // Utilities
    clearError,
    clearApplications,
  };
};

export default useApplicationManagement;
