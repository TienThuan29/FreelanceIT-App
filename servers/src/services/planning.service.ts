import { Planning, UserPlanning, PlanningPurchaseRequest, UserPlanningWithDetails } from '@/models/planning.model';
import { PlanningRepository, UserPlanningRepository } from '@/repositories/planning.repo';
import { UserRepository } from '@/repositories/user.repo';
import logger from '@/libs/logger';

export class PlanningService {
    private readonly planningRepository: PlanningRepository;
    private readonly userPlanningRepository: UserPlanningRepository;
    private readonly userRepository: UserRepository;

    constructor() {
        this.planningRepository = new PlanningRepository();
        this.userPlanningRepository = new UserPlanningRepository();
        this.userRepository = new UserRepository();
    }

    // Planning CRUD Operations (Admin only)
    public async createPlanning(planning: Omit<Planning, 'id' | 'createdDate' | 'updateDate'>): Promise<Planning | null> {
        return await this.planningRepository.create(planning);
    }

    public async getAllPlannings(): Promise<Planning[]> {
        return await this.planningRepository.findAll();
    }

    public async getPlanningById(id: string): Promise<Planning | null> {
        return await this.planningRepository.findById(id);
    }

    public async updatePlanning(planning: Planning): Promise<Planning | null> {
        return await this.planningRepository.update(planning);
    }

    public async deletePlanning(id: string): Promise<boolean> {
        return await this.planningRepository.delete(id);
    }

    // User Planning Operations
    public async purchasePlanning(userId: string, purchaseRequest: PlanningPurchaseRequest): Promise<UserPlanning | null> {
        try {
            // Validate planning exists
            const planning = await this.planningRepository.findById(purchaseRequest.planningId);
            if (!planning) {
                throw new Error('Planning not found');
            }

            // Check if user exists
            const user = await this.userRepository.findById(userId);
            if (!user) {
                throw new Error('User not found');
            }

            // Deactivate current active planning if exists
            const currentActivePlanning = await this.userPlanningRepository.findActiveByUserId(userId);
            if (currentActivePlanning) {
                currentActivePlanning.isEnable = false;
                await this.userPlanningRepository.update(currentActivePlanning);
            }

            // Create new user planning
            const userPlanning = await this.userPlanningRepository.create({
                userId,
                planningId: planning.id,
                orderId: purchaseRequest.orderId,
                transactionDate: new Date(),
                price: purchaseRequest.price,
                isEnable: true
            });

            return userPlanning;
        } catch (error) {
            logger.error('Error purchasing planning:', error);
            throw error;
        }
    }

    public async getUserPlannings(userId: string): Promise<UserPlanning[]> {
        const userPlannings = await this.userPlanningRepository.findByUserId(userId);

        // Populate planning details khi cần thiết
        const populatedPlannings = await Promise.all(
            userPlannings.map(async (userPlanning) => {
                const planning = await this.planningRepository.findById(userPlanning.planningId);
                return {
                    ...userPlanning,
                    planning: planning  // Chỉ populate khi cần
                };
            })
        );

        return populatedPlannings;
    }

    public async getActiveUserPlanning(userId: string): Promise<UserPlanningWithDetails | null> {
        const activeUserPlanning = await this.userPlanningRepository.findActiveByUserId(userId);
        if (!activeUserPlanning) return null;

        // ✅ Populate planning details
        const planning = await this.planningRepository.findById(activeUserPlanning.planningId);
        return {
            ...activeUserPlanning,
            planning: planning
        } as UserPlanningWithDetails;
    }

    public async confirmPayment(orderId: string): Promise<UserPlanning | null> {
        try {
            const userPlanning = await this.userPlanningRepository.findByOrderId(orderId);
            if (!userPlanning) {
                throw new Error('User planning not found');
            }

            userPlanning.isEnable = true;

            return await this.userPlanningRepository.update(userPlanning);
        } catch (error) {
            logger.error('Error confirming payment:', error);
            throw error;
        }
    }

    public async cancelPayment(orderId: string): Promise<UserPlanning | null> {
        try {
            const userPlanning = await this.userPlanningRepository.findByOrderId(orderId);
            if (!userPlanning) {
                throw new Error('User planning not found');
            }

            userPlanning.isEnable = false;

            return await this.userPlanningRepository.update(userPlanning);
        } catch (error) {
            logger.error('Error canceling payment:', error);
            throw error;
        }
    }
}
