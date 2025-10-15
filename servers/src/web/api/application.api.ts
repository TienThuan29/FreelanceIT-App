import logger from "@/libs/logger";
import { ResponseUtil } from "@/libs/response";
import { AuthService } from "@/services/auth.service";
import { ApplicationService } from "@/services/application.service";
import { ProjectApplication, ApplicationStatus } from "@/models/application.model";
import { Request, Response } from "express";

export class ApplicationApi {

    private readonly applicationService: ApplicationService;
    private readonly authService: AuthService;

    constructor() {
        this.applicationService = new ApplicationService();
        this.authService = new AuthService();

        this.createApplication = this.createApplication.bind(this);
        this.getApplicationsByProject = this.getApplicationsByProject.bind(this);
        this.getApplicationsByDeveloper = this.getApplicationsByDeveloper.bind(this);
        this.getApplicationById = this.getApplicationById.bind(this);
        this.updateApplicationStatus = this.updateApplicationStatus.bind(this);
        this.deleteApplication = this.deleteApplication.bind(this);
        this.checkUserAppliedToProject = this.checkUserAppliedToProject.bind(this);
        this.getAccessToken = this.getAccessToken.bind(this);
    }

    public async createApplication(request: Request, response: Response) {
        try {
            const currentUser = await this.authService.getUserByToken(this.getAccessToken(request));
            if (!currentUser) {
                ResponseUtil.error(response, 'Không tìm thấy người dùng', 404);
                return;
            }

            const applicationData: Partial<ProjectApplication> = {
                projectId: request.body.projectId,
                coverLetter: request.body.coverLetter,
                expectedRate: request.body.expectedRate,
                deliveryTime: request.body.deliveryTime,
                appliedDate: new Date(),
                status: ApplicationStatus.PENDING
            };

            const application = await this.applicationService.createApplication(applicationData, currentUser.id);
            if (!application) {
                ResponseUtil.error(response, 'Tạo đơn ứng tuyển thất bại. Vui lòng kiểm tra lại thông tin hồ sơ.', 400);
                return;
            }

            ResponseUtil.success(response, application, 'Gửi đơn ứng tuyển thành công', 201);
        } catch (error) {
            logger.error(error);
            ResponseUtil.error(response, error instanceof Error ? error.message : 'Lỗi máy chủ nội bộ', 400);
        }
    }

    public async getApplicationsByProject(request: Request, response: Response) {
        try {
            const currentUser = await this.authService.getUserByToken(this.getAccessToken(request));
            if (!currentUser) {
                ResponseUtil.error(response, 'Không tìm thấy người dùng', 404);
                return;
            }

            const { projectId } = request.params;
            const applications = await this.applicationService.getApplicationsByProject(projectId);
            
            ResponseUtil.success(response, applications, 'Lấy danh sách ứng tuyển thành công', 200);
        } catch (error) {
            logger.error(error);
            ResponseUtil.error(response, error instanceof Error ? error.message : 'Lỗi máy chủ nội bộ', 400);
        }
    }

    public async getApplicationsByDeveloper(request: Request, response: Response) {
        try {
            const currentUser = await this.authService.getUserByToken(this.getAccessToken(request));
            if (!currentUser) {
                ResponseUtil.error(response, 'Không tìm thấy người dùng', 404);
                return;
            }

            const applications = await this.applicationService.getApplicationsByDeveloper(currentUser.id);
            
            ResponseUtil.success(response, applications, 'Lấy danh sách ứng tuyển của bạn thành công', 200);
        } catch (error) {
            logger.error(error);
            ResponseUtil.error(response, error instanceof Error ? error.message : 'Lỗi máy chủ nội bộ', 400);
        }
    }

    public async getApplicationById(request: Request, response: Response) {
        try {
            const currentUser = await this.authService.getUserByToken(this.getAccessToken(request));
            if (!currentUser) {
                ResponseUtil.error(response, 'Không tìm thấy người dùng', 404);
                return;
            }

            const { id } = request.params;
            const application = await this.applicationService.getApplicationById(id);
            if (!application) {
                ResponseUtil.error(response, 'Không tìm thấy đơn ứng tuyển', 404);
                return;
            }

            ResponseUtil.success(response, application, 'Lấy thông tin đơn ứng tuyển thành công', 200);
        } catch (error) {
            logger.error(error);
            ResponseUtil.error(response, error instanceof Error ? error.message : 'Lỗi máy chủ nội bộ', 400);
        }
    }

    public async updateApplicationStatus(request: Request, response: Response) {
        try {
            const currentUser = await this.authService.getUserByToken(this.getAccessToken(request));
            if (!currentUser) {
                ResponseUtil.error(response, 'Không tìm thấy người dùng', 404);
                return;
            }

            const { id } = request.params;
            const { status, notes } = request.body;

            if (!Object.values(ApplicationStatus).includes(status)) {
                ResponseUtil.error(response, 'Trạng thái không hợp lệ', 400);
                return;
            }

            const application = await this.applicationService.updateApplicationStatus(id, status, notes);
            if (!application) {
                ResponseUtil.error(response, 'Cập nhật trạng thái đơn ứng tuyển thất bại', 400);
                return;
            }

            ResponseUtil.success(response, application, 'Cập nhật trạng thái đơn ứng tuyển thành công', 200);
        } catch (error) {
            logger.error(error);
            ResponseUtil.error(response, error instanceof Error ? error.message : 'Lỗi máy chủ nội bộ', 400);
        }
    }

    public async deleteApplication(request: Request, response: Response) {
        try {
            const currentUser = await this.authService.getUserByToken(this.getAccessToken(request));
            if (!currentUser) {
                ResponseUtil.error(response, 'Không tìm thấy người dùng', 404);
                return;
            }

            const { id } = request.params;
            const result = await this.applicationService.deleteApplication(id);
            if (!result) {
                ResponseUtil.error(response, 'Xóa đơn ứng tuyển thất bại', 400);
                return;
            }

            ResponseUtil.success(response, null, 'Xóa đơn ứng tuyển thành công', 200);
        } catch (error) {
            logger.error(error);
            ResponseUtil.error(response, error instanceof Error ? error.message : 'Lỗi máy chủ nội bộ', 400);
        }
    }

    public async checkUserAppliedToProject(request: Request, response: Response) {
        try {
            const currentUser = await this.authService.getUserByToken(this.getAccessToken(request));
            if (!currentUser) {
                ResponseUtil.error(response, 'Không tìm thấy người dùng', 404);
                return;
            }

            const { projectId } = request.params;
            const hasApplied = await this.applicationService.hasUserAppliedToProject(projectId, currentUser.id);
            
            ResponseUtil.success(response, { hasApplied }, 'Kiểm tra trạng thái ứng tuyển thành công', 200);
        } catch (error) {
            logger.error(error);
            ResponseUtil.error(response, error instanceof Error ? error.message : 'Lỗi máy chủ nội bộ', 400);
        }
    }

    private getAccessToken(request: Request): string {
        return request.headers.authorization?.split(' ')[1] ?? '';
    }
}
