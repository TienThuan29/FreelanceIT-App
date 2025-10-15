'use client';
import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import useAxios from './useAxios';
import { useAuth } from '@/contexts/AuthContext';
import { Api } from '@/configs/api';
import { Project } from '@/types/project.type';
import axios from 'axios';

interface ProjectsState {
  projects: Project[];
  currentProject: Project | null;
  isLoading: boolean;
  isLoadingDetail: boolean;
  error: string | null;
}

export const useAllProjects = () => {
  const axiosInstance = useAxios();
  const { isAuthenticated } = useAuth();
  const [state, setState] = useState<ProjectsState>({
    projects: [],
    currentProject: null,
    isLoading: false,
    isLoadingDetail: false,
    error: null,
  });

  // Helper function to handle API errors
  const handleError = useCallback((error: any, operation: string) => {
    const errorMessage = error.response?.data?.message || error.message || `Failed to ${operation}`;
    setState(prev => ({ ...prev, error: errorMessage, isLoading: false, isLoadingDetail: false }));
    toast.error(errorMessage);
    console.error(`Error ${operation}:`, error);
  }, []);

  // Get all projects - uses authenticated endpoint if logged in, public endpoint if not
  const getAllProjects = useCallback(async (): Promise<Project[]> => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      let response;
      if (isAuthenticated) {
        // Use authenticated endpoint if user is logged in
        response = await axiosInstance.get(Api.Project.GET_ALL_PROJECTS);
      } else {
        // Use public endpoint if user is not logged in
        response = await axios.get(Api.BASE_API + Api.Project.GET_ALL_PROJECTS_PUBLIC);
      }
      
      const projects = response.data.dataResponse || [];
      
      setState(prev => ({
        ...prev,
        projects,
        isLoading: false,
      }));

      console.log('All projects fetched:', projects);
      return projects;
    } catch (error) {
      handleError(error, 'fetch all projects');
      return [];
    }
  }, [axiosInstance, isAuthenticated, handleError]);

  // Get project by ID - uses authenticated endpoint if logged in, public endpoint if not
  const getProjectById = useCallback(async (projectId: string): Promise<Project | null> => {
    try {
      setState(prev => ({ ...prev, isLoadingDetail: true, error: null }));
      
      let response;
      if (isAuthenticated) {
        // Use authenticated endpoint if user is logged in
        response = await axiosInstance.get(`${Api.Project.GET_PROJECT_BY_ID}/${projectId}`);
      } else {
        // Use public endpoint if user is not logged in
        response = await axios.get(`${Api.BASE_API}${Api.Project.GET_PROJECT_BY_ID_PUBLIC}/${projectId}`);
      }
      
      const project = response.data.dataResponse;
      
      setState(prev => ({
        ...prev,
        currentProject: project,
        isLoadingDetail: false,
      }));

      console.log('Project detail fetched:', project);
      return project;
    } catch (error) {
      handleError(error, 'fetch project detail');
      return null;
    }
  }, [axiosInstance, isAuthenticated, handleError]);

  // Utility functions
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  const refreshProjects = useCallback(() => {
    return getAllProjects();
  }, [getAllProjects]);

  const refreshProject = useCallback((projectId: string) => {
    return getProjectById(projectId);
  }, [getProjectById]);

  const clearCurrentProject = useCallback(() => {
    setState(prev => ({ ...prev, currentProject: null }));
  }, []);

  return {
    // State
    projects: state.projects,
    currentProject: state.currentProject,
    isLoading: state.isLoading,
    isLoadingDetail: state.isLoadingDetail,
    error: state.error,

    // Actions
    getAllProjects,
    getProjectById,

    // Utilities
    clearError,
    refreshProjects,
    refreshProject,
    clearCurrentProject,
  };
};

export default useAllProjects;
