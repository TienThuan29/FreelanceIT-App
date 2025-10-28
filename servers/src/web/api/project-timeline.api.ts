import { ResponseUtil } from "@/libs/response";
import { ProjectTimelineService } from "@/services/project-timeline.service";
import { Request, Response } from "express";

export class ProjectTimelineApi {
    private readonly projectTimelineService: ProjectTimelineService;

    constructor() {
        this.projectTimelineService = new ProjectTimelineService();
        this.createTimeline = this.createTimeline.bind(this);
        this.getTimelineById = this.getTimelineById.bind(this);
        this.getTimelinesByProjectId = this.getTimelinesByProjectId.bind(this);
        this.getAllTimelines = this.getAllTimelines.bind(this);
        this.updateTimeline = this.updateTimeline.bind(this);
        this.deleteTimeline = this.deleteTimeline.bind(this);
    }

    /**
     * Create a new project timeline
     * POST /api/project-timeline
     */
    public async createTimeline(request: Request, response: Response): Promise<void> {
        try {
            const { projectId, title, description, meetingDate } = request.body;

            // Validate required fields
            if (!projectId || !title || !meetingDate) {
                ResponseUtil.error(response, 'projectId, title, và meetingDate là bắt buộc', 400);
                return;
            }

            // Validate meetingDate is a valid date
            const meetingDateObj = new Date(meetingDate);
            if (isNaN(meetingDateObj.getTime())) {
                ResponseUtil.error(response, 'Định dạng meetingDate không hợp lệ', 400);
                return;
            }

            const timelineData = {
                projectId,
                title,
                description: description || '',
                meetingDate: meetingDateObj
            };

            const timeline = await this.projectTimelineService.createTimeline(timelineData);
            if (!timeline) {
                ResponseUtil.error(response, 'Tạo lịch họp thất bại', 500);
                return;
            }

            ResponseUtil.success(response, timeline, 'Tạo lịch họp thành công', 201);
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            ResponseUtil.error(response, message, 500);
        }
    }

    /**
     * Get timeline by ID
     * GET /api/project-timeline/:id
     */
    public async getTimelineById(request: Request, response: Response): Promise<void> {
        try {
            const { id } = request.params;
            const timeline = await this.projectTimelineService.getTimelineById(id);
            
            if (!timeline) {
                ResponseUtil.error(response, 'Lịch họp không tìm thấy', 404);
                return;
            }

            ResponseUtil.success(response, timeline, 'Lịch họp lấy thành công', 200);
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            ResponseUtil.error(response, message, 500);
        }
    }

    /**
     * Get all timelines for a specific project
     * GET /api/project-timeline/project/:projectId
     */
    public async getTimelinesByProjectId(request: Request, response: Response): Promise<void> {
        try {
            const { projectId } = request.params;
            const timelines = await this.projectTimelineService.getTimelinesByProjectId(projectId);
            
            ResponseUtil.success(response, timelines, 'Lịch họp lấy thành công', 200);
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            ResponseUtil.error(response, message, 500);
        }
    }

    /**
     * Get all timelines
     * GET /api/project-timeline
     */
    public async getAllTimelines(request: Request, response: Response): Promise<void> {
        try {
            const timelines = await this.projectTimelineService.getAllTimelines();
            ResponseUtil.success(response, timelines, 'Lịch họp lấy thành công', 200);
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            ResponseUtil.error(response, message, 500);
        }
    }

    /**
     * Update an existing timeline
     * PUT /api/project-timeline/:id
     */
    public async updateTimeline(request: Request, response: Response): Promise<void> {
        try {
            const { id } = request.params;
            const updateData = request.body;

            // Validate meetingDate if provided
            if (updateData.meetingDate) {
                const meetingDateObj = new Date(updateData.meetingDate);
                if (isNaN(meetingDateObj.getTime())) {
                    ResponseUtil.error(response, 'Invalid meetingDate format', 400);
                    return;
                }
                updateData.meetingDate = meetingDateObj;
            }

            const timeline = await this.projectTimelineService.updateTimeline(id, updateData);
            if (!timeline) {
                ResponseUtil.error(response, 'Lịch họp không tìm thấy hoặc cập nhật thất bại', 404);
                return;
            }

            ResponseUtil.success(response, timeline, 'Cập nhật lịch họp thành công', 200);
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            ResponseUtil.error(response, message, 500);
        }
    }

    /**
     * Delete a timeline (soft delete)
     * DELETE /api/project-timeline/:id
     */
    public async deleteTimeline(request: Request, response: Response): Promise<void> {
        try {
            const { id } = request.params;

            const deleted = await this.projectTimelineService.deleteTimeline(id);
            if (!deleted) {
                ResponseUtil.error(response, 'Xóa lịch họp thất bại', 404);
                return;
            }

            ResponseUtil.success(response, null, 'Xóa lịch họp thành công', 200);
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            ResponseUtil.error(response, message, 500);
        }
    }
}
