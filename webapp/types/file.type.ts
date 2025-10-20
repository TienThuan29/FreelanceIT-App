export interface ProjectFile {
    id: string;
    projectId: string;
    fileName: string;
    originalName: string;
    fileUrl: string;
    fileSize: number;
    mimeType: string;
    uploadedBy: string;
    uploadedByUser?: {
        id: string;
        fullname: string;
        email: string;
        avatar?: string;
    };
    uploadedDate: string;
    isDeleted: boolean;
    deletedDate?: string;
    deletedBy?: string;
}

export interface FileUploadResponse {
    id: string;
    fileName: string;
    fileUrl: string;
    fileSize: number;
    mimeType: string;
    uploadedDate: string;
    uploadedBy: string;
}

export interface FileUploadProgress {
    loaded: number;
    total: number;
    percentage: number;
}
