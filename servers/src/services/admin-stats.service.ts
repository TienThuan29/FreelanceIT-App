import { UserRepository } from "@/repositories/user.repo";
import { ProjectRepository } from "@/repositories/project.repo";
import { ProductRepository } from "@/repositories/product.repo";
import { RatingRepository } from "@/repositories/rating.repo";
import { TransactionRepository } from "@/repositories/transaction.repo";
import { UserPlanningRepository, PlanningRepository } from "@/repositories/planning.repo";
import { Role } from "@/models/user.model";
import { TransactionStatus } from "@/models/transaction.model";
import logger from "@/libs/logger";

export type AdminStats = {
    totals: {
        users: number;
        developers: number;
        customers: number;
        projects: number;
        products: number;
        ratings: number;
        transactions: number;
    };
    usersByRole: Record<string, number>;
    projectsByStatus: Record<string, number>;
    productsByStatus: Record<string, number>;
    ratings: {
        average: number;
        distribution: Record<string, number>; // '1'..'5'
    };
    revenueByMonth: { month: string; total: number }[]; // last 12 months, format YYYY-MM
    transactionsByStatus: Record<string, number>;
    newUsersByMonth: { month: string; total: number }[];
    orderValueDistribution: { range: string; count: number }[]; // Histogram bins
    revenueByPlanning: { planningId: string; planningName: string; revenue: number; orders: number; totalSold: number; price: number; forDeveloper: boolean; forCustomer: boolean }[];
    revenueStatsByPlanning: Record<string, { min: number; q1: number; median: number; q3: number; max: number; mean: number }>; // Boxplot stats
};

export class AdminStatsService {
    private readonly userRepository = new UserRepository();
    private readonly projectRepository = new ProjectRepository();
    private readonly productRepository = new ProductRepository();
    private readonly ratingRepository = new RatingRepository();
    private readonly transactionRepository = new TransactionRepository();
    private readonly userPlanningRepository = new UserPlanningRepository();
    private readonly planningRepository = new PlanningRepository();

