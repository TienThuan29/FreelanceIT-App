import { Request, Response } from 'express';
import { AdminStatsService } from '@/services/admin-stats.service';
import { ResponseUtil } from '@/libs/response';
import logger from '@/libs/logger';
import { authenticate } from '@/web/middlewares/auth.middleware';

export class AdminStatsApi {
    private readonly service = new AdminStatsService();

    public getStats = async (_request: Request, response: Response): Promise<void> => {
        try {
            console.log('[AdminStatsApi] getStats called');
            const startTime = Date.now();
            const stats = await this.service.getStats();
            const endTime = Date.now();
            console.log(`[AdminStatsApi] Stats retrieved in ${endTime - startTime}ms`);
            console.log('[AdminStatsApi] Stats data:', {
                hasOrderValueDistribution: !!stats.orderValueDistribution,
                orderValueDistributionLength: stats.orderValueDistribution?.length || 0,
                hasRevenueByPlanning: !!stats.revenueByPlanning,
                revenueByPlanningLength: stats.revenueByPlanning?.length || 0,
                hasRevenueStatsByPlanning: !!stats.revenueStatsByPlanning,
                revenueStatsByPlanningKeys: stats.revenueStatsByPlanning ? Object.keys(stats.revenueStatsByPlanning) : [],
            });
            ResponseUtil.success(response, stats, 'Admin stats retrieved successfully');
        } catch (error) {
            console.error('[AdminStatsApi] Error getting admin stats:', error);
            logger.error('Error getting admin stats:', error);
            ResponseUtil.error(response, 'Failed to get admin stats', 500);
        }
    }

    public getSidebarStats = async (_request: Request, response: Response): Promise<void> => {
        try {
            console.log('[AdminStatsApi] getSidebarStats called');
            const sidebarStats = await this.service.getSidebarStats();
            ResponseUtil.success(response, sidebarStats, 'Sidebar stats retrieved successfully');
        } catch (error) {
            console.error('[AdminStatsApi] Error getting sidebar stats:', error);
            logger.error('Error getting sidebar stats:', error);
            ResponseUtil.error(response, 'Failed to get sidebar stats', 500);
        }
    }
}


