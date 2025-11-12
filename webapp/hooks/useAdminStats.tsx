'use client';
import { useCallback, useState } from 'react';
import useAxios from '@/hooks/useAxios';

interface AdminStatsState {
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
    distribution: Record<string, number>;
  };
  revenueByMonth: { month: string; total: number }[];
  transactionsByStatus: Record<string, number>;
  newUsersByMonth: { month: string; total: number }[];
  orderValueDistribution?: { range: string; count: number }[];
  revenueByPlanning?: { planningId: string; planningName: string; revenue: number; orders: number; totalSold: number; price: number; forDeveloper: boolean; forCustomer: boolean }[];
  revenueStatsByPlanning?: Record<string, { min: number; q1: number; median: number; q3: number; max: number; mean: number }>;
}

export const useAdminStats = () => {
  const axiosInstance = useAxios();
  const [stats, setStats] = useState<AdminStatsState | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      console.log('[useAdminStats] Starting to fetch admin stats...');
      setIsLoading(true);
      setError(null);

      console.log('[useAdminStats] Making API call to /api/v1/admin/stats');
      const startTime = Date.now();
      const res = await axiosInstance.get('/api/v1/admin/stats');
      const endTime = Date.now();
      console.log(`[useAdminStats] API call completed in ${endTime - startTime}ms`, res.data);
      
      if (res.data?.dataResponse) {
        console.log('[useAdminStats] Setting stats data:', {
          hasOrderValueDistribution: !!res.data.dataResponse.orderValueDistribution,
          hasRevenueByPlanning: !!res.data.dataResponse.revenueByPlanning,
          revenueByPlanningLength: res.data.dataResponse.revenueByPlanning?.length || 0,
        });
        setStats(res.data.dataResponse as AdminStatsState);
      } else {
        console.warn('[useAdminStats] No dataResponse in response:', res.data);
      }
    } catch (e: unknown) {
      console.error('[useAdminStats] Error fetching admin stats:', e);
      const error = e as { message?: string; response?: { data?: { message?: string }; status?: number } };
      console.error('[useAdminStats] Error details:', {
        message: error?.message,
        response: error?.response?.data,
        status: error?.response?.status,
      });
      setError(error?.response?.data?.message || error?.message || 'Không thể tải thống kê');
    } finally {
      setIsLoading(false);
      console.log('[useAdminStats] Loading state set to false');
    }
  }, [axiosInstance]);

  return { stats, isLoading, error, refresh };
};

export default useAdminStats;


