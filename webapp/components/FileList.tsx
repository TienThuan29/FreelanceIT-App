'use client'

import React from 'react';
import { FiDownload, FiTrash2, FiEye, FiCalendar, FiUser } from 'react-icons/fi';
import { ProjectFile } from '@/types/file.type';
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
import ConfirmationModal from './ConfirmationModal';

interface FileListProps {
    files: ProjectFile[];
    isLoading?: boolean;
    onDelete?: (fileId: string) => void;
    onDownload?: (file: ProjectFile) => void;
    onView?: (file: ProjectFile) => void;
    className?: string;
}

interface FileItemProps {
    file: ProjectFile;
    onDelete?: (fileId: string) => void;
    onDownload?: (file: ProjectFile) => void;
    onView?: (file: ProjectFile) => void;
}

const FileItem: React.FC<FileItemProps> = ({ file, onDelete, onDownload, onView }) => {
    const [deleteModalOpen, setDeleteModalOpen] = React.useState(false);
    const [isDeleting, setIsDeleting] = React.useState(false);
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

    const formatDate = (dateString: string): string => {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleDownload = () => {
        if (onDownload) {
            onDownload(file);
        } else {
            // Default download behavior
            const link = document.createElement('a');
            link.href = file.fileUrl;
            link.download = file.originalName;
            link.target = '_blank';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    const handleView = () => {
        if (onView) {
            onView(file);
        } else {
            // Default view behavior - open in new tab
            window.open(file.fileUrl, '_blank');
        }
    };

    const handleDelete = () => {
        setDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (onDelete) {
            setIsDeleting(true);
            try {
                await onDelete(file.id);
                setDeleteModalOpen(false);
            } catch (error) {
                console.error('Error deleting file:', error);
            } finally {
                setIsDeleting(false);
            }
        }
    };

    const handleCancelDelete = () => {
        setDeleteModalOpen(false);
    };

    return (
        <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 hover:shadow-sm transition-shadow">
            <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="text-gray-600 flex-shrink-0">
                    {React.createElement(getFileIcon(file.mimeType), { className: "w-6 h-6" })}
                </div>
                
                <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-gray-900 truncate">
                        {file.originalName}
                    </h3>
                    <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                        <span>{formatFileSize(file.fileSize)}</span>
                        <div className="flex items-center gap-1">
                            <FiCalendar className="w-3 h-3" />
                            <span>{formatDate(file.uploadedDate)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <FiUser className="w-3 h-3" />
                            <span>Uploaded by {file.uploadedByUser?.fullname || file.uploadedBy}</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="flex items-center gap-2 flex-shrink-0">
                <button
                    onClick={handleView}
                    className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                    title="View file"
                >
                    <FiEye className="w-4 h-4" />
                </button>
                
                <button
                    onClick={handleDownload}
                    className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                    title="Download file"
                >
                    <FiDownload className="w-4 h-4" />
                </button>
                
                <button
                    onClick={handleDelete}
                    className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                    title="Delete file"
                >
                    <FiTrash2 className="w-4 h-4" />
                </button>
            </div>
            
            {/* Confirmation Modal */}
            <ConfirmationModal
                isOpen={deleteModalOpen}
                onClose={handleCancelDelete}
                onConfirm={handleConfirmDelete}
                title="Delete File"
                message={`Are you sure you want to delete "${file.originalName}"? This action cannot be undone.`}
                confirmText="Delete"
                cancelText="Cancel"
                type="danger"
                isLoading={isDeleting}
            />
        </div>
    );
};

const FileList: React.FC<FileListProps> = ({ 
    files, 
    isLoading = false, 
    onDelete, 
    onDownload, 
    onView,
    className = '' 
}) => {
    if (isLoading) {
        return (
            <div className={`space-y-3 ${className}`}>
                {[...Array(3)].map((_, index) => (
                    <div key={index} className="animate-pulse">
                        <div className="flex items-center gap-3 p-4 bg-gray-100 rounded-lg">
                            <div className="w-8 h-8 bg-gray-200 rounded"></div>
                            <div className="flex-1">
                                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (files.length === 0) {
        return (
            <div className={`text-center py-12 bg-white rounded-xl shadow-sm ${className}`}>
                <FiFolder className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No files uploaded yet</h3>
                <p className="text-gray-500">Upload files to share with your project team.</p>
            </div>
        );
    }

    return (
        <div className={`space-y-3 ${className}`}>
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-900">
                    Project Files ({files.length})
                </h3>
            </div>
            
            <div className="space-y-2">
                {files.map((file) => (
                    <FileItem
                        key={file.id}
                        file={file}
                        onDelete={onDelete}
                        onDownload={onDownload}
                        onView={onView}
                    />
                ))}
            </div>
        </div>
    );
};

export default FileList;
