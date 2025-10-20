'use client'

import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { FiUpload, FiX, FiFile, FiCheck } from 'react-icons/fi';
import { ProjectFile } from '@/types/file.type';
import { 
    FiImage, 
    FiFileText, 
    FiBarChart, 
    FiMonitor, 
    FiArchive, 
    FiVideo, 
    FiMusic, 
    FiCode,
    FiFolder
} from 'react-icons/fi';

interface FileUploadProps {
    onFileUpload: (file: File) => Promise<void>;
    isUploading: boolean;
    uploadProgress?: number;
    className?: string;
}

interface FilePreviewProps {
    file: File;
    onRemove: () => void;
    uploadProgress?: number;
    isUploading?: boolean;
    isUploaded?: boolean;
}

const FilePreview: React.FC<FilePreviewProps> = ({ 
    file, 
    onRemove, 
    uploadProgress = 0, 
    isUploading = false,
    isUploaded = false 
}) => {
    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const getFileIcon = (mimeType: string) => {
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
    };

    return (
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center gap-3">
                <div className="text-gray-600">
                    {React.createElement(getFileIcon(file.type), { className: "w-6 h-6" })}
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                        {file.name}
                    </p>
                    <p className="text-xs text-gray-500">
                        {formatFileSize(file.size)}
                    </p>
                </div>
            </div>
            
            <div className="flex items-center gap-2">
                {isUploading && (
                    <div className="flex items-center gap-2">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div 
                                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${uploadProgress}%` }}
                            />
                        </div>
                        <span className="text-xs text-gray-500">{uploadProgress}%</span>
                    </div>
                )}
                
                {isUploaded && (
                    <div className="flex items-center gap-1 text-green-600">
                        <FiCheck className="w-4 h-4" />
                        <span className="text-xs">Uploaded</span>
                    </div>
                )}
                
                <button
                    onClick={onRemove}
                    className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                    disabled={isUploading}
                >
                    <FiX className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};

const FileUpload: React.FC<FileUploadProps> = ({ 
    onFileUpload, 
    isUploading, 
    uploadProgress = 0,
    className = '' 
}) => {
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [uploadingFiles, setUploadingFiles] = useState<Set<string>>(new Set());
    const [uploadedFiles, setUploadedFiles] = useState<Set<string>>(new Set());

    const onDrop = useCallback((acceptedFiles: File[]) => {
        setSelectedFiles(prev => [...prev, ...acceptedFiles]);
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg'],
            'application/pdf': ['.pdf'],
            'application/msword': ['.doc'],
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
            'application/vnd.ms-excel': ['.xls'],
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
            'application/vnd.ms-powerpoint': ['.ppt'],
            'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
            'text/plain': ['.txt'],
            'application/json': ['.json'],
            'application/zip': ['.zip'],
            'application/x-rar-compressed': ['.rar'],
            'text/javascript': ['.js'],
            'text/html': ['.html'],
            'text/css': ['.css'],
            'text/x-python': ['.py'],
            'text/x-java-source': ['.java'],
        },
        maxSize: 100 * 1024 * 1024, // 100MB
        multiple: true,
    });

    const removeFile = (index: number) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleUpload = async (file: File) => {
        const fileKey = `${file.name}-${file.size}`;
        setUploadingFiles(prev => new Set(prev).add(fileKey));
        
        try {
            await onFileUpload(file);
            setUploadedFiles(prev => new Set(prev).add(fileKey));
        } catch (error) {
            console.error('Upload error:', error);
        } finally {
            setUploadingFiles(prev => {
                const newSet = new Set(prev);
                newSet.delete(fileKey);
                return newSet;
            });
        }
    };

    const uploadAllFiles = async () => {
        for (const file of selectedFiles) {
            await handleUpload(file);
        }
        // Clear selected files after upload
        setTimeout(() => {
            setSelectedFiles([]);
            setUploadedFiles(new Set());
        }, 1000);
    };

    return (
        <div className={`space-y-4 ${className}`}>
            {/* Dropzone */}
            <div
                {...getRootProps()}
                className={`
                    border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
                    ${isDragActive 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-300 hover:border-gray-400'
                    }
                    ${isUploading ? 'pointer-events-none opacity-50' : ''}
                `}
            >
                <input {...getInputProps()} />
                <FiUpload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-lg font-medium text-gray-900 mb-2">
                    {isDragActive ? 'Drop files here' : 'Drag & drop files here'}
                </p>
                <p className="text-sm text-gray-500 mb-4">
                    or click to select files
                </p>
                <p className="text-xs text-gray-400">
                    Supports images, documents, archives, and code files (max 100MB each)
                </p>
            </div>

            {/* Selected Files */}
            {selectedFiles.length > 0 && (
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium text-gray-900">
                            Selected Files ({selectedFiles.length})
                        </h3>
                        <button
                            onClick={uploadAllFiles}
                            disabled={isUploading || selectedFiles.length === 0}
                            className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Upload All
                        </button>
                    </div>
                    
                    <div className="space-y-2">
                        {selectedFiles.map((file, index) => {
                            const fileKey = `${file.name}-${file.size}`;
                            const isFileUploading = uploadingFiles.has(fileKey);
                            const isFileUploaded = uploadedFiles.has(fileKey);
                            
                            return (
                                <FilePreview
                                    key={`${file.name}-${index}`}
                                    file={file}
                                    onRemove={() => removeFile(index)}
                                    uploadProgress={isFileUploading ? uploadProgress : 0}
                                    isUploading={isFileUploading}
                                    isUploaded={isFileUploaded}
                                />
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default FileUpload;
