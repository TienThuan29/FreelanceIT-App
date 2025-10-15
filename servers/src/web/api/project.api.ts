import logger from "@/libs/logger";
import { ResponseUtil } from "@/libs/response";
import { AuthService } from "@/services/auth.service";
import { ProjectService } from "@/services/project.service";
import { ProjectCreateRequest, ProjectTypeCreateRequest } from "@/types/req/project.req";
import { Request, Response } from "express";

export class ProjectApi {

    private readonly projectService: ProjectService;
    private readonly authService: AuthService;

    constructor() {
        this.projectService = new ProjectService();
        this.authService = new AuthService();

        this.createProjectType = this.createProjectType.bind(this);
        this.getProjectTypesByUserId = this.getProjectTypesByUserId.bind(this);
        this.getProjectTypeById = this.getProjectTypeById.bind(this);
        this.updateProjectType = this.updateProjectType.bind(this);
        this.deleteProjectType = this.deleteProjectType.bind(this);
        this.createProject = this.createProject.bind(this);
        this.getProjectByUserId = this.getProjectByUserId.bind(this);
        this.getProjectById = this.getProjectById.bind(this);
        this.updateProject = this.updateProject.bind(this);
        this.deleteProject = this.deleteProject.bind(this);
        this.addUserToProject = this.addUserToProject.bind(this);
        this.removeUserFromProject = this.removeUserFromProject.bind(this);
        this.generateImageSignedUrl = this.generateImageSignedUrl.bind(this);
        this.getAllProjects = this.getAllProjects.bind(this);
        this.getAllProjectsPublic = this.getAllProjectsPublic.bind(this);
        this.getProjectByIdPublic = this.getProjectByIdPublic.bind(this);
        this.getAccessToken = this.getAccessToken.bind(this);
    }

    // Project Type Api
    public async createProjectType(request: Request, response: Response) {
        try {
            const currentUser = await this.authService.getUserByToken(this.getAccessToken(request));
            if (!currentUser) {
                ResponseUtil.error(response, 'Không tìm thấy người dùng', 404);
                return;
            }
            
            const projectTypeCreateRequest: ProjectTypeCreateRequest = {
                name: request.body.name,
                createdBy: currentUser.id
            };
            
            const projectType = await this.projectService.createProjectType(projectTypeCreateRequest, currentUser.id);
            if (!projectType) {
                ResponseUtil.error(response, 'Tạo loại dự án thất bại', 400);
                return;
            }
            ResponseUtil.success(response, projectType, 'Tạo loại dự án thành công', 201);
        }
        catch (error) {
            logger.error(error);
            ResponseUtil.error(response, error instanceof Error ? error.message : 'Lỗi máy chủ nội bộ', 400);
        }
    }

    public async getProjectTypesByUserId(request: Request, response: Response) {
        try {
            const currentUser = await this.authService.getUserByToken(this.getAccessToken(request));
            console.log('currentUser', currentUser)
            if (!currentUser) {
                ResponseUtil.error(response, 'Không tìm thấy người dùng', 404);
                return;
            }
            const projectTypes = await this.projectService.getProjectTypesByUserId(currentUser.id);
            ResponseUtil.success(response, projectTypes, 'Lấy danh sách loại dự án thành công', 200);
        }
        catch (error) {
            logger.error(error);
            ResponseUtil.error(response, error instanceof Error ? error.message : 'Lỗi máy chủ nội bộ', 400);
        }
    }

    // Project Api


    public async getProjectByUserId(request: Request, response: Response) {
        try {
            const currentUser = await this.authService.getUserByToken(this.getAccessToken(request));
            if (!currentUser) {
                ResponseUtil.error(response, 'Không tìm thấy người dùng', 404);
                return;
            }
            const projects = await this.projectService.getProjectsByUserId(currentUser.id);
            ResponseUtil.success(response, projects, 'Lấy danh sách dự án thành công', 200);
        }
        catch (error) {
            logger.error(error);
            ResponseUtil.error(response, error instanceof Error ? error.message : 'Lỗi máy chủ nội bộ', 400);
        }
    }


    public async createProject(request: Request, response: Response) {
        try {
            const currentUser = await this.authService.getUserByToken(this.getAccessToken(request));
            if (!currentUser) {
                ResponseUtil.error(response, 'Không tìm thấy người dùng', 404);
                return;
            }
            
            const projectCreateRequest: ProjectCreateRequest = {
                ...request.body,
                customerId: currentUser.id,
                projectImage: request.file?.buffer
            };
            
            const project = await this.projectService.createProject(projectCreateRequest, currentUser.id);
            ResponseUtil.success(response, project, 'Tạo dự án thành công', 201);
        }
        catch (error) {
            logger.error(error);
            ResponseUtil.error(response, error instanceof Error ? error.message : 'Lỗi máy chủ nội bộ', 400);
        }
    }


