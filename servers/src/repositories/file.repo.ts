import { ProjectFile } from '@/models/file.model';
import logger from '@/libs/logger';
import { DynamoRepository } from './dynamo.repo';
import { config } from '@/configs/config';

export class FileRepository extends DynamoRepository {

    constructor() {
        super(config.PROJECT_FILE_TABLE);
    }

    public async createFile(file: ProjectFile): Promise<ProjectFile> {
        try {
            // Generate ID if not provided
            if (!file.id) {
                file.id = this.generateId();
            }
            
            // Set timestamps
            file.uploadedDate = new Date();
            file.isDeleted = false;
            
            // Convert dates to ISO strings for DynamoDB storage
            const fileToStore = {
                ...file,
                uploadedDate: this.convertDateToISOString(file.uploadedDate),
                deletedDate: this.convertDateToISOString(file.deletedDate)
            };
            
            const success = await this.putItem(fileToStore);
            if (!success) {
                throw new Error('Failed to create file');
            }
            
            logger.info(`File created: ${file.id}`);
            return file;
        } catch (error) {
            logger.error('Error creating file:', error);
            throw error;
        }
    }

    public async getFilesByProjectId(projectId: string): Promise<ProjectFile[]> {
        try {
            const results = await this.scanItemsWithFilter(
                'projectId = :projectId AND isDeleted = :isDeleted',
                {
                    ':projectId': projectId,
                    ':isDeleted': false
                }
            );
            
            // Convert dates back to Date objects
            return results.map(result => {
                if (result.uploadedDate) {
                    result.uploadedDate = this.convertISOStringToDate(result.uploadedDate);
                }
                if (result.deletedDate) {
                    result.deletedDate = this.convertISOStringToDate(result.deletedDate);
                }
                return result as ProjectFile;
            });
        } catch (error) {
            logger.error('Error getting files by project ID:', error);
            throw error;
        }
    }

    public async getFileById(id: string): Promise<ProjectFile | null> {
        try {
            const result = await this.getItem({ id });
            if (!result) {
                return null;
            }
            
            // Convert dates back to Date objects
            if (result.uploadedDate) {
                result.uploadedDate = this.convertISOStringToDate(result.uploadedDate);
            }
            if (result.deletedDate) {
                result.deletedDate = this.convertISOStringToDate(result.deletedDate);
            }
            
            return result as ProjectFile;
        } catch (error) {
            logger.error('Error getting file by ID:', error);
            throw error;
        }
    }

    public async deleteFile(id: string, deletedBy: string): Promise<boolean> {
        try {
            // Soft delete by updating the file record
            const updates = {
                isDeleted: true,
                deletedDate: this.convertDateToISOString(new Date()),
                deletedBy: deletedBy
            };
            
            const success = await this.updateItem({ id }, updates);
            if (!success) {
                throw new Error('Failed to delete file');
            }
            
            logger.info(`File deleted: ${id} by ${deletedBy}`);
            return true;
        } catch (error) {
            logger.error('Error deleting file:', error);
            throw error;
        }
    }

    public async updateFile(file: ProjectFile): Promise<ProjectFile | null> {
        try {
            // Convert dates to ISO strings for storage
            const fileToUpdate = {
                ...file,
                uploadedDate: this.convertDateToISOString(file.uploadedDate),
                deletedDate: this.convertDateToISOString(file.deletedDate)
            };
            
            const success = await this.putItem(fileToUpdate);
            if (!success) {
                throw new Error('Failed to update file');
            }
            
            logger.info(`File updated: ${file.id}`);
            return file;
        } catch (error) {
            logger.error('Error updating file:', error);
            throw error;
        }
    }

    private generateId(): string {
        return Math.random().toString(36).substring(2) + Date.now().toString(36);
    }
}

export const fileRepositoryInstance = new FileRepository();
