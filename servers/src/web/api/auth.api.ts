

import { AuthService } from '@/services/auth.service';
import { RegisterData } from '@/types/auth.type';
import { ResponseUtil } from '@/libs/response';
import { Request, Response, NextFunction } from 'express';
import logger from '@/libs/logger';
import { Role } from '@/models/user.model';
import { RegisterRequest, VerifyCodeRequest } from '@/types/req/user.req';

export class AuthApi {

    private readonly authService: AuthService = new AuthService();

    constructor() {
        this.authenticate = this.authenticate.bind(this);
        this.refreshToken = this.refreshToken.bind(this);
        this.getProfile = this.getProfile.bind(this);
        this.createAccount = this.createAccount.bind(this);
        this.getAllUsers = this.getAllUsers.bind(this);
        this.getUserByEmail = this.getUserByEmail.bind(this);
        this.updateUser = this.updateUser.bind(this);
        this.deleteUser = this.deleteUser.bind(this);
        this.updateUserStatus = this.updateUserStatus.bind(this);
    }


    public async authenticate(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            const credentials = request.body;
            const authResponse = await this.authService.authenticate(credentials);
            ResponseUtil.success(response, authResponse, 'Đăng nhập thành công', 200);
        }
        catch (error) {
            if (error instanceof Error) {
                ResponseUtil.error(response, 'Email hoặc mật khẩu không hợp lệ', 400);
            }
            else {
                next(error);
            }
        }
    }


    public async refreshToken(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            let { refreshToken } = request.body;
            if (!refreshToken) {
                // Try get header
                refreshToken = request.headers.authorization?.split(' ')[1] ?? null;
            }
            if (!refreshToken) {
                ResponseUtil.error(response, 'Yêu cầu refresh token', 400);
                return;
            }
            const newAccessToken = await this.authService.refreshToken(refreshToken);
            ResponseUtil.success(response, newAccessToken, 'Token đã được làm mới thành công', 200);
        }
        catch (error) {
            if (error instanceof Error) {
                ResponseUtil.error(response, 'Token không hợp lệ hoặc đã hết hạn', 400);
            }
            else {
                next(error);
            }
        }
    }


    public async getProfile(request: Request, response: Response): Promise<void> {
        const accessToken = this.getAccessToken(request);
        if (!accessToken) {
            ResponseUtil.error(response, 'Người dùng chưa được xác thực', 401);
            return;
        }
        ResponseUtil.success(
            response,
            await this.authService.getProfile(accessToken),
            'Lấy thông tin hồ sơ thành công',
            200
        );
    }


    public async createAccount(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            const registerData: RegisterData = request.body;
            const registerResponse = await this.authService.createAccount(registerData);
            logger.info(`Register response: ${JSON.stringify(registerResponse)}`);
            ResponseUtil.success(response, registerResponse, 'Tạo tài khoản thành công', 201);
        }
        catch (error) {
            if (error instanceof Error) {
                if (error.message.includes('Email already exists')) {
                    ResponseUtil.error(response, 'Email đã tồn tại', 400);
                } else if (error.message.includes('error occurred while creating')) {
                    ResponseUtil.error(response, 'Đã xảy ra lỗi khi tạo tài khoản', 400);
                } else {
                    ResponseUtil.error(response, 'Lỗi máy chủ nội bộ', 400);
                }
            }
            else {
                next(error);
            }
        }
    }


    public async register(request: Request, response: Response): Promise<void> {
        try {
            const registerData: RegisterRequest = request.body;
            const registerResponse = await this.authService.register(registerData);
            ResponseUtil.success(response, registerResponse, 'Vui lòng kiểm tra email để lấy mã xác thực', 200);
        }
        catch (error: any) {
            logger.error(error);
            ResponseUtil.error(response, error.message || 'Lỗi máy chủ nội bộ', 400);
        }
    }


    public async verifyCode(request: Request, response: Response): Promise<void> {
        try {
            const verifyCodeData: VerifyCodeRequest = request.body;
            const verifyCodeResponse = await this.authService.verifyCode(verifyCodeData);
            if (!verifyCodeResponse) {
                ResponseUtil.error(response, 'Mã xác thực không hợp lệ hoặc đã hết hạn', 400);
                logger.error('Invalid or expired verification code');
                return;
            }
            else {
                ResponseUtil.success(response, verifyCodeResponse, 'Xác thực thành công', 200);
            }
        }
        catch (error: any) {
            logger.error(error);
            ResponseUtil.error(response, 'Internal Server Error', 400);
        }
    }


    public async getAllUsers(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            const accessToken = this.getAccessToken(request);
            if (!accessToken) {
                ResponseUtil.error(response, 'Người dùng chưa được xác thực', 401);
                return;
            }

            // Verify user is authenticated
            const user = await this.authService.getUserByToken(accessToken);
            if (!user) {
                ResponseUtil.error(response, 'Người dùng không hợp lệ', 401);
                return;
            }

            const users = await this.authService.getAllUsers();
            ResponseUtil.success(response, users, 'Lấy danh sách người dùng thành công', 200);
        }
        catch (error) {
            if (error instanceof Error) {
                ResponseUtil.error(response, error.message, 400);
            }
            else {
                next(error);
            }
        }
    }

    public async getUserByEmail(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            const accessToken = this.getAccessToken(request);
            if (!accessToken) {
                ResponseUtil.error(response, 'Người dùng chưa được xác thực', 401);
                return;
            }

            const { email } = request.body;
            if (!email) {
                ResponseUtil.error(response, 'Email là bắt buộc', 400);
                return;
            }

            const user = await this.authService.getUserByEmail(email);
            if (!user) {
                ResponseUtil.error(response, 'Không tìm thấy người dùng', 404);
                return;
            }

            ResponseUtil.success(response, user, 'Lấy thông tin người dùng thành công', 200);
        }
        catch (error) {
            if (error instanceof Error) {
                ResponseUtil.error(response, error.message, 400);
            }
            else {
                next(error);
            }
        }
    }

    public async updateUser(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            const accessToken = this.getAccessToken(request);
            if (!accessToken) {
                ResponseUtil.error(response, 'Người dùng chưa được xác thực', 401);
                return;
            }

            // Verify user has admin/system role
            const currentUser = await this.authService.getUserByToken(accessToken);
            if (!currentUser || 
                (currentUser.role !== Role.CUSTOMER && currentUser.role !== Role.DEVELOPER && currentUser.role !== Role.SYSTEM)
            ) {
                ResponseUtil.error(response, 'Không đủ quyền truy cập', 403);
                return;
            }

            const { email, ...updateData } = request.body;

            if (!email) {
                ResponseUtil.error(response, 'Email là bắt buộc', 400);
                return;
            }

            // Remove sensitive fields that shouldn't be updated via this endpoint
            delete updateData.id;
            delete updateData.createdDate;
            delete updateData.lastLoginDate;

            const updatedUser = await this.authService.updateUserByEmail(email, updateData);
            if (!updatedUser) {
                ResponseUtil.error(response, 'Không tìm thấy người dùng hoặc cập nhật thất bại', 404);
                return;
            }

            ResponseUtil.success(response, updatedUser, 'Cập nhật người dùng thành công', 200);
        }
        catch (error) {
            if (error instanceof Error) {
                ResponseUtil.error(response, error.message, 400);
            }
            else {
                next(error);
            }
        }
    }

    public async deleteUser(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            const accessToken = this.getAccessToken(request);
            if (!accessToken) {
                ResponseUtil.error(response, 'Người dùng chưa được xác thực', 401);
                return;
            }

            // Verify user has admin/system role
            const currentUser = await this.authService.getUserByToken(accessToken);
            if (!currentUser || 
                (currentUser.role !== Role.CUSTOMER && currentUser.role !== Role.DEVELOPER && currentUser.role !== Role.SYSTEM)
            ) {
                ResponseUtil.error(response, 'Không đủ quyền truy cập', 403);
                return;
            }

            const { email } = request.body;
            if (!email) {
                ResponseUtil.error(response, 'Email là bắt buộc', 400);
                return;
            }

            // Prevent self-deletion
            if (currentUser.email === email) {
                ResponseUtil.error(response, 'Không thể xóa tài khoản của chính mình', 400);
                return;
            }

            const deleted = await this.authService.deleteUserByEmail(email);
            if (!deleted) {
                ResponseUtil.error(response, 'Không tìm thấy người dùng hoặc xóa thất bại', 404);
                return;
            }

            ResponseUtil.success(response, { deleted: true }, 'Xóa người dùng thành công', 200);
        }
        catch (error) {
            if (error instanceof Error) {
                ResponseUtil.error(response, error.message, 400);
            }
            else {
                next(error);
            }
        }
    }

    public async updateUserStatus(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            const accessToken = this.getAccessToken(request);
            if (!accessToken) {
                ResponseUtil.error(response, 'Người dùng chưa được xác thực', 401);
                return;
            }

            // Verify user has admin/system role
            const currentUser = await this.authService.getUserByToken(accessToken);
            if (!currentUser || 
                (currentUser.role !== Role.CUSTOMER && currentUser.role !== Role.DEVELOPER && currentUser.role !== Role.SYSTEM)
            ) {
                ResponseUtil.error(response, 'Không đủ quyền truy cập', 403);
                return;
            }

            const { email, isEnable } = request.body;

            if (!email) {
                ResponseUtil.error(response, 'Email là bắt buộc', 400);
                return;
            }

            if (typeof isEnable !== 'boolean') {
                ResponseUtil.error(response, 'isEnable phải là giá trị boolean', 400);
                return;
            }

            // Prevent self-status change
            if (currentUser.email === email) {
                ResponseUtil.error(response, 'Không thể thay đổi trạng thái của chính mình', 400);
                return;
            }

            const updatedUser = await this.authService.updateUserStatusByEmail(email, isEnable);
            if (!updatedUser) {
                ResponseUtil.error(response, 'Không tìm thấy người dùng hoặc cập nhật thất bại', 404);
                return;
            }

            ResponseUtil.success(response, updatedUser, 'Cập nhật trạng thái người dùng thành công', 200);
        }
        catch (error) {
            if (error instanceof Error) {
                ResponseUtil.error(response, error.message, 400);
            }
            else {
                next(error);
            }
        }
    }

    private getAccessToken(request: Request): string | null {
        return request.headers.authorization?.split(' ')[1] ?? null;
    }

}


