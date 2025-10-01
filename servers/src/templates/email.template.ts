import {
    WelcomeEmailData,
    VerificationEmailData,
    PasswordResetEmailData,
    NotificationEmailData
} from '@/types/email.type';

// Enhanced HTML template with modern design and accessibility
const getBaseTemplate = (title: string, headerColor: string, content: string): string => {
    return `
        <!DOCTYPE html>
        <html lang="vi" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="x-apple-disable-message-reformatting">
            <meta name="format-detection" content="telephone=no,address=no,email=no,date=no,url=no">
            <title>${title}</title>
            <!--[if mso]>
            <noscript>
                <xml>
                    <o:OfficeDocumentSettings>
                        <o:AllowPNG/>
                        <o:PixelsPerInch>96</o:PixelsPerInch>
                    </o:OfficeDocumentSettings>
                </xml>
            </noscript>
            <![endif]-->
            <style>
                /* Reset and base styles */
                * { margin: 0; padding: 0; box-sizing: border-box; }
                
                body {
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                    line-height: 1.7;
                    color: #2d3748;
                    background-color: #f7fafc;
                    margin: 0;
                    padding: 0;
                    -webkit-font-smoothing: antialiased;
                    -moz-osx-font-smoothing: grayscale;
                    text-rendering: optimizeLegibility;
                }
                
                /* Prevent auto-scaling in iOS */
                .no-auto-scale { -webkit-text-size-adjust: none; }
                
                /* Container with enhanced shadow and modern design */
                .email-container {
                    max-width: 600px;
                    margin: 30px auto;
                    background-color: #ffffff;
                    border-radius: 16px;
                    overflow: hidden;
                    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
                    border: 1px solid rgba(0, 0, 0, 0.05);
                }
                
                /* Enhanced header with modern gradient and subtle patterns */
                .email-header {
                    background: ${headerColor};
                    background: linear-gradient(135deg, ${headerColor} 0%, ${adjustBrightness(headerColor, -15)} 50%, ${adjustBrightness(headerColor, -25)} 100%);
                    position: relative;
                    color: #ffffff;
                    padding: 50px 30px 40px;
                    text-align: center;
                    overflow: hidden;
                }
                
                .email-header::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E") repeat;
                    opacity: 0.3;
                }
                
                .email-header h1 {
                    font-size: 32px;
                    font-weight: 700;
                    margin: 0;
                    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                    position: relative;
                    z-index: 1;
                    letter-spacing: -0.5px;
                }
                
                .email-header .subtitle {
                    font-size: 18px;
                    opacity: 0.95;
                    margin-top: 12px;
                    font-weight: 400;
                    position: relative;
                    z-index: 1;
                    letter-spacing: 0.25px;
                }
                
                /* Enhanced content area */
                .email-content {
                    padding: 50px 40px;
                    background-color: #ffffff;
                    position: relative;
                }
                
                .email-content p {
                    margin: 0 0 18px 0;
                    font-size: 16px;
                    line-height: 1.8;
                    color: #4a5568;
                }
                
                .email-content h2 {
                    color: #1a202c;
                    font-size: 28px;
                    margin: 0 0 24px 0;
                    font-weight: 700;
                    letter-spacing: -0.5px;
                    line-height: 1.3;
                }
                
                .email-content h3 {
                    color: #2d3748;
                    font-size: 20px;
                    margin: 32px 0 16px 0;
                    font-weight: 600;
                    letter-spacing: -0.25px;
                }
                
                .email-content ul {
                    margin: 20px 0;
                    padding-left: 24px;
                }
                
                .email-content li {
                    margin-bottom: 8px;
                    color: #4a5568;
                    line-height: 1.7;
                }
                
                /* Enhanced buttons with modern design */
                .btn {
                    display: inline-block;
                    padding: 16px 32px;
                    background: ${headerColor};
                    background: linear-gradient(135deg, ${headerColor} 0%, ${adjustBrightness(headerColor, -10)} 100%);
                    color: #ffffff !important;
                    text-decoration: none;
                    border-radius: 12px;
                    font-weight: 600;
                    font-size: 16px;
                    margin: 24px 0;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    border: none;
                    cursor: pointer;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
                    letter-spacing: 0.5px;
                    text-transform: none;
                    position: relative;
                    overflow: hidden;
                }
                
                .btn::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: -100%;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
                    transition: left 0.5s;
                }
                
                .btn:hover::before {
                    left: 100%;
                }
                
                .btn:hover {
                    background: ${adjustBrightness(headerColor, -15)};
                    transform: translateY(-2px);
                    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
                }
                
                .btn-secondary {
                    background: linear-gradient(135deg, #718096 0%, #4a5568 100%);
                    color: #ffffff !important;
                }
                
                .btn-secondary:hover {
                    background: linear-gradient(135deg, #4a5568 0%, #2d3748 100%);
                }
                
                /* Enhanced code display with modern styling */
                .code-display {
                    background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
                    border: 2px solid #e2e8f0;
                    padding: 30px 20px;
                    text-align: center;
                    font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;
                    font-size: 32px;
                    font-weight: 700;
                    letter-spacing: 8px;
                    margin: 32px 0;
                    border-radius: 16px;
                    color: #1a202c;
                    word-break: break-all;
                    position: relative;
                    box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.06);
                    background-image: url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23e2e8f0' fill-opacity='0.3'%3E%3Cpath d='M0 0h20v20H0z'/%3E%3C/g%3E%3C/svg%3E");
                }
                
                .code-display::before {
                    content: 'VERIFICATION CODE';
                    position: absolute;
                    top: -12px;
                    left: 50%;
                    transform: translateX(-50%);
                    background: #ffffff;
                    padding: 4px 12px;
                    font-size: 12px;
                    font-weight: 600;
                    color: #718096;
                    letter-spacing: 1px;
                    border-radius: 6px;
                    border: 1px solid #e2e8f0;
                }
                
                .token-display {
                    background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
                    border: 1px solid #e2e8f0;
                    padding: 20px;
                    font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;
                    font-size: 14px;
                    word-break: break-all;
                    margin: 20px 0;
                    border-radius: 12px;
                    border-left: 4px solid ${headerColor};
                    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
                    color: #2d3748;
                }
                
                /* Enhanced alert boxes with modern design */
                .alert {
                    padding: 20px 24px;
                    border-radius: 12px;
                    margin: 24px 0;
                    border: 1px solid;
                    position: relative;
                    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
                }
                
                .alert strong {
                    font-weight: 600;
                    margin-bottom: 4px;
                    display: block;
                }
                
                .alert-info {
                    background: linear-gradient(135deg, #ebf8ff 0%, #bee3f8 100%);
                    border-color: #3182ce;
                    color: #2a4365;
                }
                
                .alert-warning {
                    background: linear-gradient(135deg, #fffbeb 0%, #fef5e7 100%);
                    border-color: #d69e2e;
                    color: #744210;
                }
                
                .alert-success {
                    background: linear-gradient(135deg, #f0fff4 0%, #c6f6d5 100%);
                    border-color: #38a169;
                    color: #22543d;
                }
                
                .alert-error {
                    background: linear-gradient(135deg, #fed7d7 0%, #feb2b2 100%);
                    border-color: #e53e3e;
                    color: #742a2a;
                }
                
                /* Enhanced footer */
                .email-footer {
                    background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
                    padding: 40px 30px;
                    text-align: center;
                    border-top: 1px solid #e2e8f0;
                    position: relative;
                }
                
                .email-footer p {
                    margin: 0 0 12px 0;
                    font-size: 14px;
                    color: #718096;
                    line-height: 1.6;
                }
                
                .email-footer a {
                    color: ${headerColor};
                    text-decoration: none;
                    font-weight: 500;
                    transition: color 0.2s ease;
                }
                
                .email-footer a:hover {
                    color: ${adjustBrightness(headerColor, -15)};
                    text-decoration: underline;
                }
                
                .footer-brand {
                    font-weight: 600;
                    color: #4a5568 !important;
                    margin-top: 16px !important;
                }
                
                /* Social links with enhanced styling */
                .social-links {
                    margin: 24px 0 0 0;
                }
                
                .social-links a {
                    display: inline-block;
                    margin: 0 12px;
                    padding: 12px;
                    background: #ffffff;
                    border-radius: 50%;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
                    transition: all 0.3s ease;
                    border: 1px solid #e2e8f0;
                }
                
                .social-links a:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
                }
                
                /* Divider */
                .divider {
                    height: 1px;
                    background: linear-gradient(to right, transparent, #e2e8f0, transparent);
                    margin: 32px 0;
                }
                
                /* Enhanced responsive design */
                @media only screen and (max-width: 600px) {
                    .email-container {
                        margin: 15px;
                        border-radius: 12px;
                        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
                    }
                    
                    .email-content {
                        padding: 30px 20px;
                    }
                    
                    .email-header {
                        padding: 30px 20px 25px;
                    }
                    
                    .email-header h1 {
                        font-size: 26px;
                    }
                    
                    .email-header .subtitle {
                        font-size: 16px;
                    }
                    
                    .code-display {
                        font-size: 24px;
                        letter-spacing: 4px;
                        padding: 20px 15px;
                    }
                    
                    .btn {
                        display: block;
                        text-align: center;
                        margin: 20px 0;
                        padding: 14px 24px;
                    }
                    
                    .email-content h2 {
                        font-size: 24px;
                    }
                    
                    .alert {
                        padding: 16px 20px;
                    }
                }
                
                @media only screen and (max-width: 480px) {
                    .email-container {
                        margin: 10px;
                        border-radius: 8px;
                    }
                    
                    .email-content {
                        padding: 24px 16px;
                    }
                    
                    .email-header {
                        padding: 24px 16px 20px;
                    }
                    
                    .email-header h1 {
                        font-size: 22px;
                    }
                    
                    .code-display {
                        font-size: 20px;
                        letter-spacing: 2px;
                        padding: 16px 12px;
                    }
                }
                
                /* Enhanced dark mode support */
                @media (prefers-color-scheme: dark) {
                    body {
                        background-color: #1a202c;
                    }
                    
                    .email-container {
                        background-color: #2d3748;
                        border-color: #4a5568;
                        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2);
                    }
                    
                    .email-content {
                        background-color: #2d3748;
                        color: #e2e8f0;
                    }
                    
                    .email-content p {
                        color: #cbd5e0;
                    }
                    
                    .email-content h2,
                    .email-content h3 {
                        color: #f7fafc;
                    }
                    
                    .email-content li {
                        color: #cbd5e0;
                    }
                    
                    .code-display {
                        background: linear-gradient(135deg, #4a5568 0%, #2d3748 100%);
                        border-color: #718096;
                        color: #f7fafc;
                    }
                    
                    .code-display::before {
                        background: #2d3748;
                        color: #a0aec0;
                        border-color: #718096;
                    }
                    
                    .token-display {
                        background: linear-gradient(135deg, #4a5568 0%, #2d3748 100%);
                        border-color: #718096;
                        color: #e2e8f0;
                    }
                    
                    .email-footer {
                        background: linear-gradient(135deg, #2d3748 0%, #1a202c 100%);
                        border-color: #4a5568;
                    }
                    
                    .email-footer p {
                        color: #a0aec0;
                    }
                    
                    .social-links a {
                        background: #4a5568;
                        border-color: #718096;
                    }
                    
                    .alert-info {
                        background: linear-gradient(135deg, #2c5282 0%, #2a4365 100%);
                        border-color: #3182ce;
                        color: #bee3f8;
                    }
                    
                    .alert-warning {
                        background: linear-gradient(135deg, #975a16 0%, #744210 100%);
                        border-color: #d69e2e;
                        color: #faf089;
                    }
                    
                    .alert-success {
                        background: linear-gradient(135deg, #276749 0%, #22543d 100%);
                        border-color: #38a169;
                        color: #9ae6b4;
                    }
                    
                    .alert-error {
                        background: linear-gradient(135deg, #9b2c2c 0%, #742a2a 100%);
                        border-color: #e53e3e;
                        color: #feb2b2;
                    }
                }
                
                /* Print styles */
                @media print {
                    .email-container {
                        box-shadow: none;
                        border: 1px solid #e2e8f0;
                    }
                    
                    .btn {
                        background: ${headerColor} !important;
                        color: #ffffff !important;
                    }
                }
                
                /* High contrast mode support */
                @media (prefers-contrast: high) {
                    .email-container {
                        border: 2px solid #000000;
                    }
                    
                    .btn {
                        border: 2px solid #000000;
                    }
                    
                    .alert {
                        border-width: 2px;
                    }
                }
                
                /* Reduced motion support */
                @media (prefers-reduced-motion: reduce) {
                    .btn,
                    .social-links a {
                        transition: none;
                    }
                    
                    .btn:hover {
                        transform: none;
                    }
                    
                    .social-links a:hover {
                        transform: none;
                    }
                }
            </style>
        </head>
        <body class="no-auto-scale">
            <div role="article" aria-roledescription="email" lang="vi" style="outline:0" tabindex="-1">
                <div class="email-container">
                    ${content}
                    <div class="email-footer" role="contentinfo">
                        <div class="divider"></div>
                        <p>&copy; 2025 FreelanceIT. All rights reserved.</p>
                        <p>
                            <a href="#" aria-label="Chính sách bảo mật">Chính sách bảo mật</a> | 
                            <a href="#" aria-label="Điều khoản dịch vụ">Điều khoản dịch vụ</a> | 
                            <a href="#" aria-label="Liên hệ hỗ trợ">Liên hệ hỗ trợ</a>
                        </p>
                        <p class="footer-brand">FreelanceIT - Nền tảng kết nối khách hàng và freelance ITer</p>
                    </div>
                </div>
            </div>
        </body>
        </html>
    `;
};

