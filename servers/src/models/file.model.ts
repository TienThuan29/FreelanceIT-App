export type ProjectFile = {
    id: string;
    projectId: string;
    fileName: string;
    originalName: string;
    fileUrl: string;
    fileSize: number;
    mimeType: string;
    uploadedBy: string; // user id
    uploadedDate: Date;
    isDeleted: boolean;
    deletedDate?: Date;
    deletedBy?: string; // user id
}
