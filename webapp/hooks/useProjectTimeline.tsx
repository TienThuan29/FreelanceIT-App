'use client';
import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import useAxios from './useAxios';
import { Api } from '@/configs/api';
import { ProjectTimeline } from '@/types/project.type';

interface ProjectTimelineCreateRequest {
  projectId: string;
  title: string;
  description?: string;
  meetingDate: Date | string;
}

interface ProjectTimelineUpdateRequest {
  title?: string;
  description?: string;
  meetingDate?: Date | string;
}

interface UseProjectTimelineReturn {
  timelines: ProjectTimeline[];
  isLoading: boolean;
  error: string | null;
  createTimeline: (timelineData: ProjectTimelineCreateRequest) => Promise<ProjectTimeline | null>;
  getTimelineById: (id: string) => Promise<ProjectTimeline | null>;
  getTimelinesByProjectId: (projectId: string) => Promise<ProjectTimeline[]>;
  getAllTimelines: () => Promise<ProjectTimeline[]>;
  updateTimeline: (id: string, updateData: ProjectTimelineUpdateRequest) => Promise<ProjectTimeline | null>;
  deleteTimeline: (id: string) => Promise<boolean>;
  refreshTimelines: () => Promise<void>;
  clearError: () => void;
}

export const useProjectTimeline = (): UseProjectTimelineReturn => {
  const axiosInstance = useAxios();
  const [state, setState] = useState({
    timelines: [] as ProjectTimeline[],
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

  // Create a new project timeline
  const createTimeline = useCallback(async (
    timelineData: ProjectTimelineCreateRequest
  ): Promise<ProjectTimeline | null> => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      const requestData = {
        ...timelineData,
        meetingDate: timelineData.meetingDate instanceof Date 
          ? timelineData.meetingDate.toISOString() 
          : timelineData.meetingDate
      };

      const response = await axiosInstance.post(Api.ProjectTimeline.CREATE, requestData);
      const newTimeline: ProjectTimeline = response.data.dataResponse;

      setState(prev => ({
        ...prev,
        timelines: [...prev.timelines, newTimeline],
        isLoading: false,
      }));

      toast.success('Tạo lịch họp thành công');
      return newTimeline;
    } catch (error) {
      handleError(error, 'create timeline');
      return null;
    }
  }, [axiosInstance, handleError]);

  // Get timeline by ID
  const getTimelineById = useCallback(async (id: string): Promise<ProjectTimeline | null> => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      const response = await axiosInstance.get(`${Api.ProjectTimeline.GET_BY_ID}/${id}`);
      const timeline: ProjectTimeline | null = response.data.dataResponse || null;

      setState(prev => ({
        ...prev,
        isLoading: false,
      }));

      return timeline;
    } catch (error) {
      handleError(error, 'fetch timeline by id');
      return null;
    }
  }, [axiosInstance, handleError]);

  // Get all timelines for a specific project
  const getTimelinesByProjectId = useCallback(async (projectId: string): Promise<ProjectTimeline[]> => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      const response = await axiosInstance.get(`${Api.ProjectTimeline.GET_BY_PROJECT}/${projectId}`);
      const timelines: ProjectTimeline[] = response.data.dataResponse || [];

      setState(prev => ({
        ...prev,
        timelines,
        isLoading: false,
      }));

      return timelines;
    } catch (error) {
      handleError(error, 'fetch timelines by project');
      return [];
    }
  }, [axiosInstance, handleError]);

  // Get all timelines
  const getAllTimelines = useCallback(async (): Promise<ProjectTimeline[]> => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      const response = await axiosInstance.get(Api.ProjectTimeline.GET_ALL);
      const timelines: ProjectTimeline[] = response.data.dataResponse || [];

      setState(prev => ({
        ...prev,
        timelines,
        isLoading: false,
      }));

      return timelines;
    } catch (error) {
      handleError(error, 'fetch all timelines');
      return [];
    }
  }, [axiosInstance, handleError]);

  // Update an existing timeline
  const updateTimeline = useCallback(async (
    id: string,
    updateData: ProjectTimelineUpdateRequest
  ): Promise<ProjectTimeline | null> => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      const requestData = {
        ...updateData,
        meetingDate: updateData.meetingDate 
          ? (updateData.meetingDate instanceof Date 
              ? updateData.meetingDate.toISOString() 
              : updateData.meetingDate)
          : undefined
      };

      const response = await axiosInstance.put(`${Api.ProjectTimeline.UPDATE}/${id}`, requestData);
      const updatedTimeline: ProjectTimeline = response.data.dataResponse;

      setState(prev => ({
        ...prev,
        timelines: prev.timelines.map(timeline => 
          timeline.id === id ? updatedTimeline : timeline
        ),
        isLoading: false,
      }));

      toast.success('Cập nhật lịch họp thành công');
      return updatedTimeline;
    } catch (error) {
      handleError(error, 'update timeline');
      return null;
    }
  }, [axiosInstance, handleError]);

  // Delete a timeline
  const deleteTimeline = useCallback(async (
    id: string
  ): Promise<boolean> => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      await axiosInstance.delete(`${Api.ProjectTimeline.DELETE}/${id}`);

      setState(prev => ({
        ...prev,
        timelines: prev.timelines.filter(timeline => timeline.id !== id),
        isLoading: false,
      }));

      toast.success('Xóa lịch họp thành công');
      return true;
    } catch (error) {
      handleError(error, 'delete timeline');
      return false;
    }
  }, [axiosInstance, handleError]);

  // Refresh timelines
  const refreshTimelines = useCallback(async () => {
    await getAllTimelines();
  }, [getAllTimelines]);

  // Clear error
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  return {
    timelines: state.timelines,
    isLoading: state.isLoading,
    error: state.error,
    createTimeline,
    getTimelineById,
    getTimelinesByProjectId,
    getAllTimelines,
    updateTimeline,
    deleteTimeline,
    refreshTimelines,
    clearError,
  };
};

export default useProjectTimeline;