// Enhanced helper function to adjust color brightness with better color manipulation
const adjustBrightness = (color: string, percent: number): string => {
    // Enhanced color adjustment with support for hex, rgb, and named colors
    const colorMap: { [key: string]: { lighter: string; darker: string } } = {
        '#007bff': { lighter: '#3395ff', darker: '#0056b3' },
        '#28a745': { lighter: '#51c46e', darker: '#1e7e34' },
        '#dc3545': { lighter: '#e55a6a', darker: '#b02a37' },
        '#17a2b8': { lighter: '#4cb3c7', darker: '#117a8b' },
        '#6f42c1': { lighter: '#8c5bd4', darker: '#59359a' },
        '#e83e8c': { lighter: '#ec5aa0', darker: '#d91a72' },
        '#6c757d': { lighter: '#adb5bd', darker: '#495057' },
        '#343a40': { lighter: '#6c757d', darker: '#212529' },
        '#fd7e14': { lighter: '#ff922b', darker: '#e8590c' },
        '#20c997': { lighter: '#40e0d0', darker: '#198754' },
        '#0dcaf0': { lighter: '#6edff6', darker: '#0aa2c0' }
    };
    
    // If we have a predefined mapping, use it
    if (colorMap[color]) {
        return percent > 0 ? colorMap[color].lighter : colorMap[color].darker;
    }
    
    // For hex colors, try to calculate adjustment
    if (color.startsWith('#')) {
        try {
            const hex = color.replace('#', '');
            const r = parseInt(hex.substr(0, 2), 16);
            const g = parseInt(hex.substr(2, 2), 16);
            const b = parseInt(hex.substr(4, 2), 16);
            
            const factor = percent > 0 ? (100 + Math.abs(percent)) / 100 : (100 - Math.abs(percent)) / 100;
            
            const newR = Math.min(255, Math.max(0, Math.round(r * factor)));
            const newG = Math.min(255, Math.max(0, Math.round(g * factor)));
            const newB = Math.min(255, Math.max(0, Math.round(b * factor)));
            
            return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
        } catch (e) {
            // Fallback to original color if calculation fails
            return color;
        }
    }
    
    // Fallback for any other color format
    return color;
};

