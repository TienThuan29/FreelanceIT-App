import logger from '@/libs/logger';
import { ResponseUtil } from '@/libs/response';
import { AuthService } from '@/services/auth.service';
import { PlanningService } from '@/services/planning.service';
import { PlanningPurchaseRequest } from '@/types/req/planning.req';
import { Request, Response } from 'express';

export class PlanningApi {
    private readonly planningService: PlanningService;
    private readonly authService: AuthService;

    constructor() {
        this.planningService = new PlanningService();
        this.authService = new AuthService();

        this.createPlanning = this.createPlanning.bind(this);
        this.getAllPlannings = this.getAllPlannings.bind(this);
        this.getPlanningById = this.getPlanningById.bind(this);
        this.updatePlanning = this.updatePlanning.bind(this);
        this.deletePlanning = this.deletePlanning.bind(this);
        this.purchasePlanning = this.purchasePlanning.bind(this);
        this.getUserPlannings = this.getUserPlannings.bind(this);
        this.getActiveUserPlanning = this.getActiveUserPlanning.bind(this);
        this.confirmPayment = this.confirmPayment.bind(this);
        this.getAccessToken = this.getAccessToken.bind(this);
    }

    // Admin CRUD Operations
    public async createPlanning(request: Request, response: Response) {
        try {
            const currentUser = await this.authService.getUserByToken(this.getAccessToken(request));
            if (!currentUser) {
                ResponseUtil.error(response, 'Không tìm thấy người dùng', 404);
                return;
            }

            if (currentUser.role !== 'ADMIN') {
                ResponseUtil.error(response, 'Chỉ ADMIN mới có thể tạo gói', 403);
                return;
            }

            const planning = await this.planningService.createPlanning({
                name: request.body.name,
                description: request.body.description,
                price: request.body.price,
                dailyLimit: request.body.dailyLimit || 0,
                daysLimit: request.body.daysLimit || 30,
                aiModel: request.body.aiModel || {},
                isDeleted: false
            });

            if (!planning) {
                ResponseUtil.error(response, 'Tạo gói thất bại', 400);
                return;
            }

            ResponseUtil.success(response, planning, 'Tạo gói thành công');
        } catch (error) {
            logger.error('Error creating planning:', error);
            ResponseUtil.error(response, 'Lỗi server', 500);
        }
    }

    public async getAllPlannings(request: Request, response: Response) {
        try {
            const plannings = await this.planningService.getAllPlannings();
            ResponseUtil.success(response, plannings, 'Lấy danh sách gói thành công');
        } catch (error) {
            logger.error('Error getting all plannings:', error);
            ResponseUtil.error(response, 'Lỗi server', 500);
        }
    }

    public async getPlanningById(request: Request, response: Response) {
        try {
            const { id } = request.params;
            const planning = await this.planningService.getPlanningById(id);

            if (!planning) {
                ResponseUtil.error(response, 'Không tìm thấy gói', 404);
                return;
            }

            ResponseUtil.success(response, planning, 'Lấy thông tin gói thành công');
        } catch (error) {
            logger.error('Error getting planning by id:', error);
            ResponseUtil.error(response, 'Lỗi server', 500);
        }
    }

    public async updatePlanning(request: Request, response: Response) {
        try {
            const currentUser = await this.authService.getUserByToken(this.getAccessToken(request));
            if (!currentUser) {
                ResponseUtil.error(response, 'Không tìm thấy người dùng', 404);
                return;
            }

            if (currentUser.role !== 'ADMIN') {
                ResponseUtil.error(response, 'Chỉ ADMIN mới có thể cập nhật gói', 403);
                return;
            }

            const { id } = request.params;
            const existingPlanning = await this.planningService.getPlanningById(id);
            
            if (!existingPlanning) {
                ResponseUtil.error(response, 'Không tìm thấy gói', 404);
                return;
            }

            const updatedPlanning = await this.planningService.updatePlanning({
                ...existingPlanning,
                ...request.body,
                id
            });

            if (!updatedPlanning) {
                ResponseUtil.error(response, 'Cập nhật gói thất bại', 400);
                return;
            }

            ResponseUtil.success(response, updatedPlanning, 'Cập nhật gói thành công');
        } catch (error) {
            logger.error('Error updating planning:', error);
            ResponseUtil.error(response, 'Lỗi server', 500);
        }
    }

