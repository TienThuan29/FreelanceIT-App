'use client';
import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import useAxios from './useAxios';
import { Api } from '@/configs/api';
import { Project, ProjectType } from '@/types/project.type';
import { ProjectStatus } from '@/types/shared.type';

interface ProjectCreateRequest {
  title: string;
  description?: string;
  category?: string;
  requiredSkills?: string[];
  projectType: string; // ProjectType ID
  budget?: number;
  minBudget?: number;
  maxBudget?: number;
  estimateDuration?: number;
  startDate?: Date;
  endDate?: Date;
  status: ProjectStatus;
  isRemote?: boolean;
  location?: string;
  attachments?: string[];
  projectImage?: File;
}

interface ProjectTypeCreateRequest {
  name: string;
}

interface ProjectUpdateRequest extends Partial<ProjectCreateRequest> {
  id: string;
}

interface ProjectTypeUpdateRequest {
  id: string;
  name: string;
  image?: File;
}

interface AddUserToProjectRequest {
  projectId: string;
  userId: string;
  agreedRate?: number;
  contractUrl?: string;
}

interface ProjectManagementState {
  projects: Project[];
  projectTypes: ProjectType[];
  isLoading: boolean;
  error: string | null;
}

export const useProjectManagement = () => {
  const axiosInstance = useAxios();
  const [state, setState] = useState<ProjectManagementState>({
    projects: [],
    projectTypes: [],
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

  // Helper function to create FormData for file uploads
  const createFormData = useCallback((data: any, fileField?: string, file?: File) => {
    const formData = new FormData();
    
    Object.keys(data).forEach(key => {
      if (data[key] !== undefined && data[key] !== null) {
        if (key === 'requiredSkills' && Array.isArray(data[key])) {
          // Handle array fields
          data[key].forEach((skill: string, index: number) => {
            formData.append(`requiredSkills[${index}]`, skill);
          });
        } else if (key === 'attachments' && Array.isArray(data[key])) {
          // Handle attachments array
          data[key].forEach((attachment: string, index: number) => {
            formData.append(`attachments[${index}]`, attachment);
          });
        } else if (key === 'startDate' || key === 'endDate') {
          // Handle date fields
          if (data[key]) {
            formData.append(key, new Date(data[key]).toISOString());
          }
        } else if (key !== fileField) {
          formData.append(key, data[key]);
        }
      }
    });

    if (file && fileField) {
      formData.append(fileField, file);
    }

    return formData;
  }, []);

  // Project CRUD Operations
  const createProject = useCallback(async (projectData: ProjectCreateRequest): Promise<Project | null> => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const formData = createFormData(projectData, 'projectImage', projectData.projectImage);
      
      const response = await axiosInstance.post(Api.Project.CREATE_PROJECT, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const newProject = response.data.dataResponse;
      setState(prev => ({
        ...prev,
        projects: [...prev.projects, newProject],
        isLoading: false,
      }));

      toast.success('Project created successfully');
      return newProject;
    } catch (error) {
      handleError(error, 'create project');
      return null;
    }
  }, [axiosInstance, createFormData, handleError]);

  const getProjects = useCallback(async (): Promise<Project[]> => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const response = await axiosInstance.get(Api.Project.GET_PROJECTS_BY_USER);
      const projects = response.data.dataResponse || [];
      
      setState(prev => ({
        ...prev,
        projects,
        isLoading: false,
      }));

      console.log('projects', projects);
      return projects;
    } catch (error) {
      handleError(error, 'fetch projects');
      return [];
    }
  }, [axiosInstance, handleError]);

  const getProjectById = useCallback(async (projectId: string): Promise<Project | null> => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const response = await axiosInstance.get(`${Api.Project.GET_PROJECT_BY_ID}/${projectId}`);
      const project = response.data.dataResponse;
      
      setState(prev => ({ ...prev, isLoading: false }));
      return project;
    } catch (error) {
      handleError(error, 'fetch project');
      return null;
    }
  }, [axiosInstance, handleError]);

  const updateProject = useCallback(async (projectData: ProjectUpdateRequest): Promise<Project | null> => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const { id, ...updateData } = projectData;
      const formData = createFormData(updateData, 'projectImage', updateData.projectImage);
      
      const response = await axiosInstance.put(`${Api.Project.UPDATE_PROJECT}/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const updatedProject = response.data.dataResponse;
      setState(prev => ({
        ...prev,
        projects: prev.projects.map(project => 
          project.id === id ? updatedProject : project
        ),
        isLoading: false,
      }));

      toast.success(response.data.message);
      return updatedProject;
    } catch (error) {
      handleError(error, 'update project');
      return null;
    }
  }, [axiosInstance, createFormData, handleError]);

  const deleteProject = useCallback(async (projectId: string): Promise<boolean> => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const response = await axiosInstance.delete(`${Api.Project.DELETE_PROJECT}/${projectId}`);
      
      setState(prev => ({
        ...prev,
        projects: prev.projects.filter(project => project.id !== projectId),
        isLoading: false,
      }));

      toast.success(response.data.message);
      return true;
    } catch (error) {
      handleError(error, 'delete project');
      return false;
    }
  }, [axiosInstance, handleError]);

  // Project Type CRUD Operations
  const createProjectType = useCallback(async (projectTypeData: ProjectTypeCreateRequest): Promise<ProjectType | null> => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const formData = createFormData(projectTypeData);
      
      const response = await axiosInstance.post(Api.Project.CREATE_PROJECT_TYPE, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const newProjectType = response.data.dataResponse;
      setState(prev => ({
        ...prev,
        projectTypes: [...prev.projectTypes, newProjectType],
        isLoading: false,
      }));

      toast.success(response.data.message);
      return newProjectType;
    } catch (error) {
      handleError(error, 'create project type');
      return null;
    }
  }, [axiosInstance, createFormData, handleError]);

  const getProjectTypes = useCallback(async (): Promise<ProjectType[]> => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const response = await axiosInstance.get(Api.Project.GET_PROJECT_TYPES_BY_USER);
      const projectTypes = response.data.dataResponse || [];
      
      setState(prev => ({
        ...prev,
        projectTypes,
        isLoading: false,
      }));

      return projectTypes;
    } catch (error) {
      handleError(error, 'fetch project types');
      return [];
    }
  }, [axiosInstance, handleError]);

  const getProjectTypeById = useCallback(async (projectTypeId: string): Promise<ProjectType | null> => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const response = await axiosInstance.get(`${Api.Project.GET_PROJECT_TYPE_BY_ID}/${projectTypeId}`);
      const projectType = response.data.dataResponse;
      
      setState(prev => ({ ...prev, isLoading: false }));
      return projectType;
    } catch (error) {
      handleError(error, 'fetch project type');
      return null;
    }
  }, [axiosInstance, handleError]);

  const updateProjectType = useCallback(async (projectTypeData: ProjectTypeUpdateRequest): Promise<ProjectType | null> => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const { id, ...updateData } = projectTypeData;
      const formData = createFormData(updateData, 'image', updateData.image);
      
      const response = await axiosInstance.put(`${Api.Project.UPDATE_PROJECT_TYPE}/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const updatedProjectType = response.data.dataResponse;
      setState(prev => ({
        ...prev,
        projectTypes: prev.projectTypes.map(projectType => 
          projectType.id === id ? updatedProjectType : projectType
        ),
        isLoading: false,
      }));

      toast.success(response.data.message);
      return updatedProjectType;
    } catch (error) {
      handleError(error, 'update project type');
      return null;
    }
  }, [axiosInstance, createFormData, handleError]);

  const deleteProjectType = useCallback(async (projectTypeId: string): Promise<boolean> => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const response = await axiosInstance.delete(`${Api.Project.DELETE_PROJECT_TYPE}/${projectTypeId}`);
      
      setState(prev => ({
        ...prev,
        projectTypes: prev.projectTypes.filter(projectType => projectType.id !== projectTypeId),
        isLoading: false,
      }));

      toast.success(response.data.message);
      return true;
    } catch (error) {
      handleError(error, 'delete project type');
      return false;
    }
  }, [axiosInstance, handleError]);

  // Team Management Operations
  const addUserToProject = useCallback(async (request: AddUserToProjectRequest): Promise<Project | null> => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const response = await axiosInstance.post(`${Api.Project.ADD_USER_TO_PROJECT}/${request.projectId}`, {
        userId: request.userId,
        agreedRate: request.agreedRate,
        contractUrl: request.contractUrl,
      });

      const updatedProject = response.data.dataResponse;
      setState(prev => ({
        ...prev,
        projects: prev.projects.map(project => 
          project.id === request.projectId ? updatedProject : project
        ),
        isLoading: false,
      }));

      toast.success(response.data.message);
      return updatedProject;
    } catch (error) {
      handleError(error, 'add user to project');
      return null;
    }
  }, [axiosInstance, handleError]);

  const removeUserFromProject = useCallback(async (projectId: string, userId: string): Promise<boolean> => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const response = await axiosInstance.delete(`${Api.Project.REMOVE_USER_FROM_PROJECT}/${projectId}/${userId}`);
      
      setState(prev => ({ ...prev, isLoading: false }));
      toast.success(response.data.message);
      return true;
    } catch (error) {
      handleError(error, 'remove user from project');
      return false;
    }
  }, [axiosInstance, handleError]);

  // Utility functions
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  const refreshProjects = useCallback(() => {
    return getProjects();
  }, [getProjects]);

  const refreshProjectTypes = useCallback(() => {
    return getProjectTypes();
  }, [getProjectTypes]);

  return {
    // State
    projects: state.projects,
    projectTypes: state.projectTypes,
    isLoading: state.isLoading,
    error: state.error,

    // Project CRUD
    createProject,
    getProjects,
    getProjectById,
    updateProject,
    deleteProject,

    // Project Type CRUD
    createProjectType,
    getProjectTypes,
    getProjectTypeById,
    updateProjectType,
    deleteProjectType,

    // Team Management
    addUserToProject,
    removeUserFromProject,

    // Utilities
    clearError,
    refreshProjects,
    refreshProjectTypes,
  };
};

export default useProjectManagement;