// Utility functions for creating email components
export const createAlert = (type: 'info' | 'warning' | 'success' | 'error', title: string, message: string): string => {
    return `
        <div class="alert alert-${type}">
            <strong>${title}</strong><br>
            ${message}
        </div>
    `;
};

export const createButton = (text: string, url: string, type: 'primary' | 'secondary' = 'primary'): string => {
    const className = type === 'secondary' ? 'btn btn-secondary' : 'btn';
    return `
        <p style="text-align: center;">
            <a href="${url}" class="${className}" role="button" aria-label="${text}">${text}</a>
        </p>
    `;
};

export const createCodeDisplay = (code: string, label?: string): string => {
    return `
        <div class="code-display" role="img" aria-label="${label || 'Verification code'}: ${code}">
            ${code}
        </div>
    `;
};

export const createDivider = (): string => {
    return '<div class="divider" role="separator" aria-hidden="true"></div>';
};

// Welcome Email Template
export const getWelcomeEmailTemplate = (data: WelcomeEmailData): { subject: string; html: string; text: string } => {
    const { userName, loginUrl } = data;
    
    const content = `
        <div class="email-header">
            <h1>🎉 Chào mừng đến với FreelanceIT!</h1>
            <div class="subtitle">Chúng tôi rất vui mừng được chào đón bạn</div>
        </div>
        <div class="email-content">
            <h2>Xin chào ${userName}!</h2>
            <p>Chào mừng bạn đến với FreelanceIT! Chúng tôi rất vui mừng được kết nối bạn với cộng đồng khách hàng và freelance ITer.</p>
            
            <div class="alert alert-success">
                <strong>Tài khoản đã được tạo thành công!</strong><br>
                Tài khoản của bạn đã được thiết lập và bạn có thể bắt đầu khám phá nền tảng của chúng tôi.
            </div>
            
            <p>Đây là những gì bạn có thể làm tiếp theo:</p>
            <ul style="margin: 16px 0; padding-left: 20px;">
                <li>Hoàn thiện thiết lập hồ sơ của bạn</li>
                <li>Khám phá các tính năng và công cụ của chúng tôi</li>
                <li>Kết nối với khách hàng hoặc freelancer khác</li>
                <li>Bắt đầu dự án đầu tiên của bạn</li>
            </ul>
            
            ${loginUrl ? `<p style="text-align: center;"><a href="${loginUrl}" class="btn">Bắt đầu ngay</a></p>` : ''}
            
            <p>Nếu bạn có bất kỳ câu hỏi nào hoặc cần hỗ trợ, đội ngũ hỗ trợ của chúng tôi luôn sẵn sàng giúp đỡ. Hãy liên hệ với chúng tôi bất cứ lúc nào!</p>
            
            <p>Chào mừng bạn!<br>
            <strong>Đội ngũ FreelanceIT</strong></p>
        </div>
    `;
    
    const html = getBaseTemplate('Chào mừng đến với FreelanceIT', '#28a745', content);
    
    const text = `
        Chào mừng đến với FreelanceIT!
        
        Xin chào ${userName},
        
        Chào mừng bạn đến với FreelanceIT! Chúng tôi rất vui mừng được kết nối bạn với cộng đồng khách hàng và freelance ITer.
        
        Tài khoản của bạn đã được tạo thành công và bạn có thể bắt đầu khám phá nền tảng của chúng tôi.
        
        Đây là những gì bạn có thể làm tiếp theo:
        - Hoàn thiện thiết lập hồ sơ của bạn
        - Khám phá các tính năng và công cụ của chúng tôi
        - Kết nối với khách hàng hoặc freelancer khác
        - Bắt đầu dự án đầu tiên của bạn
        
        ${loginUrl ? `Bắt đầu ngay: ${loginUrl}` : ''}
        
        Nếu bạn có bất kỳ câu hỏi nào hoặc cần hỗ trợ, đội ngũ hỗ trợ của chúng tôi luôn sẵn sàng giúp đỡ.
        
        Chào mừng bạn!
        Đội ngũ FreelanceIT
    `;
    
    return {
        subject: '🎉 Chào mừng đến với FreelanceIT - Hãy bắt đầu!',
        html,
        text
    };
};

