import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { config } from '../configs/config';
import logger from '@/libs/logger';

export class S3Repository {

    private s3Client: S3Client;
    private bucketName: string;
    private publicBucketName: string;

    constructor() {
        this.bucketName = config.S3_BUCKET_NAME;
        this.publicBucketName = config.S3_PUBLIC_BUCKET_NAME;
        this.s3Client = new S3Client({
            region: config.AWS_REGION,
            credentials: {
                accessKeyId: config.AWS_ACCESS_KEY_ID,
                secretAccessKey: config.AWS_SECRET_ACCESS_KEY,
            },
        });
    }

    public async deleteFile(fileName: string): Promise<boolean> {
        try {
            const command = new DeleteObjectCommand({
                Bucket: this.bucketName,
                Key: fileName,
            });

            await this.s3Client.send(command);
            return true;
        } 
        catch (error) {
            logger.error('Error deleting file:', error);
            return false;
        }
    }


    public async generateSignedUrl(fileName: string, expiresIn: number = 3600): Promise<string> {
        try {
            const command = new GetObjectCommand({
                Bucket: this.bucketName,
                Key: fileName,
            });

            const signedUrl = await getSignedUrl(this.s3Client, command, { expiresIn });
            return signedUrl;
        } 
        catch (error) {
            logger.error('Error generating signed URL:', error);
            throw error;
        }
    }


    public async generatePresignedUploadUrl(fileName: string, contentType: string, expiresIn: number = 3600): Promise<string> {
        try {
            const command = new PutObjectCommand({
                Bucket: this.bucketName,
                Key: fileName,
                ContentType: contentType,
            });

            const presignedUrl = await getSignedUrl(this.s3Client, command, { expiresIn });
            return presignedUrl;
        } 
        catch (error) {
            logger.error('Error generating presigned upload URL:', error);
            throw error;
        }
    }


    public async fileExists(fileName: string): Promise<boolean> {
        try {
            const command = new GetObjectCommand({
                Bucket: this.bucketName,
                Key: fileName,
            });

            await this.s3Client.send(command);
            return true;
        } 
        catch (error) {
            logger.error('Error checking if file exists:', error);
            return false;
        }
    }

    public async uploadFile(fileBuffer: Buffer, fileName: string, contentType: string): Promise<string> {
        try {
            const command = new PutObjectCommand({
                Bucket: this.bucketName,
                Key: fileName,
                Body: fileBuffer,
                ContentType: contentType,
                // Note: ACL removed - bucket policy should handle access control
            });

            await this.s3Client.send(command);
            logger.info(`File uploaded successfully: ${fileName}`);
            
            // Return the fileName (key) that can be used with generateSignedUrl()
            return fileName;
        } 
        catch (error) {
            logger.error('Error uploading file:', error);
            throw error;
        }
    }

    public async uploadPublicFile(file: Buffer, fileName: string, contentType: string): Promise<string> {
        try {
            const command = new PutObjectCommand({
                Bucket: this.publicBucketName,
                Key: fileName,
                Body: file,
                ContentType: contentType,
                // Note: ACL removed - bucket should be configured for public access via bucket policy
            });

            await this.s3Client.send(command);
            return `https://${this.publicBucketName}.s3.${config.AWS_REGION}.amazonaws.com/${fileName}`;
        } 
        catch (error) {
            logger.error('Error uploading public file:', error);
            throw error;
        }
    }
}

export const s3RepositoryInstance = new S3Repository();