export type FileUploadResponse = {
    id: string;
    fileName: string;
    fileUrl: string;
    fileSize: number;
    mimeType: string;
    uploadedDate: Date;
    uploadedBy: string;
}

export type FileWithUserResponse = {
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
    uploadedDate: Date;
    isDeleted: boolean;
    deletedDate?: Date;
    deletedBy?: string;
}