    public async getProjectTypeById(request: Request, response: Response) {
        try {
            const currentUser = await this.authService.getUserByToken(this.getAccessToken(request));
            if (!currentUser) {
                ResponseUtil.error(response, 'Không tìm thấy người dùng', 404);
                return;
            }
            
            const { id } = request.params;
            const projectType = await this.projectService.getProjectTypeById(id);
            if (!projectType) {
                ResponseUtil.error(response, 'Không tìm thấy loại dự án', 404);
                return;
            }
            ResponseUtil.success(response, projectType, 'Lấy thông tin loại dự án thành công', 200);
        }
        catch (error) {
            logger.error(error);
            ResponseUtil.error(response, error instanceof Error ? error.message : 'Lỗi máy chủ nội bộ', 400);
        }
    }

    public async updateProjectType(request: Request, response: Response) {
        try {
            const currentUser = await this.authService.getUserByToken(this.getAccessToken(request));
            if (!currentUser) {
                ResponseUtil.error(response, 'Không tìm thấy người dùng', 404);
                return;
            }
            
            const { id } = request.params;
            const projectTypeData = {
                ...request.body,
                id,
                image: request.file?.buffer
            };
            
            const projectType = await this.projectService.updateProjectType(projectTypeData);
            if (!projectType) {
                ResponseUtil.error(response, 'Cập nhật loại dự án thất bại', 400);
                return;
            }
            ResponseUtil.success(response, projectType, 'Cập nhật loại dự án thành công', 200);
        }
        catch (error) {
            logger.error(error);
            ResponseUtil.error(response, error instanceof Error ? error.message : 'Lỗi máy chủ nội bộ', 400);
        }
    }

    public async deleteProjectType(request: Request, response: Response) {
        try {
            const currentUser = await this.authService.getUserByToken(this.getAccessToken(request));
            if (!currentUser) {
                ResponseUtil.error(response, 'Không tìm thấy người dùng', 404);
                return;
            }
            
            const { id } = request.params;
            const result = await this.projectService.deleteProjectType(id);
            if (!result) {
                ResponseUtil.error(response, 'Không tìm thấy loại dự án', 404);
                return;
            }
            ResponseUtil.success(response, null, 'Xóa loại dự án thành công', 200);
        }
        catch (error) {
            logger.error(error);
            ResponseUtil.error(response, error instanceof Error ? error.message : 'Lỗi máy chủ nội bộ', 400);
        }
    }

    public async getProjectById(request: Request, response: Response) {
        try {
            const currentUser = await this.authService.getUserByToken(this.getAccessToken(request));
            if (!currentUser) {
                ResponseUtil.error(response, 'Không tìm thấy người dùng', 404);
                return;
            }
            
            const { id } = request.params;
            const project = await this.projectService.getProjectById(id);
            if (!project) {
                ResponseUtil.error(response, 'Không tìm thấy dự án', 404);
                return;
            }
            ResponseUtil.success(response, project, 'Lấy thông tin dự án thành công', 200);
        }
        catch (error) {
            logger.error(error);
            ResponseUtil.error(response, error instanceof Error ? error.message : 'Lỗi máy chủ nội bộ', 400);
        }
    }

    public async updateProject(request: Request, response: Response) {
        try {
            const currentUser = await this.authService.getUserByToken(this.getAccessToken(request));
            if (!currentUser) {
                ResponseUtil.error(response, 'Không tìm thấy người dùng', 404);
                return;
            }
            
            const { id } = request.params;
            const projectData = {
                ...request.body,
                id
            };
            
            const project = await this.projectService.updateProject(projectData, request.file?.buffer);
            if (!project) {
                ResponseUtil.error(response, 'Cập nhật dự án thất bại', 400);
                return;
            }
            ResponseUtil.success(response, project, 'Cập nhật dự án thành công', 200);
        }
        catch (error) {
            logger.error(error);
            ResponseUtil.error(response, error instanceof Error ? error.message : 'Lỗi máy chủ nội bộ', 400);
        }
    }

