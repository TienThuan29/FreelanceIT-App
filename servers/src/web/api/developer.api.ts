import { ResponseUtil } from "@/libs/response";
import { DeveloperService } from "@/services/developer.service";
import { Request, Response } from "express";
import { uploadProjectImage } from "@/web/middlewares/multer.middleware";
import { Skill } from "@/models/user.model";

export class DeveloperApi {

    private readonly developerService: DeveloperService;

    constructor() {
        this.developerService = new DeveloperService();
        this.getDeveloperProfile = this.getDeveloperProfile.bind(this);
        this.getDevelopersByPage = this.getDevelopersByPage.bind(this);
        this.updateDeveloperProfile = this.updateDeveloperProfile.bind(this);
        this.updateUserProfile = this.updateUserProfile.bind(this);
        this.updateUserAvatar = this.updateUserAvatar.bind(this);
        this.addSkill = this.addSkill.bind(this);
        this.updateSkill = this.updateSkill.bind(this);
        this.removeSkill = this.removeSkill.bind(this);
        this.getSkills = this.getSkills.bind(this);
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

    public async getDevelopersByPage(request: Request, response: Response): Promise<void> {
        try {
            const page = parseInt(request.query.page as string) || 1;
            const pageSize = parseInt(request.query.pageSize as string) || 10;

            // Validate pagination parameters
            if (page < 1) {
                ResponseUtil.error(response, 'Page number must be greater than 0', 400);
                return;
            }

            if (pageSize < 1 || pageSize > 100) {
                ResponseUtil.error(response, 'Page size must be between 1 and 100', 400);
                return;
            }

            const result = await this.developerService.getDevelopersByPage(page, pageSize);
            
            ResponseUtil.success(response, {
                developers: result.developers,
                pagination: {
                    page,
                    pageSize,
                    totalReturned: result.developers.length,
                    totalAvailable: result.totalAvailable
                }
            }, 'Lấy danh sách developers thành công', 200);
        } catch (error) {
            console.error('Error in getDevelopersByPage API:', error);
            ResponseUtil.error(response, 'Lỗi khi lấy danh sách developers', 500);
        }
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

    // Skill management endpoints
    public async addSkill(request: Request, response: Response): Promise<void> {
        const { userId } = request.params;
        const skill: Skill = request.body;

        if (!userId) {
            ResponseUtil.error(response, 'User ID is required', 400);
            return;
        }

        if (!skill.name || !skill.proficiency || !skill.yearsOfExperience) {
            ResponseUtil.error(response, 'Skill name, proficiency, and years of experience are required', 400);
            return;
        }

        const updatedProfile = await this.developerService.addSkill(userId, skill);
        if (!updatedProfile) {
            ResponseUtil.error(response, 'Thêm skill thất bại', 400);
            return;
        }

        ResponseUtil.success(response, updatedProfile, 'Thêm skill thành công', 200);
    }

    public async updateSkill(request: Request, response: Response): Promise<void> {
        const { userId, skillId } = request.params;
        const updatedSkill: Partial<Skill> = request.body;

        if (!userId || !skillId) {
            ResponseUtil.error(response, 'User ID and Skill ID are required', 400);
            return;
        }

        const updatedProfile = await this.developerService.updateSkill(userId, skillId, updatedSkill);
        if (!updatedProfile) {
            ResponseUtil.error(response, 'Cập nhật skill thất bại', 400);
            return;
        }

        ResponseUtil.success(response, updatedProfile, 'Cập nhật skill thành công', 200);
    }

    public async removeSkill(request: Request, response: Response): Promise<void> {
        const { userId, skillId } = request.params;

        if (!userId || !skillId) {
            ResponseUtil.error(response, 'User ID and Skill ID are required', 400);
            return;
        }

        const updatedProfile = await this.developerService.removeSkill(userId, skillId);
        if (!updatedProfile) {
            ResponseUtil.error(response, 'Xóa skill thất bại', 400);
            return;
        }

        ResponseUtil.success(response, updatedProfile, 'Xóa skill thành công', 200);
    }

    public async getSkills(request: Request, response: Response): Promise<void> {
        const { userId } = request.params;

        if (!userId) {
            ResponseUtil.error(response, 'User ID is required', 400);
            return;
        }

        const skills = await this.developerService.getSkills(userId);
        ResponseUtil.success(response, skills, 'Lấy danh sách skills thành công', 200);
    }
}