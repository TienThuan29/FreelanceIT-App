import { useState, useCallback } from 'react';
import useAxios from './useAxios';
import { Api } from '@/configs/api';
import { ProjectFile, FileUploadResponse } from '@/types/file.type';
import { toast } from 'sonner';
import { 
    FiImage, 
    FiFileText, 
    FiFile, 
    FiBarChart, 
    FiMonitor, 
    FiArchive, 
    FiVideo, 
    FiMusic, 
    FiCode,
    FiFolder
} from 'react-icons/fi';

export const useFileManagement = () => {
    const [files, setFiles] = useState<ProjectFile[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const axiosInstance = useAxios();

    const uploadFile = useCallback(async (
        projectId: string, 
        file: File, 
        onProgress?: (progress: number) => void
    ): Promise<FileUploadResponse | null> => {
        try {
            setIsUploading(true);
            
            const formData = new FormData();
            formData.append('file', file);

            const response = await axiosInstance.post(
                `${Api.File.UPLOAD_PROJECT_FILE}/${projectId}/files`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                    onUploadProgress: (progressEvent: any) => {
                        if (onProgress && progressEvent.total) {
                            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                            onProgress(progress);
                        }
                    },
                }
            );

            if (response.data.success) {
                const uploadedFile = response.data.dataResponse;
                setFiles(prev => [...prev, uploadedFile]);
                toast.success('File uploaded successfully');
                return uploadedFile;
            } else {
                throw new Error(response.data.message || 'Upload failed');
            }
        } catch (error: any) {
            console.error('Error uploading file:', error);
            toast.error(error.response?.data?.message || 'Failed to upload file');
            return null;
        } finally {
            setIsUploading(false);
        }
    }, [axiosInstance]);

    const getProjectFiles = useCallback(async (projectId: string): Promise<ProjectFile[]> => {
        try {
            setIsLoading(true);
            
            const response = await axiosInstance.get(
                `${Api.File.GET_PROJECT_FILES}/${projectId}/files`
            );

            if (response.data.success) {
                const projectFiles = response.data.dataResponse;
                setFiles(projectFiles);
                return projectFiles;
            } else {
                throw new Error(response.data.message || 'Failed to get files');
            }
        } catch (error: any) {
            console.error('Error getting project files:', error);
            toast.error(error.response?.data?.message || 'Failed to get files');
            return [];
        } finally {
            setIsLoading(false);
        }
    }, [axiosInstance]);

    const deleteFile = useCallback(async (fileId: string): Promise<boolean> => {
        try {
            const response = await axiosInstance.delete(
                `${Api.File.DELETE_FILE}/${fileId}`
            );

            if (response.data.success) {
                setFiles(prev => prev.filter(file => file.id !== fileId));
                toast.success('File deleted successfully');
                return true;
            } else {
                throw new Error(response.data.message || 'Delete failed');
            }
        } catch (error: any) {
            console.error('Error deleting file:', error);
            toast.error(error.response?.data?.message || 'Failed to delete file');
            return false;
        }
    }, [axiosInstance]);

    const getFileById = useCallback(async (fileId: string): Promise<ProjectFile | null> => {
        try {
            const response = await axiosInstance.get(
                `${Api.File.GET_FILE_BY_ID}/${fileId}`
            );

            if (response.data.success) {
                return response.data.dataResponse;
            } else {
                throw new Error(response.data.message || 'Failed to get file');
            }
        } catch (error: any) {
            console.error('Error getting file:', error);
            toast.error(error.response?.data?.message || 'Failed to get file');
            return null;
        }
    }, [axiosInstance]);

    const formatFileSize = useCallback((bytes: number): string => {
        if (bytes === 0) return '0 Bytes';
        
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }, []);

    const getFileIcon = useCallback((mimeType: string) => {
        if (mimeType.startsWith('image/')) return FiImage;
        if (mimeType.includes('pdf')) return FiFileText;
        if (mimeType.includes('word')) return FiFileText;
        if (mimeType.includes('excel') || mimeType.includes('spreadsheet')) return FiBarChart;
        if (mimeType.includes('powerpoint') || mimeType.includes('presentation')) return FiMonitor;
        if (mimeType.includes('zip') || mimeType.includes('rar')) return FiArchive;
        if (mimeType.includes('video/')) return FiVideo;
        if (mimeType.includes('audio/')) return FiMusic;
        if (mimeType.includes('text/') || mimeType.includes('javascript') || mimeType.includes('html') || mimeType.includes('css')) return FiCode;
        return FiFolder;
    }, []);

    return {
        files,
        isLoading,
        isUploading,
        uploadFile,
        getProjectFiles,
        deleteFile,
        getFileById,
        formatFileSize,
        getFileIcon,
    };
};
