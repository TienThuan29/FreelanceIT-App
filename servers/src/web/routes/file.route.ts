import { Router } from 'express';
import { fileApiInstance } from '@/web/api/file.api';
import { uploadFile } from '@/web/middlewares/multer.middleware';
import { authenticate } from '@/web/middlewares/auth.middleware';

const router = Router();

// Apply authentication middleware to all routes
router.use(authenticate);

// Upload file to project
router.post('/projects/:projectId/files', uploadFile, fileApiInstance.uploadProjectFile);

// Get all files for a project
router.get('/projects/:projectId/files', fileApiInstance.getProjectFiles);

// Get file by ID
router.get('/files/:fileId', fileApiInstance.getFileById);

// Delete file
router.delete('/files/:fileId', fileApiInstance.deleteFile);

export default router;