    public async deletePlanning(request: Request, response: Response) {
        try {
            const currentUser = await this.authService.getUserByToken(this.getAccessToken(request));
            if (!currentUser) {
                ResponseUtil.error(response, 'Không tìm thấy người dùng', 404);
                return;
            }

            if (currentUser.role !== 'ADMIN') {
                ResponseUtil.error(response, 'Chỉ ADMIN mới có thể xóa gói', 403);
                return;
            }

            const { id } = request.params;
            const success = await this.planningService.deletePlanning(id);

            if (!success) {
                ResponseUtil.error(response, 'Xóa gói thất bại', 400);
                return;
            }

            ResponseUtil.success(response, null, 'Xóa gói thành công');
        } catch (error) {
            logger.error('Error deleting planning:', error);
            ResponseUtil.error(response, 'Lỗi server', 500);
        }
    }

    // User Operations
    public async purchasePlanning(request: Request, response: Response) {
        try {
            const currentUser = await this.authService.getUserByToken(this.getAccessToken(request));
            if (!currentUser) {
                ResponseUtil.error(response, 'Không tìm thấy người dùng', 404);
                return;
            }

            const purchaseRequest: PlanningPurchaseRequest = {
                planningId: request.body.planningId,
                orderId: request.body.orderId,
                price: request.body.price
            };

            const userPlanning = await this.planningService.purchasePlanning(currentUser.id, purchaseRequest);

            if (!userPlanning) {
                ResponseUtil.error(response, 'Mua gói thất bại', 400);
                return;
            }

            ResponseUtil.success(response, userPlanning, 'Mua gói thành công');
        } catch (error: any) {
            logger.error('Error purchasing planning:', error);
            ResponseUtil.error(response, error?.message || 'Lỗi server', 500);
        }
    }

    public async getUserPlannings(request: Request, response: Response) {
        try {
            const currentUser = await this.authService.getUserByToken(this.getAccessToken(request));
            if (!currentUser) {
                ResponseUtil.error(response, 'Không tìm thấy người dùng', 404);
                return;
            }

            const userPlannings = await this.planningService.getUserPlannings(currentUser.id);
            ResponseUtil.success(response, userPlannings, 'Lấy lịch sử gói thành công');
            console.log("1111:", userPlannings);
        } catch (error) {
            logger.error('Error getting user plannings:', error);
            ResponseUtil.error(response, 'Lỗi server', 500);
        }
    }

    public async getActiveUserPlanning(request: Request, response: Response) {
        try {
            const currentUser = await this.authService.getUserByToken(this.getAccessToken(request));
            if (!currentUser) {
                ResponseUtil.error(response, 'Không tìm thấy người dùng', 404);
                return;
            }

            const activePlanning = await this.planningService.getActiveUserPlanning(currentUser.id);
            ResponseUtil.success(response, activePlanning, 'Lấy gói đang hoạt động thành công');
        } catch (error) {
            logger.error('Error getting active user planning:', error);
            ResponseUtil.error(response, 'Lỗi server', 500);
        }
    }

    public async confirmPayment(request: Request, response: Response) {
        try {
            const { orderId } = request.params;

            const userPlanning = await this.planningService.confirmPayment(orderId);

            if (!userPlanning) {
                ResponseUtil.error(response, 'Xác nhận thanh toán thất bại', 400);
                return;
            }

            ResponseUtil.success(response, userPlanning, 'Xác nhận thanh toán thành công');
        } catch (error: any) {
            logger.error('Error confirming payment:', error);
            ResponseUtil.error(response, error?.message || 'Lỗi server', 500);
        }
    }

    private getAccessToken(request: Request): string {
        const authHeader = request.headers.authorization;
        return authHeader ? authHeader.substring(7) : '';
    }
}