// Verification Email Template
export const getVerificationEmailTemplate = (data: VerificationEmailData): { subject: string; html: string; text: string } => {
    const { userName, verificationCode, expirationTime } = data;
    
    const content = `
        <div class="email-header">
            <h1>Xác thực Email</h1>
            <div class="subtitle">Xác thực địa chỉ email để tiếp tục</div>
        </div>
        <div class="email-content">
            <h2>Xin chào ${userName}!</h2>
            <p>Cảm ơn bạn đã đăng ký! Vui lòng sử dụng mã xác thực bên dưới để xác thực địa chỉ email của bạn:</p>
            
${createCodeDisplay(verificationCode, 'Mã xác thực email')}
            
            ${expirationTime ? createAlert('warning', '⏰ Khẩn cấp:', `Mã xác thực này sẽ hết hạn trong <strong>${expirationTime}</strong>.`) : ''}
            
            <p>Chỉ cần sao chép và dán mã này vào trường xác thực trên trang web của chúng tôi.</p>
            
            <div class="alert alert-info">
                <strong>Lưu ý bảo mật:</strong><br>
                Nếu bạn không yêu cầu xác thực này, vui lòng bỏ qua email này. Tài khoản của bạn vẫn an toàn.
            </div>
            
            <p>Cần hỗ trợ? Liên hệ với đội ngũ hỗ trợ của chúng tôi - chúng tôi luôn sẵn sàng giúp đỡ!</p>
            
            <p>Trân trọng,<br>
            <strong>Đội ngũ FreelanceIT</strong></p>
        </div>
    `;
    
    const html = getBaseTemplate('Xác thực Email', '#17a2b8', content);
    
    const text = `
        Xác thực Email
        
        Xin chào ${userName},
        
        Cảm ơn bạn đã đăng ký! Vui lòng sử dụng mã xác thực bên dưới để xác thực địa chỉ email của bạn:
        
        Mã xác thực: ${verificationCode}
        
        ${expirationTime ? `⏰ Mã này sẽ hết hạn trong ${expirationTime}.` : ''}
        
        Chỉ cần sao chép và dán mã này vào trường xác thực trên trang web của chúng tôi.
        
        Nếu bạn không yêu cầu xác thực này, vui lòng bỏ qua email này. Tài khoản của bạn vẫn an toàn.
        
        Cần hỗ trợ? Liên hệ với đội ngũ hỗ trợ của chúng tôi - chúng tôi luôn sẵn sàng giúp đỡ!
        
        Trân trọng,
        Đội ngũ FreelanceIT
    `;
    
    return {
        subject: '🔐 Xác thực địa chỉ Email - FreelanceIT',
        html,
        text
    };
};

