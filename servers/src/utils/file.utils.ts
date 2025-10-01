
export class FileUtils {

    public getFileContentType(fileName: Buffer): string {
        // Get the extension of the file
        const extension = fileName.toString('utf-8').split('.').pop();
        if (!extension) return 'application/octet-stream';
        
        switch (extension?.toLowerCase()) {
            // Document types
            case 'pdf':
                return 'application/pdf';
            case 'doc':
                return 'application/msword';
            case 'docx':
                return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
            case 'txt':
                return 'text/plain';
            case 'rtf':
                return 'application/rtf';
            case 'odt':
                return 'application/vnd.oasis.opendocument.text';
            
            // Image types
            case 'jpg':
            case 'jpeg':
                return 'image/jpeg';
            case 'png':
                return 'image/png';
            case 'gif':
                return 'image/gif';
            case 'bmp':
                return 'image/bmp';
            case 'webp':
                return 'image/webp';
            case 'svg':
                return 'image/svg+xml';
            case 'ico':
                return 'image/x-icon';
            
            // Environment/Config files
            case 'env':
                return 'text/plain';
            case 'json':
                return 'application/json';
            case 'xml':
                return 'application/xml';
            case 'yaml':
            case 'yml':
                return 'application/x-yaml';
            case 'toml':
                return 'application/toml';
            case 'ini':
                return 'text/plain';
            case 'conf':
                return 'text/plain';
            
            // Spreadsheet types
            case 'xls':
                return 'application/vnd.ms-excel';
            case 'xlsx':
                return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
            case 'csv':
                return 'text/csv';
            
            // Presentation types
            case 'ppt':
                return 'application/vnd.ms-powerpoint';
            case 'pptx':
                return 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
            
            // Archive types
            case 'zip':
                return 'application/zip';
            case 'rar':
                return 'application/x-rar-compressed';
            case 'tar':
                return 'application/x-tar';
            case 'gz':
                return 'application/gzip';
            case '7z':
                return 'application/x-7z-compressed';
            
            // Code files
            case 'js':
                return 'text/javascript';
            case 'ts':
                return 'text/typescript';
            case 'html':
                return 'text/html';
            case 'css':
                return 'text/css';
            case 'py':
                return 'text/x-python';
            case 'java':
                return 'text/x-java-source';
            case 'cpp':
            case 'cc':
            case 'cxx':
                return 'text/x-c++src';
            case 'c':
                return 'text/x-csrc';
            case 'h':
                return 'text/x-chdr';
            case 'php':
                return 'text/x-php';
            case 'rb':
                return 'text/x-ruby';
            case 'go':
                return 'text/x-go';
            case 'rs':
                return 'text/x-rust';
            case 'sh':
                return 'text/x-shellscript';
            case 'sql':
                return 'text/x-sql';
            
            // Video types
            case 'mp4':
                return 'video/mp4';
            case 'avi':
                return 'video/x-msvideo';
            case 'mov':
                return 'video/quicktime';
            case 'wmv':
                return 'video/x-ms-wmv';
            case 'flv':
                return 'video/x-flv';
            case 'webm':
                return 'video/webm';
            
            // Audio types
            case 'mp3':
                return 'audio/mpeg';
            case 'wav':
                return 'audio/wav';
            case 'ogg':
                return 'audio/ogg';
            case 'flac':
                return 'audio/flac';
            case 'aac':
                return 'audio/aac';
            
            // Default fallback
            default:
                return 'application/octet-stream';
        }
    }
}