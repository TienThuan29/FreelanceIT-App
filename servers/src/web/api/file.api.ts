import { Request, Response } from 'express';
import { fileServiceInstance } from '@/services/file.service';
import { uploadFile } from '@/web/middlewares/multer.middleware';
import logger from '@/libs/logger';
import { ResponseUtil } from '@/libs/response';
import { User } from '@/models/user.model';

export class FileApi {

    public uploadProjectFile = async (req: Request, res: Response) => {
        try {
            const { projectId } = req.params;
            const userId = (req as any).user?.id;

            if (!userId) {
                return ResponseUtil.error(res, 'User not authenticated', 401);
            }

            if (!req.file) {
                return ResponseUtil.error(res, 'No file uploaded', 400);
            }

            const uploadRequest = {
                projectId,
                fileName: req.file.originalname,
                fileSize: req.file.size,
                mimeType: req.file.mimetype
            };

            const result = await fileServiceInstance.uploadFile(
                req.file.buffer,
                uploadRequest,
                userId
            );

            return ResponseUtil.success(res, result, 'File uploaded successfully');
        } catch (error) {
            logger.error('Error uploading project file:', error);
            return ResponseUtil.error(res, 'Failed to upload file', 500);
        }
    };

    public getProjectFiles = async (req: Request, res: Response) => {
        try {
            const { projectId } = req.params;
            const userId = (req as any).user?.id;

            if (!userId) {
                return ResponseUtil.error(res, 'User not authenticated', 401);
            }

            const files = await fileServiceInstance.getProjectFiles(projectId);
            return ResponseUtil.success(res, files, 'Files retrieved successfully');
        } catch (error) {
            logger.error('Error getting project files:', error);
            return ResponseUtil.error(res, 'Failed to get files', 500);
        }
    };

    public deleteFile = async (req: Request, res: Response) => {
        try {
            const { fileId } = req.params;
            const userId = (req as any).user?.id;

            if (!userId) {
                return ResponseUtil.error(res, 'User not authenticated', 401);
            }

            const success = await fileServiceInstance.deleteFile(fileId, userId);
            
            if (success) {
                return ResponseUtil.success(res, null, 'File deleted successfully');
            } else {
                return ResponseUtil.error(res, 'Failed to delete file', 500);
            }
        } catch (error) {
            logger.error('Error deleting file:', error);
            return ResponseUtil.error(res, 'Failed to delete file', 500);
        }
    };

    public getFileById = async (req: Request, res: Response) => {
        try {
            const { fileId } = req.params;
            const userId = (req as any).user?.id;

            if (!userId) {
                return ResponseUtil.error(res, 'User not authenticated', 401);
            }

            const file = await fileServiceInstance.getFileById(fileId);
            
            if (!file) {
                return ResponseUtil.error(res, 'File not found', 404);
            }

            return ResponseUtil.success(res, file, 'File retrieved successfully');
        } catch (error) {
            logger.error('Error getting file by ID:', error);
            return ResponseUtil.error(res, 'Failed to get file', 500);
        }
    };
}

export const fileApiInstance = new FileApi();