// Password Reset Email Template
export const getPasswordResetEmailTemplate = (data: PasswordResetEmailData): { subject: string; html: string; text: string } => {
    const { userName, resetToken, resetUrl, expirationTime } = data;
    
    const content = `
        <div class="email-header">
            <h1>🔑 Đặt lại Mật khẩu</h1>
            <div class="subtitle">Đặt lại mật khẩu một cách an toàn</div>
        </div>
        <div class="email-content">
            <h2>Xin chào ${userName}!</h2>
            <p>Chúng tôi đã nhận được yêu cầu đặt lại mật khẩu của bạn. Đừng lo lắng - chúng tôi sẽ hỗ trợ bạn!</p>
            
            <p style="text-align: center;">
                <a href="${resetUrl}" class="btn">Đặt lại Mật khẩu</a>
            </p>
            
            <p>Hoặc sao chép và dán liên kết này vào trình duyệt của bạn:</p>
            <div class="token-display">${resetUrl}</div>
            
            <p><strong>Mã đặt lại:</strong> <code>${resetToken}</code></p>
            
            ${expirationTime ? `
                <div class="alert alert-warning">
                    <strong>⏰ Quan trọng:</strong><br>
                    Liên kết đặt lại này sẽ hết hạn trong <strong>${expirationTime}</strong> để đảm bảo an toàn cho bạn.
                </div>
            ` : ''}
            
            <div class="alert alert-info">
                <strong>🛡️ Thông báo Bảo mật:</strong><br>
                Nếu bạn không yêu cầu đặt lại mật khẩu này, vui lòng bỏ qua email này. Mật khẩu của bạn sẽ không thay đổi.
                Hãy cân nhắc thay đổi mật khẩu nếu bạn nghi ngờ có truy cập trái phép.
            </div>
            
            <p>Sau khi nhấp vào liên kết, bạn sẽ có thể tạo mật khẩu mới và an toàn cho tài khoản của mình.</p>
            
            <p>Hãy giữ an toàn!<br>
            <strong>Đội ngũ FreelanceIT</strong></p>
        </div>
    `;
    
    const html = getBaseTemplate('Yêu cầu Đặt lại Mật khẩu', '#dc3545', content);
    
    const text = `
        Yêu cầu Đặt lại Mật khẩu
        
        Xin chào ${userName},
        
        Chúng tôi đã nhận được yêu cầu đặt lại mật khẩu của bạn. Đừng lo lắng - chúng tôi sẽ hỗ trợ bạn!
        
        Đặt lại mật khẩu của bạn bằng liên kết này: ${resetUrl}
        
        Mã đặt lại: ${resetToken}
        
        ${expirationTime ? `⏰ Liên kết đặt lại này sẽ hết hạn trong ${expirationTime} để đảm bảo an toàn cho bạn.` : ''}
        
        🛡️ Thông báo Bảo mật:
        Nếu bạn không yêu cầu đặt lại mật khẩu này, vui lòng bỏ qua email này. Mật khẩu của bạn sẽ không thay đổi.
        Hãy cân nhắc thay đổi mật khẩu nếu bạn nghi ngờ có truy cập trái phép.
        
        Sau khi nhấp vào liên kết, bạn sẽ có thể tạo mật khẩu mới và an toàn cho tài khoản của mình.
        
        Hãy giữ an toàn!
        Đội ngũ FreelanceIT
    `;
    
    return {
        subject: '🔑 Đặt lại Mật khẩu - FreelanceIT',
        html,
        text
    };
};

