import multer from 'multer';
import { Request } from 'express';

// Configure multer for memory storage (files will be stored in memory as Buffer)
const storage = multer.memoryStorage();

// File filter function to validate file types for project images
const projectImageFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    // Allow image files
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed'));
    }
};

// File filter function for general file uploads (documents, images, env files)
const generalFileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    // Get file extension from original filename
    const fileExtension = file.originalname.toLowerCase().split('.').pop();
    
    // Allow various file types based on your FileType model
    const allowedMimeTypes = [
        // Images
        'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/bmp', 'image/webp', 'image/svg+xml',
        // Documents
        'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain', 'application/rtf', 'application/vnd.oasis.opendocument.text',
        // Spreadsheets
        'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'text/csv',
        // Presentations
        'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        // Environment/Config files
        'application/json', 'application/xml', 'application/x-yaml',
        // Archives
        'application/zip', 'application/x-rar-compressed', 'application/x-tar', 'application/gzip',
        // Code files
        'text/javascript', 'text/html', 'text/css', 'text/x-python', 'text/x-java-source',
        // Generic types
        'application/octet-stream'
    ];

    // Common file extensions that should be allowed regardless of MIME type
    const allowedExtensions = [
        // Environment files
        'env', 'environment',
        // Config files
        'json', 'xml', 'yaml', 'yml', 'toml', 'ini', 'conf', 'config',
        // Text files
        'txt', 'md', 'readme',
        // Code files
        'js', 'ts', 'jsx', 'tsx', 'html', 'css', 'scss', 'less',
        'py', 'java', 'cpp', 'c', 'h', 'php', 'rb', 'go', 'rs', 'sh',
        // Document files
        'pdf', 'doc', 'docx', 'rtf', 'odt',
        // Spreadsheet files
        'xls', 'xlsx', 'csv',
        // Presentation files
        'ppt', 'pptx',
        // Image files
        'jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg', 'ico',
        // Archive files
        'zip', 'rar', 'tar', 'gz', '7z'
    ];
    
    // Check if file is allowed by MIME type or extension
    const isMimeTypeAllowed = allowedMimeTypes.includes(file.mimetype) || 
                             file.mimetype.startsWith('text/') || 
                             file.mimetype.startsWith('image/');
    
    const isExtensionAllowed = fileExtension && allowedExtensions.includes(fileExtension);
    
    if (isMimeTypeAllowed || isExtensionAllowed) {
        cb(null, true);
    } else {
        cb(new Error(`File type not supported. Uploaded file: ${file.originalname} (${file.mimetype})`));
    }
};

// Configure multer with options for project images
const projectImageUpload = multer({
    storage: storage,
    fileFilter: projectImageFilter,
    limits: {
        fileSize: 50 * 1024 * 1024, // 50MB limit (matching the express limit in app.ts)
        files: 1, // Allow only 1 file for project image
    },
});

// Configure multer with options for general file uploads
const generalFileUpload = multer({
    storage: storage,
    fileFilter: generalFileFilter,
    limits: {
        fileSize: 100 * 1024 * 1024, // 100MB limit for general files
        files: 1, // Allow only 1 file upload at a time
    },
});

// Export middleware for single file upload with field name 'projectImage'
export const uploadProjectImage = projectImageUpload.single('projectImage');

// Export middleware for handling form data with optional file
export const handleProjectFormData = projectImageUpload.single('projectImage');

// Export middleware for general file uploads with field name 'file'
export const uploadFile = generalFileUpload.single('file');
