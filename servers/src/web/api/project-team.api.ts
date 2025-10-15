import logger from "@/libs/logger";
import { ResponseUtil } from "@/libs/response";
import { AuthService } from "@/services/auth.service";
import { ProjectTeamService } from "@/services/project-team.service";
import { Request, Response } from "express";

export class ProjectTeamApi {

    private readonly projectTeamService: ProjectTeamService;
    private readonly authService: AuthService;

    constructor() {
        this.projectTeamService = new ProjectTeamService();
        this.authService = new AuthService();

        this.getProjectTeamMembers = this.getProjectTeamMembers.bind(this);
        this.addTeamMember = this.addTeamMember.bind(this);
        this.removeTeamMember = this.removeTeamMember.bind(this);
        this.updateTeamMember = this.updateTeamMember.bind(this);
        this.getTeamMemberById = this.getTeamMemberById.bind(this);
        this.getProjectsByDeveloper = this.getProjectsByDeveloper.bind(this);
        this.getAccessToken = this.getAccessToken.bind(this);
    }

    public async getProjectTeamMembers(request: Request, response: Response) {
        try {
            const currentUser = await this.authService.getUserByToken(this.getAccessToken(request));
            if (!currentUser) {
                ResponseUtil.error(response, 'Không tìm thấy người dùng', 404);
                return;
            }

            const { projectId } = request.params;
            const teamMembers = await this.projectTeamService.getProjectTeamMembers(projectId);
            
            ResponseUtil.success(response, teamMembers, 'Lấy danh sách thành viên dự án thành công', 200);
        } catch (error) {
            logger.error(error);
            ResponseUtil.error(response, error instanceof Error ? error.message : 'Lỗi máy chủ nội bộ', 400);
        }
    }

    public async addTeamMember(request: Request, response: Response) {
        try {
            const currentUser = await this.authService.getUserByToken(this.getAccessToken(request));
            if (!currentUser) {
                ResponseUtil.error(response, 'Không tìm thấy người dùng', 404);
                return;
            }

            const { projectId } = request.params;
            const { developerId, agreedRate, contractUrl } = request.body;

            if (!developerId) {
                ResponseUtil.error(response, 'Developer ID là bắt buộc', 400);
                return;
            }

            const teamMember = await this.projectTeamService.addTeamMember(projectId, developerId, agreedRate, contractUrl);
            if (!teamMember) {
                ResponseUtil.error(response, 'Thêm thành viên vào dự án thất bại', 400);
                return;
            }

            ResponseUtil.success(response, teamMember, 'Thêm thành viên vào dự án thành công', 201);
        } catch (error) {
            logger.error(error);
            ResponseUtil.error(response, error instanceof Error ? error.message : 'Lỗi máy chủ nội bộ', 400);
        }
    }

    public async removeTeamMember(request: Request, response: Response) {
        try {
            const currentUser = await this.authService.getUserByToken(this.getAccessToken(request));
            if (!currentUser) {
                ResponseUtil.error(response, 'Không tìm thấy người dùng', 404);
                return;
            }

            const { projectId, developerId } = request.params;
            const result = await this.projectTeamService.removeTeamMember(projectId, developerId);
            if (!result) {
                ResponseUtil.error(response, 'Xóa thành viên khỏi dự án thất bại', 400);
                return;
            }

            ResponseUtil.success(response, null, 'Xóa thành viên khỏi dự án thành công', 200);
        } catch (error) {
            logger.error(error);
            ResponseUtil.error(response, error instanceof Error ? error.message : 'Lỗi máy chủ nội bộ', 400);
        }
    }

    public async updateTeamMember(request: Request, response: Response) {
        try {
            const currentUser = await this.authService.getUserByToken(this.getAccessToken(request));
            if (!currentUser) {
                ResponseUtil.error(response, 'Không tìm thấy người dùng', 404);
                return;
            }

            const { teamMemberId } = request.params;
            const updates = request.body;

            const teamMember = await this.projectTeamService.updateTeamMember(teamMemberId, updates);
            if (!teamMember) {
                ResponseUtil.error(response, 'Cập nhật thông tin thành viên thất bại', 400);
                return;
            }

            ResponseUtil.success(response, teamMember, 'Cập nhật thông tin thành viên thành công', 200);
        } catch (error) {
            logger.error(error);
            ResponseUtil.error(response, error instanceof Error ? error.message : 'Lỗi máy chủ nội bộ', 400);
        }
    }

    public async getTeamMemberById(request: Request, response: Response) {
        try {
            const currentUser = await this.authService.getUserByToken(this.getAccessToken(request));
            if (!currentUser) {
                ResponseUtil.error(response, 'Không tìm thấy người dùng', 404);
                return;
            }

            const { teamMemberId } = request.params;
            const teamMember = await this.projectTeamService.getTeamMemberById(teamMemberId);
            if (!teamMember) {
                ResponseUtil.error(response, 'Không tìm thấy thành viên dự án', 404);
                return;
            }

            ResponseUtil.success(response, teamMember, 'Lấy thông tin thành viên dự án thành công', 200);
        } catch (error) {
            logger.error(error);
            ResponseUtil.error(response, error instanceof Error ? error.message : 'Lỗi máy chủ nội bộ', 400);
        }
    }

    public async getProjectsByDeveloper(request: Request, response: Response) {
        try {
            const currentUser = await this.authService.getUserByToken(this.getAccessToken(request));
            if (!currentUser) {
                ResponseUtil.error(response, 'Không tìm thấy người dùng', 404);
                return;
            }

            const projects = await this.projectTeamService.getProjectsByDeveloper(currentUser.id);
            
            ResponseUtil.success(response, projects, 'Lấy danh sách dự án của developer thành công', 200);
        } catch (error) {
            logger.error(error);
            ResponseUtil.error(response, error instanceof Error ? error.message : 'Lỗi máy chủ nội bộ', 400);
        }
    }

    private getAccessToken(request: Request): string {
        return request.headers.authorization?.split(' ')[1] ?? '';
    }
}
