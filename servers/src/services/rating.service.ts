import { Rating } from "@/models/rating.model";
import { RatingRepository } from "@/repositories/rating.repo";
import { UserRepository } from "@/repositories/user.repo";
import logger from "@/libs/logger";

export class RatingService {
    private readonly ratingRepository: RatingRepository;
    private readonly userRepository: UserRepository;

    constructor() {
        this.ratingRepository = new RatingRepository();
        this.userRepository = new UserRepository();
    }

    public async createRating(userId: string, data: Omit<Rating, 'id' | 'userId' | 'createdDate' | 'updatedDate'>): Promise<Rating | null> {
        try {
            const user = await this.userRepository.findById(userId);
            if (!user) {
                return null;
            }
            const { stars, comment } = data;
            if (stars < 1 || stars > 5) {
                throw new Error('Stars must be between 1 and 5');
            }
            return await this.ratingRepository.create({
                userId,
                stars,
                comment,
                createdDate: new Date(),
                updatedDate: new Date(),
                id: '' // will be overridden in repository
            } as any);
        } catch (error) {
            logger.error('Error creating rating:', error);
            throw error;
        }
    }

    public async getRatingById(id: string): Promise<Rating | null> {
        try {
            return await this.ratingRepository.findById(id);
        } catch (error) {
            logger.error('Error getting rating by id:', error);
            return null;
        }
    }

    public async getRatingsByUserId(userId: string): Promise<Rating[]> {
        try {
            return await this.ratingRepository.findByUserId(userId);
        } catch (error) {
            logger.error('Error getting ratings by user id:', error);
            return [];
        }
    }

    public async getAllRatings(): Promise<Rating[]> {
        try {
            return await this.ratingRepository.findAll();
        } catch (error) {
            logger.error('Error getting all ratings:', error);
            return [];
        }
    }

    public async getAllRatingsWithUser(): Promise<(Rating & { userFullname?: string })[]> {
        try {
            const ratings = await this.ratingRepository.findAll();
            const results = await Promise.all(ratings.map(async (r) => {
                try {
                    const user = await this.userRepository.findById(r.userId);
                    return { ...r, userFullname: user?.fullname };
                } catch {
                    return { ...r };
                }
            }));
            return results;
        } catch (error) {
            logger.error('Error getting all ratings with user info:', error);
            return [];
        }
    }

    public async updateRating(id: string, userId: string, updateData: Partial<Rating>): Promise<Rating | null> {
        try {
            const existing = await this.ratingRepository.findById(id);
            if (!existing) {
                return null;
            }
            if (existing.userId !== userId) {
                return null;
            }
            if (updateData.stars !== undefined) {
                if (updateData.stars < 1 || updateData.stars > 5) {
                    throw new Error('Stars must be between 1 and 5');
                }
            }
            return await this.ratingRepository.update(id, updateData);
        } catch (error) {
            logger.error('Error updating rating:', error);
            return null;
        }
    }

    public async deleteRating(id: string, userId: string): Promise<boolean> {
        try {
            const existing = await this.ratingRepository.findById(id);
            if (!existing) {
                return false;
            }
            if (existing.userId !== userId) {
                return false;
            }
            return await this.ratingRepository.delete(id);
        } catch (error) {
            logger.error('Error deleting rating:', error);
            return false;
        }
    }
}

