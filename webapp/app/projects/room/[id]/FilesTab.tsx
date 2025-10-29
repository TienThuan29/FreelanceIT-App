'use client'

import React, { useEffect, useState } from 'react'
import { FiUpload, FiFileText } from 'react-icons/fi'
import FileUpload from '@/components/FileUpload'
import FileList from '@/components/FileList'
import { useFileManagement } from '@/hooks/useFileManagement'
import { ProjectFile } from '@/types/file.type'

interface FilesTabProps {
    projectId: string
    onUpload?: () => void
}

export default function FilesTab({ projectId, onUpload }: FilesTabProps) {
    const [showUpload, setShowUpload] = useState(false)
    const [uploadProgress, setUploadProgress] = useState(0)
    
    const {
        files,
        isLoading,
        isUploading,
        uploadFile,
        getProjectFiles,
        deleteFile
    } = useFileManagement()

    // Load files when component mounts
    useEffect(() => {
        if (projectId) {
            getProjectFiles(projectId)
        }
    }, [projectId, getProjectFiles])

    const handleFileUpload = async (file: File) => {
        try {
            setUploadProgress(0)
            await uploadFile(projectId, file, (progress) => {
                setUploadProgress(progress)
            })
            
            // Refresh files list after upload
            await getProjectFiles(projectId)
            
            // Call the optional onUpload callback
            if (onUpload) {
                onUpload()
            }
        } catch (error) {
            console.error('Error uploading file:', error)
        }
    }

    const handleDeleteFile = async (fileId: string) => {
        try {
            await deleteFile(fileId)
            // Files list is automatically updated by the hook
        } catch (error) {
            console.error('Error deleting file:', error)
        }
    }

    const handleDownloadFile = (file: ProjectFile) => {
        const link = document.createElement('a')
        link.href = file.fileUrl
        link.download = file.originalName
        link.target = '_blank'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    const handleViewFile = (file: ProjectFile) => {
        window.open(file.fileUrl, '_blank')
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Tài liệu dự án</h2>
                <div className="flex items-center gap-2">
                    {!showUpload && (
                        <button 
                            onClick={() => setShowUpload(true)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                        >
                            <FiUpload className="w-4 h-4" />
                            Tải lên
                        </button>
                    )}
                </div>
            </div>

            {/* Upload Section */}
            {showUpload && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-medium text-gray-900">Upload Files</h3>
                        <button
                            onClick={() => setShowUpload(false)}
                            className="text-gray-400 hover:text-gray-600"
                        >
                            <FiFileText className="w-5 h-5" />
                        </button>
                    </div>
                    
                    <FileUpload
                        onFileUpload={handleFileUpload}
                        isUploading={isUploading}
                        uploadProgress={uploadProgress}
                    />
                </div>
            )}

            {/* Files List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <FileList
                    files={files}
                    isLoading={isLoading}
                    onDelete={handleDeleteFile}
                    onDownload={handleDownloadFile}
                    onView={handleViewFile}
                />
            </div>
        </div>
    )
}