    public async getStats(): Promise<AdminStats> {
        try {
            console.log('[AdminStatsService] getStats called - starting data fetch');
            const startTime = Date.now();
            
            console.log('[AdminStatsService] Fetching all repositories in parallel...');
            const [usersResult, projectsResult, productsResult, ratingsResult, transactionsResult, userPlanningsResult, planningsResult] = await Promise.allSettled([
                this.userRepository.findAll(),
                this.projectRepository.findAll(),
                this.productRepository.findAll(),
                this.ratingRepository.findAll(),
                this.transactionRepository.findAll(),
                this.getAllUserPlannings(),
                this.planningRepository.findAll()
            ]);
            
            const fetchTime = Date.now() - startTime;
            console.log(`[AdminStatsService] All repositories fetched in ${fetchTime}ms`);

            const users = usersResult.status === 'fulfilled' ? usersResult.value : [];
            const projects = projectsResult.status === 'fulfilled' ? projectsResult.value : [];
            const products = productsResult.status === 'fulfilled' ? productsResult.value : [];
            const ratings = ratingsResult.status === 'fulfilled' ? ratingsResult.value : [];
            const transactions = transactionsResult.status === 'fulfilled' ? transactionsResult.value : [];
            const userPlannings = userPlanningsResult.status === 'fulfilled' ? userPlanningsResult.value : [];
            const plannings = planningsResult.status === 'fulfilled' ? planningsResult.value : [];

            if (usersResult.status === 'rejected') logger.error('Error fetching users:', usersResult.reason);
            if (projectsResult.status === 'rejected') logger.error('Error fetching projects:', projectsResult.reason);
            if (productsResult.status === 'rejected') logger.error('Error fetching products:', productsResult.reason);
            if (ratingsResult.status === 'rejected') logger.error('Error fetching ratings:', ratingsResult.reason);
            if (transactionsResult.status === 'rejected') logger.error('Error fetching transactions:', transactionsResult.reason);
            if (userPlanningsResult.status === 'rejected') logger.error('Error fetching user plannings:', userPlanningsResult.reason);
            if (planningsResult.status === 'rejected') logger.error('Error fetching plannings:', planningsResult.reason);

            const usersByRole: Record<string, number> = {};
            let developers = 0, customers = 0;
            users.forEach(u => {
                usersByRole[u.role] = (usersByRole[u.role] || 0) + 1;
                if (u.role === Role.DEVELOPER) developers++;
                if (u.role === Role.CUSTOMER) customers++;
            });

            const projectsByStatus: Record<string, number> = {};
            projects.forEach(p => {
                const status = (p as any).status || 'UNKNOWN';
                projectsByStatus[status] = (projectsByStatus[status] || 0) + 1;
            });

            const productsByStatus: Record<string, number> = {};
            products.forEach(p => {
                const status = (p as any).status || 'UNKNOWN';
                productsByStatus[status] = (productsByStatus[status] || 0) + 1;
            });

            const distribution: Record<string, number> = { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0 };
            let sum = 0;
            ratings.forEach(r => {
                const s = Math.max(1, Math.min(5, r.stars || 0));
                distribution[String(s)] = (distribution[String(s)] || 0) + 1;
                sum += s;
            });
            const average = ratings.length > 0 ? sum / ratings.length : 0;

            const now = new Date();
            const last12: { month: string; total: number }[] = [];
            for (let i = 11; i >= 0; i--) {
                const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
                const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
                last12.push({ month: key, total: 0 });
            }
            const idxByMonth = new Map(last12.map((e, i) => [e.month, i]));
            transactions.forEach(t => {
                const d = t.createdDate ? new Date(t.createdDate) : new Date();
                const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
                const idx = idxByMonth.get(key);
                if (idx !== undefined && t.status === TransactionStatus.SUCCESS) {
                    last12[idx].total += t.amount || 0;
                }
            });

            const transactionsByStatus: Record<string, number> = {};
            transactions.forEach(t => {
                transactionsByStatus[t.status] = (transactionsByStatus[t.status] || 0) + 1;
            });

            const newUsersByMonth = last12.map(m => ({ ...m, total: 0 }));
            const idxByMonthUsers = new Map(newUsersByMonth.map((e, i) => [e.month, i]));
            users.forEach(u => {
                if (!u.createdDate) return;
                const d = new Date(u.createdDate);
                const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
                const idx = idxByMonthUsers.get(key);
                if (idx !== undefined) {
                    newUsersByMonth[idx].total += 1;
                }
            });

            // Order value distribution (histogram)
            console.log('[AdminStatsService] Processing transactions...');
            const successfulTx = transactions.filter(t => t.status === TransactionStatus.SUCCESS);
            console.log(`[AdminStatsService] Successful transactions: ${successfulTx.length} out of ${transactions.length}`);
            const orderValues = successfulTx.map(t => t.amount || 0).filter(a => a > 0);
            console.log(`[AdminStatsService] Order values for histogram: ${orderValues.length} values`);
            const orderValueDistribution = orderValues.length > 0 ? this.calculateHistogram(orderValues, 10) : [];
            console.log(`[AdminStatsService] Histogram bins: ${orderValueDistribution.length}`);

            // Revenue by planning package - Combine Planning and UserPlanning to count total sold
            console.log('[AdminStatsService] Processing revenue by planning...');
            console.log(`[AdminStatsService] Plannings count: ${plannings.length}`);
            console.log(`[AdminStatsService] UserPlannings count: ${userPlannings.length}`);
            const planningMap = new Map(plannings.map(p => [p.id, p]));
            const revenueByPlanningMap = new Map<string, { revenue: number; orders: number; totalSold: number }>();
            
            // Ensure userPlannings is an array
            const validUserPlannings = Array.isArray(userPlannings) ? userPlannings : [];
            console.log(`[AdminStatsService] Valid userPlannings: ${validUserPlannings.length}`);
            
            // Count total sold packages per planning (from UserPlanning table)
            const soldCountByPlanning = new Map<string, number>();
            validUserPlannings.forEach((up: any) => {
                if (up?.planningId) {
                    soldCountByPlanning.set(up.planningId, (soldCountByPlanning.get(up.planningId) || 0) + 1);
                }
            });
            console.log(`[AdminStatsService] Sold packages count by planning:`, Array.from(soldCountByPlanning.entries()));
            
            // Calculate revenue from successful transactions
            successfulTx.forEach(t => {
                if (!t.orderId) return;
                const userPlanning = validUserPlannings.find((up: any) => up?.orderId === t.orderId);
                if (userPlanning && userPlanning.planningId) {
                    const key = userPlanning.planningId;
                    
                    if (!revenueByPlanningMap.has(key)) {
                        revenueByPlanningMap.set(key, { revenue: 0, orders: 0, totalSold: 0 });
                    }
                    const data = revenueByPlanningMap.get(key)!;
                    data.revenue += t.amount || 0;
                    data.orders += 1;
                }
            });

            // Combine all plannings with their sales data
            // Include all plannings (even if not sold) to show complete picture
            const revenueByPlanning = plannings.map(planning => {
                const salesData = revenueByPlanningMap.get(planning.id) || { revenue: 0, orders: 0, totalSold: 0 };
                const totalSold = soldCountByPlanning.get(planning.id) || 0;
                
                return {
                    planningId: planning.id,
                    planningName: planning.name,
                    revenue: salesData.revenue,
                    orders: salesData.orders,
                    totalSold: totalSold, // Total packages sold (from UserPlanning table)
                    price: planning.price,
                    forDeveloper: planning.forDeveloper,
                    forCustomer: planning.forCustomer
                };
            }).sort((a, b) => b.revenue - a.revenue); // Sort by revenue descending
            console.log(`[AdminStatsService] Revenue by planning packages: ${revenueByPlanning.length} packages (including unsold)`);

            // Boxplot statistics by planning package
            const revenueStatsByPlanning: Record<string, { min: number; q1: number; median: number; q3: number; max: number; mean: number }> = {};
            
            revenueByPlanningMap.forEach((_, planningId) => {
                const planningTransactions = successfulTx
                    .filter(t => {
                        if (!t.orderId) return false;
                        const userPlanning = validUserPlannings.find((up: any) => up?.orderId === t.orderId);
                        return userPlanning?.planningId === planningId;
                    })
                    .map(t => t.amount || 0)
                    .filter(a => a > 0);
                
                if (planningTransactions.length > 0) {
                    revenueStatsByPlanning[planningId] = this.calculateBoxplotStats(planningTransactions);
                }
            });

            const totalTime = Date.now() - startTime;
            console.log(`[AdminStatsService] Stats computation completed in ${totalTime}ms`);
            console.log('[AdminStatsService] Returning stats with:', {
                orderValueDistribution: orderValueDistribution.length,
                revenueByPlanning: revenueByPlanning.length,
                revenueStatsByPlanning: Object.keys(revenueStatsByPlanning).length,
            });

            return {
                totals: {
                    users: users.length,
                    developers,
                    customers,
                    projects: projects.length,
                    products: products.length,
                    ratings: ratings.length,
                    transactions: transactions.length,
                },
                usersByRole,
                projectsByStatus,
                productsByStatus,
                ratings: {
                    average,
                    distribution,
                },
                revenueByMonth: last12,
                transactionsByStatus,
                newUsersByMonth,
                orderValueDistribution,
                revenueByPlanning,
                revenueStatsByPlanning,
            };
        } catch (error) {
            console.error('[AdminStatsService] Failed to compute admin stats:', error);
            logger.error('Failed to compute admin stats:', error);
            throw error;
        }
    }

