import logger from "@/libs/logger";
import { ResponseUtil } from "@/libs/response";
import { FileType } from "@/models/file.model";
import { FileService } from "@/services/file.service";
import { FileCreateRequest } from "@/types/req/file.req";
import { Request, Response } from "express";

export class FileApi {

    private readonly fileService: FileService;

    constructor() {
        this.fileService = new FileService();
        this.createFile = this.createFile.bind(this);
        this.getFilesByProjectId = this.getFilesByProjectId.bind(this);
        this.downloadFile = this.downloadFile.bind(this);
        this.createFile = this.createFile.bind(this);
        this.getFilesByProjectId = this.getFilesByProjectId.bind(this);
    }

    public async downloadFile(request: Request, response: Response) {
        try {
            const { fileId } = request.params;
            const file = await this.fileService.downloadFile(fileId);
            ResponseUtil.success(response, file, 'File downloaded successfully');
            return;
        }
        catch (error) {
            logger.error(error);
            ResponseUtil.error(response, error instanceof Error ? error.message : 'Internal Server Error', 400);
            return;
        }
    }

    public async createFile(request: Request, response: Response) {
        try {
            // Note: Project permissions (OWNER/EDITOR only) are validated by validateProjectFilePermission middleware
            // Validate that file was uploaded
            if (!request.file) {
                ResponseUtil.validation(response, 'No file uploaded', 'File is required');
                return;
            }
            const { projectId, name, description, password, fileType } = request.body;
            if (!name || !fileType) {
                ResponseUtil.validation(response, 'Missing required fields', {
                    name: !name ? 'File name is required' : undefined,
                    fileType: !fileType ? 'File type is required' : undefined,
                });
                return;
            }

            const allowedFileTypes = [FileType.DOCUMENT, FileType.IMAGE, FileType.ENV];
            if (!allowedFileTypes.includes(fileType as FileType)) {
                ResponseUtil.validation(response, 'Invalid file type', 
                    `File type must be one of: ${allowedFileTypes.join(', ')}`);
                return;
            }
            const fileCreateRequest: FileCreateRequest = {
                projectId,
                name,
                description,
                password,
                file: request.file.buffer,
                fileType: fileType as FileType
            };
            const createdFile = await this.fileService.createFile(fileCreateRequest, request.file.originalname);

            if (!createdFile) {
                ResponseUtil.error(response, 'Failed to create file', 500);
                return;
            }
            ResponseUtil.success(response, createdFile, 'File created successfully', 201);
        }
        catch (error) {
            logger.error('Error creating file:', error);
            ResponseUtil.error(response, error instanceof Error ? error.message : 'Internal Server Error', 500);
        }
    }

    public async getFilesByProjectId(request: Request, response: Response) {
        try {
            const { projectId } = request.params;
            const files = await this.fileService.getFilesByProjectId(projectId);
            ResponseUtil.success(response, files, 'Files retrieved successfully');
        }
        catch (error) {
            logger.error(error);
            ResponseUtil.error(response, error instanceof Error ? error.message : 'Internal Server Error', 400);
        }
    }


    


}