import { ResponseUtil } from "@/libs/response";
import { DeveloperService } from "@/services/developer.service";
import { Request, Response } from "express";
import { uploadProjectImage } from "@/web/middlewares/multer.middleware";

export class DeveloperApi {

    private readonly developerService: DeveloperService;

    constructor() {
        this.developerService = new DeveloperService();
        this.getDeveloperProfile = this.getDeveloperProfile.bind(this);
        this.updateDeveloperProfile = this.updateDeveloperProfile.bind(this);
        this.updateUserProfile = this.updateUserProfile.bind(this);
        this.updateUserAvatar = this.updateUserAvatar.bind(this);
    }

    public async getDeveloperProfile(request: Request, response: Response): Promise<void> {
        const { userId } = request.params;
        if (!userId) {
            ResponseUtil.error(response, 'Khongo', 400);
            return;
        }
        const developerProfile = await this.developerService.getDeveloperProfile(userId);
        if (!developerProfile) {
            ResponseUtil.error(response, 'Không tìm thấy developer profile', 404);
            return;
        }
        ResponseUtil.success(response, developerProfile, 'Lấy developer profile thành công', 200);
    }
    
    public async updateUserProfile(request: Request, response: Response): Promise<void> {
        const { userId } = request.params;
        const userData = request.body;
        const updatedProfile = await this.developerService.updateUserProfile(userId, userData);
        if (!updatedProfile) {
            ResponseUtil.error(response, 'Cập nhật thông tin cá nhân thất bại', 400);
            return;
        }
        ResponseUtil.success(response, updatedProfile, 'Cập nhật thông tin cá nhân thành công', 200);
    }
    
    public async updateUserAvatar(request: Request, response: Response): Promise<void> {
        const { userId } = request.params;
        if (!userId) {
            ResponseUtil.error(response, 'User ID is required', 400);
            return;
        }

        if (!request.file) {
            ResponseUtil.error(response, 'Avatar file is required', 400);
            return;
        }

        const { buffer, mimetype } = request.file;
        const updatedProfile = await this.developerService.updateUserAvatar(userId, buffer, mimetype);
        
        if (!updatedProfile) {
            ResponseUtil.error(response, 'Cập nhật avatar thất bại', 400);
            return;
        }
        
        ResponseUtil.success(response, updatedProfile, 'Cập nhật avatar thành công', 200);
    }
    
    public async updateDeveloperProfile(request: Request, response: Response): Promise<void> {
        const { userId } = request.params;
        const developerProfile = request.body;
        const updatedDeveloperProfile = await this.developerService.updateDeveloperProfile(userId, developerProfile);
        if (!updatedDeveloperProfile) {
            ResponseUtil.error(response, 'Cập nhật developer profile thất bại', 400);
            return;
        }
        ResponseUtil.success(response, updatedDeveloperProfile, 'Cập nhật developer profile thành công', 200);
    }
}