    public async getSidebarStats(): Promise<{
        totalUsers: number;
        developers: number;
        customers: number;
        totalPlannings: number;
        totalProjects: number;
        totalRatings: number;
        monthlyRevenue: number;
    }> {
        try {
            console.log('[AdminStatsService] getSidebarStats called');
            const [users, plannings, projects, ratings, transactions] = await Promise.allSettled([
                this.userRepository.findAll(),
                this.planningRepository.findAll(),
                this.projectRepository.findAll(),
                this.ratingRepository.findAll(),
                this.transactionRepository.findAll()
            ]);

            const usersData = users.status === 'fulfilled' ? users.value : [];
            const planningsData = plannings.status === 'fulfilled' ? plannings.value : [];
            const projectsData = projects.status === 'fulfilled' ? projects.value : [];
            const ratingsData = ratings.status === 'fulfilled' ? ratings.value : [];
            const transactionsData = transactions.status === 'fulfilled' ? transactions.value : [];

            // Calculate monthly revenue (current month)
            const now = new Date();
            const currentMonth = now.getMonth();
            const currentYear = now.getFullYear();
            const monthlyRevenue = transactionsData
                .filter(t => {
                    if (t.status !== TransactionStatus.SUCCESS) return false;
                    const date = t.createdDate ? new Date(t.createdDate) : new Date();
                    return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
                })
                .reduce((sum, t) => sum + (t.amount || 0), 0);

            const developers = usersData.filter(u => u.role === Role.DEVELOPER).length;
            const customers = usersData.filter(u => u.role === Role.CUSTOMER).length;

            return {
                totalUsers: usersData.length,
                developers,
                customers,
                totalPlannings: planningsData.length,
                totalProjects: projectsData.length,
                totalRatings: ratingsData.length,
                monthlyRevenue,
            };
        } catch (error) {
            console.error('[AdminStatsService] Failed to compute sidebar stats:', error);
            logger.error('Failed to compute sidebar stats:', error);
            throw error;
        }
    }

