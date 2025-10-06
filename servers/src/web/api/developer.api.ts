import { ResponseUtil } from "@/libs/response";
import { DeveloperService } from "@/services/developer.service";
import { Request, Response } from "express";

export class DeveloperApi {

    private readonly developerService: DeveloperService;

    constructor() {
        this.developerService = new DeveloperService();
        this.getDeveloperProfile = this.getDeveloperProfile.bind(this);
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
    
}