// Notification Email Template
export const getNotificationEmailTemplate = (data: NotificationEmailData): { subject: string; html: string; text: string } => {
    const { userName, message, actionUrl, actionText } = data;
    
    const content = `
        <div class="email-header">
            <h1>🔔 Thông báo</h1>
            <div class="subtitle">Cập nhật quan trọng từ FreelanceIT</div>
        </div>
        <div class="email-content">
            <h2>Xin chào ${userName}!</h2>
            
            <div class="alert alert-info">
                ${message}
            </div>
            
            ${actionUrl && actionText ? `
                <p style="text-align: center;">
                    <a href="${actionUrl}" class="btn">${actionText}</a>
                </p>
            ` : ''}
            
            <p>Thông báo này được gửi để giữ bạn cập nhật về những thay đổi quan trọng đối với tài khoản hoặc dịch vụ của chúng tôi.</p>
            
            <p>Nếu bạn có bất kỳ câu hỏi nào về thông báo này, đừng ngần ngại liên hệ với đội ngũ hỗ trợ của chúng tôi.</p>
            
            <p>Cảm ơn bạn đã là một phần của cộng đồng FreelanceIT!</p>
            
            <p>Trân trọng,<br>
            <strong>Đội ngũ FreelanceIT</strong></p>
        </div>
    `;
    
    const html = getBaseTemplate('Thông báo từ FreelanceIT', '#6f42c1', content);
    
    const text = `
        Thông báo từ FreelanceIT
        
        Xin chào ${userName},
        
        ${message}
        
        ${actionUrl && actionText ? `${actionText}: ${actionUrl}` : ''}
        
        Thông báo này được gửi để giữ bạn cập nhật về những thay đổi quan trọng đối với tài khoản hoặc dịch vụ của chúng tôi.
        
        Nếu bạn có bất kỳ câu hỏi nào về thông báo này, đừng ngần ngại liên hệ với đội ngũ hỗ trợ của chúng tôi.
        
        Cảm ơn bạn đã là một phần của cộng đồng FreelanceIT!
        
        Trân trọng,
        Đội ngũ FreelanceIT
    `;
    
    return {
        subject: '🔔 Thông báo từ FreelanceIT',
        html,
        text
    };
};