    private async getAllUserPlannings(): Promise<any[]> {
        try {
            console.log('[AdminStatsService] getAllUserPlannings called');
            const result = await this.userPlanningRepository.scanItems();
            console.log(`[AdminStatsService] getAllUserPlannings returned ${result.length} items`);
            return result;
        } catch (error) {
            console.error('[AdminStatsService] Error getting all user plannings:', error);
            logger.error('Error getting all user plannings:', error);
            return [];
        }
    }

    private calculateHistogram(values: number[], bins: number): { range: string; count: number }[] {
        if (values.length === 0) return [];
        
        const min = Math.min(...values);
        const max = Math.max(...values);
        
        // Handle case when all values are the same
        if (min === max) {
            return [{
                range: `${Math.round(min).toLocaleString()}`,
                count: values.length
            }];
        }
        
        const binWidth = (max - min) / bins;
        const histogram: number[] = new Array(bins).fill(0);
        
        values.forEach(value => {
            let binIndex = Math.floor((value - min) / binWidth);
            // Handle edge case where value equals max
            if (binIndex >= bins) binIndex = bins - 1;
            histogram[binIndex]++;
        });
        
        // Filter out empty bins and create range labels
        return histogram
            .map((count, index) => {
                const start = min + index * binWidth;
                const end = min + (index + 1) * binWidth;
                return {
                    range: `${Math.round(start).toLocaleString()} - ${Math.round(end).toLocaleString()}`,
                    count
                };
            })
            .filter(item => item.count > 0); // Only show bins with data
    }

    private calculateBoxplotStats(values: number[]): { min: number; q1: number; median: number; q3: number; max: number; mean: number } {
        const sorted = [...values].sort((a, b) => a - b);
        const n = sorted.length;
        
        const min = sorted[0];
        const max = sorted[n - 1];
        const mean = sorted.reduce((sum, v) => sum + v, 0) / n;
        
        const median = n % 2 === 0
            ? (sorted[n / 2 - 1] + sorted[n / 2]) / 2
            : sorted[Math.floor(n / 2)];
        
        const q1Index = Math.floor(n * 0.25);
        const q1 = n % 4 === 0
            ? (sorted[q1Index - 1] + sorted[q1Index]) / 2
            : sorted[q1Index];
        
        const q3Index = Math.floor(n * 0.75);
        const q3 = n % 4 === 0
            ? (sorted[q3Index - 1] + sorted[q3Index]) / 2
            : sorted[q3Index];
        
        return { min, q1, median, q3, max, mean };
    }
}