    public async deleteProject(request: Request, response: Response) {
        try {
            const currentUser = await this.authService.getUserByToken(this.getAccessToken(request));
            if (!currentUser) {
                ResponseUtil.error(response, 'Không tìm thấy người dùng', 404);
                return;
            }
            
            const { id } = request.params;
            const result = await this.projectService.deleteProject(id);
            if (!result) {
                ResponseUtil.error(response, 'Không tìm thấy dự án', 404);
                return;
            }
            ResponseUtil.success(response, null, 'Xóa dự án thành công', 200);
        }
        catch (error) {
            logger.error(error);
            ResponseUtil.error(response, error instanceof Error ? error.message : 'Lỗi máy chủ nội bộ', 400);
        }
    }

    public async addUserToProject(request: Request, response: Response) {
        try {
            const currentUser = await this.authService.getUserByToken(this.getAccessToken(request));
            if (!currentUser) {
                ResponseUtil.error(response, 'Không tìm thấy người dùng', 404);
                return;
            }
            
            const { id: projectId } = request.params;
            const { userId, agreedRate, contractUrl } = request.body;
            
            const project = await this.projectService.addUserToProject(projectId, userId, agreedRate, contractUrl);
            if (!project) {
                ResponseUtil.error(response, 'Thêm người dùng vào dự án thất bại', 400);
                return;
            }
            ResponseUtil.success(response, project, 'Thêm người dùng vào dự án thành công', 200);
        }
        catch (error) {
            logger.error(error);
            ResponseUtil.error(response, error instanceof Error ? error.message : 'Lỗi máy chủ nội bộ', 400);
        }
    }

    public async removeUserFromProject(request: Request, response: Response) {
        try {
            const currentUser = await this.authService.getUserByToken(this.getAccessToken(request));
            if (!currentUser) {
                ResponseUtil.error(response, 'Không tìm thấy người dùng', 404);
                return;
            }
            
            const { id: projectId, userId } = request.params;
            const result = await this.projectService.removeUserFromProject(projectId, userId);
            if (!result) {
                ResponseUtil.error(response, 'Xóa người dùng khỏi dự án thất bại', 400);
                return;
            }
            ResponseUtil.success(response, null, 'Xóa người dùng khỏi dự án thành công', 200);
        }
        catch (error) {
            logger.error(error);
            ResponseUtil.error(response, error instanceof Error ? error.message : 'Lỗi máy chủ nội bộ', 400);
        }
    }

    public async generateImageSignedUrl(request: Request, response: Response) {
        try {
            const currentUser = await this.authService.getUserByToken(this.getAccessToken(request));
            if (!currentUser) {
                ResponseUtil.error(response, 'Không tìm thấy người dùng', 404);
                return;
            }
            
            const { imageKey } = request.body;
            if (!imageKey) {
                ResponseUtil.error(response, 'Thiếu imageKey', 400);
                return;
            }
            
            const signedUrl = await this.projectService.generateImageSignedUrl(imageKey);
            ResponseUtil.success(response, { signedUrl }, 'Tạo signed URL thành công', 200);
        }
        catch (error) {
            logger.error(error);
            ResponseUtil.error(response, error instanceof Error ? error.message : 'Lỗi máy chủ nội bộ', 400);
        }
    }

    public async getAllProjects(request: Request, response: Response) {
        try {
            const currentUser = await this.authService.getUserByToken(this.getAccessToken(request));
            if (!currentUser) {
                ResponseUtil.error(response, 'Không tìm thấy người dùng', 404);
                return;
            }
            
            const projects = await this.projectService.getAllProjects();
            ResponseUtil.success(response, projects, 'Lấy danh sách tất cả dự án thành công', 200);
        }
        catch (error) {
            logger.error(error);
            ResponseUtil.error(response, error instanceof Error ? error.message : 'Lỗi máy chủ nội bộ', 400);
        }
    }

    public async getAllProjectsPublic(request: Request, response: Response) {
        try {
            const projects = await this.projectService.getAllProjects();
            ResponseUtil.success(response, projects, 'Lấy danh sách tất cả dự án thành công', 200);
        }
        catch (error) {
            logger.error(error);
            ResponseUtil.error(response, error instanceof Error ? error.message : 'Lỗi máy chủ nội bộ', 400);
        }
    }

    public async getProjectByIdPublic(request: Request, response: Response) {
        try {
            const { id } = request.params;
            const project = await this.projectService.getProjectById(id);
            if (!project) {
                ResponseUtil.error(response, 'Không tìm thấy dự án', 404);
                return;
            }
            ResponseUtil.success(response, project, 'Lấy thông tin dự án thành công', 200);
        }
        catch (error) {
            logger.error(error);
            ResponseUtil.error(response, error instanceof Error ? error.message : 'Lỗi máy chủ nội bộ', 400);
        }
    }

    private getAccessToken(request: Request): string {
        return request.headers.authorization?.split(' ')[1] ?? '';
    }

}