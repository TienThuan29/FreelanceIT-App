import { ProjectTimeline } from '@/models/project.model';
import { ProjectTimelineRepository } from '@/repositories/project-timeline.repo';
import logger from '@/libs/logger';

export class ProjectTimelineService {
    private readonly projectTimelineRepository: ProjectTimelineRepository;

    constructor() {
        this.projectTimelineRepository = new ProjectTimelineRepository();
    }

    /**
     * Create a new project timeline
     */
    public async createTimeline(
        timelineData: Omit<ProjectTimeline, 'id' | 'meetingUrl' | 'createdDate' | 'updatedDate' | 'isDeleted'>
    ): Promise<ProjectTimeline | null> {
        try {
            const timeline = await this.projectTimelineRepository.create({
                ...timelineData,
                meetingUrl: '',
                isDeleted: false
            });

            logger.info(`Created project timeline: ${timeline?.id}`);
            return timeline;
        } catch (error) {
            logger.error('Error creating project timeline:', error);
            throw error;
        }
    }

    /**
     * Get all timelines for a specific project
     */
    public async getTimelinesByProjectId(projectId: string): Promise<ProjectTimeline[]> {
        return await this.projectTimelineRepository.findByProjectId(projectId);
    }

    /**
     * Get all timelines
     */
    public async getAllTimelines(): Promise<ProjectTimeline[]> {
        return await this.projectTimelineRepository.findAll();
    }

    /**
     * Get timeline by ID
     */
    public async getTimelineById(id: string): Promise<ProjectTimeline | null> {
        return await this.projectTimelineRepository.findById(id);
    }

    /**
     * Update an existing timeline
     */
    public async updateTimeline(
        id: string,
        updateData: Partial<Omit<ProjectTimeline, 'id' | 'createdDate' | 'updatedDate'>>
    ): Promise<ProjectTimeline | null> {
        try {
            const existingTimeline = await this.projectTimelineRepository.findById(id);
            if (!existingTimeline) {
                throw new Error('Timeline not found');
            }

            const updatedTimeline = {
                ...existingTimeline,
                ...updateData
            };

            return await this.projectTimelineRepository.update(updatedTimeline);
        } catch (error) {
            logger.error('Error updating project timeline:', error);
            throw error;
        }
    }

    /**
     * Delete a timeline (soft delete)
     */
    public async deleteTimeline(id: string): Promise<boolean> {
        try {
            const timeline = await this.projectTimelineRepository.findById(id);
            if (!timeline) {
                throw new Error('Timeline not found');
            }

            return await this.projectTimelineRepository.delete(id);
        } catch (error) {
            logger.error('Error deleting project timeline:', error);
            throw error;
        }
    }
}
