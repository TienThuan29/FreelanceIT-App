'use client';
import { useCallback, useState, useEffect } from 'react';
import useAxios from '@/hooks/useAxios';
import { Api } from '@/configs/api';

interface SidebarStats {
  totalUsers: number;
  developers: number;
  customers: number;
  totalPlannings: number;
  totalProjects: number;
  totalRatings: number;
  monthlyRevenue: number;
}

export const useAdminSidebarStats = () => {
  const axiosInstance = useAxios();
  const [stats, setStats] = useState<SidebarStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await axiosInstance.get(Api.Admin.GET_SIDEBAR_STATS);
      if (res.data?.dataResponse) {
        setStats(res.data.dataResponse as SidebarStats);
      }
    } catch (e: unknown) {
      const error = e as { message?: string; response?: { data?: { message?: string } } };
      setError(error?.response?.data?.message || error?.message || 'Không thể tải thống kê');
    } finally {
      setIsLoading(false);
    }
  }, [axiosInstance]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { stats, isLoading, error, refresh };
};

export default useAdminSidebarStats;

