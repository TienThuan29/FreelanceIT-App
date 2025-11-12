import { Request, Response } from 'express';
import { RatingService } from '@/services/rating.service';
import { AuthService } from '@/services/auth.service';
import { ResponseUtil } from '@/libs/response';
import logger from '@/libs/logger';

export class RatingApi {
    private readonly ratingService: RatingService;
    private readonly authService: AuthService;

    constructor() {
        this.ratingService = new RatingService();
        this.authService = new AuthService();
        this.createRating = this.createRating.bind(this);
        this.getRatingById = this.getRatingById.bind(this);
        this.getMyRatings = this.getMyRatings.bind(this);
        this.getAllRatings = this.getAllRatings.bind(this);
        this.updateRating = this.updateRating.bind(this);
        this.deleteRating = this.deleteRating.bind(this);
    }

    public async createRating(request: Request, response: Response): Promise<void> {
        try {
            const currentUser = await this.authService.getUserByToken(this.getAccessToken(request));
            if (!currentUser) {
                ResponseUtil.error(response, 'User not authenticated', 401);
                return;
            }

            const { stars, comment } = request.body;
            if (stars === undefined) {
                ResponseUtil.error(response, 'Stars is required', 400);
                return;
            }
            const rating = await this.ratingService.createRating(currentUser.id, { stars, comment } as any);
            if (!rating) {
                ResponseUtil.error(response, 'Failed to create rating', 500);
                return;
            }
            ResponseUtil.success(response, rating, 'Rating created successfully');
        } catch (error: any) {
            logger.error('Error creating rating:', error);
            ResponseUtil.error(response, error?.message || 'Failed to create rating', 500);
        }
    }

    public async getRatingById(request: Request, response: Response): Promise<void> {
        try {
            const { id } = request.params;
            if (!id) {
                ResponseUtil.error(response, 'Rating ID is required', 400);
                return;
            }
            const rating = await this.ratingService.getRatingById(id);
            if (!rating) {
                ResponseUtil.error(response, 'Rating not found', 404);
                return;
            }
            ResponseUtil.success(response, rating, 'Rating retrieved successfully');
        } catch (error) {
            logger.error('Error getting rating by id:', error);
            ResponseUtil.error(response, 'Failed to get rating', 500);
        }
    }

    public async getMyRatings(request: Request, response: Response): Promise<void> {
        try {
            const currentUser = await this.authService.getUserByToken(this.getAccessToken(request));
            if (!currentUser) {
                ResponseUtil.error(response, 'User not authenticated', 401);
                return;
            }
            const ratings = await this.ratingService.getRatingsByUserId(currentUser.id);
            ResponseUtil.success(response, ratings, 'Ratings retrieved successfully');
        } catch (error) {
            logger.error('Error getting my ratings:', error);
            ResponseUtil.error(response, 'Failed to get ratings', 500);
        }
    }

    public async getAllRatings(request: Request, response: Response): Promise<void> {
        try {
            const ratings = await this.ratingService.getAllRatingsWithUser();
            ResponseUtil.success(response, ratings, 'Ratings retrieved successfully');
        } catch (error) {
            logger.error('Error getting all ratings:', error);
            ResponseUtil.error(response, 'Failed to get ratings', 500);
        }
    }

    public async updateRating(request: Request, response: Response): Promise<void> {
        try {
            const currentUser = await this.authService.getUserByToken(this.getAccessToken(request));
            if (!currentUser) {
                ResponseUtil.error(response, 'User not authenticated', 401);
                return;
            }

            const { id } = request.params;
            if (!id) {
                ResponseUtil.error(response, 'Rating ID is required', 400);
                return;
            }

            const { stars, comment } = request.body;
            const updateData: any = {};
            if (stars !== undefined) updateData.stars = stars;
            if (comment !== undefined) updateData.comment = comment;

            const rating = await this.ratingService.updateRating(id, currentUser.id, updateData);
            if (!rating) {
                ResponseUtil.error(response, 'Failed to update rating or not found', 404);
                return;
            }
            ResponseUtil.success(response, rating, 'Rating updated successfully');
        } catch (error: any) {
            logger.error('Error updating rating:', error);
            ResponseUtil.error(response, error?.message || 'Failed to update rating', 500);
        }
    }

    public async deleteRating(request: Request, response: Response): Promise<void> {
        try {
            const currentUser = await this.authService.getUserByToken(this.getAccessToken(request));
            if (!currentUser) {
                ResponseUtil.error(response, 'User not authenticated', 401);
                return;
            }
            const { id } = request.params;
            if (!id) {
                ResponseUtil.error(response, 'Rating ID is required', 400);
                return;
            }
            const ok = await this.ratingService.deleteRating(id, currentUser.id);
            if (!ok) {
                ResponseUtil.error(response, 'Failed to delete rating or not found', 404);
                return;
            }
            ResponseUtil.success(response, null, 'Rating deleted successfully');
        } catch (error) {
            logger.error('Error deleting rating:', error);
            ResponseUtil.error(response, 'Failed to delete rating', 500);
        }
    }

    private getAccessToken(request: Request): string {
        const authHeader = request.headers.authorization;
        return authHeader ? authHeader.substring(7) : '';
    }
}

