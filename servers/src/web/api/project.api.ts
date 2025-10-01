import logger from "@/libs/logger";
import { ResponseUtil } from "@/libs/response";
import { AuthService } from "@/services/auth.service";
import { ProjectService } from "@/services/project.service";
import { AddingUserToProjectRequest, ProjectCreateRequest } from "@/types/req/project.req";
import { Request, Response } from "express";

export class ProjectApi {

    private readonly projectService: ProjectService;
    private readonly authService: AuthService;

    constructor() {
        this.projectService = new ProjectService();
        this.authService = new AuthService();
        this.createProject = this.createProject.bind(this);
        this.addUserToProject = this.addUserToProject.bind(this);
        this.getProjectByUserId = this.getProjectByUserId.bind(this);
        this.getAccessToken = this.getAccessToken.bind(this);
    }


    public async getProjectByUserId(request: Request, response: Response) {
        try {
            const currentUser = await this.authService.getUserByToken(this.getAccessToken(request));
            if (!currentUser) {
                ResponseUtil.error(response, 'User not found', 404);
                return;
            }
            const projects = await this.projectService.getProjectByUserId(currentUser.id);
            ResponseUtil.success(response, projects, 'Projects fetched successfully', 200);
        }
        catch (error) {
            logger.error(error);
            ResponseUtil.error(response, error instanceof Error ? error.message : 'Internal Server Error', 400);
        }
    }


    public async createProject(request: Request, response: Response) {
        try {
            const currentUser = await this.authService.getUserByToken(this.getAccessToken(request));
            if (!currentUser) {
                ResponseUtil.error(response, 'User not found', 404);
                return;
            }

            // Extract form data fields
            const { title, description, size, userEmails } = request.body;
            
            // Parse userEmails if it's a JSON string, otherwise use as array
            let parsedUserEmails: string[] = [];
            if (userEmails) {
                try {
                    parsedUserEmails = typeof userEmails === 'string' ? JSON.parse(userEmails) : userEmails;
                } catch (error) {
                    // If parsing fails, treat as single email or empty array
                    parsedUserEmails = typeof userEmails === 'string' ? [userEmails] : [];
                }
            }

            // Get uploaded file buffer (if any)
            const projectImageBuffer = (request as any).file?.buffer;

            // Create ProjectCreateRequest object
            const projectCreateRequest: ProjectCreateRequest = {
                title: title as string,
                description: description as string,
                size: parseInt(size as string, 10),
                userEmails: parsedUserEmails,
                projectImage: projectImageBuffer
            };

            const project = await this.projectService.createProject(projectCreateRequest, currentUser.id);
            ResponseUtil.success(response, project, 'Project created successfully', 201);
        }
        catch (error) {
            logger.error(error);
            ResponseUtil.error(response, error instanceof Error ? error.message : 'Internal Server Error', 400);
        }
    }


    public async addUserToProject(request: Request, response: Response) {
        try {
            const actionUser = await this.authService.getUserByToken(this.getAccessToken(request));
            if (!actionUser) {
                ResponseUtil.error(response, 'User not found', 404);
                return;
            }
            const addingUserRequest: AddingUserToProjectRequest = request.body as AddingUserToProjectRequest;
            const project = await this.projectService.addUserToProject(addingUserRequest, actionUser.id);
            ResponseUtil.success(response, project, 'User added to project successfully', 200);
        }
        catch (error) {
            logger.error(error);
            ResponseUtil.error(response, error instanceof Error ? error.message : 'Internal Server Error', 400);
        }
    }


    private getAccessToken(request: Request): string {
        return request.headers.authorization?.split(' ')[1] ?? '';
    }

}