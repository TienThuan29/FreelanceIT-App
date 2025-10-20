'use client';
import { useCallback, useState } from 'react';
import useAxios from '@/hooks/useAxios';
import { Api } from '@/configs/api';

interface AdminStatsState {
  users: number;
  plannings: number;
  projects: number;
}

export const useAdminStats = () => {
  const axiosInstance = useAxios();
  const [stats, setStats] = useState<AdminStatsState>({ users: 0, plannings: 0, projects: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Attempt to fetch counts. If backend doesn't have dedicated count endpoints,
      // fallback to list endpoints and use length.
      const [usersRes, planningsRes, projectsRes] = await Promise.all([
        axiosInstance.get('/api/v1/admin/users?limit=1&page=1&withTotal=true').catch(() => null),
        axiosInstance.get(Api.Planning.GET_ALL_PLANNINGS).catch(() => null),
        axiosInstance.get(Api.Project.GET_ALL_PROJECTS).catch(() => null),
      ]);

      const usersCount = usersRes?.data?.total || usersRes?.data?.dataResponse?.total || usersRes?.data?.dataResponse?.length || 0;
      const plannings = Array.isArray(planningsRes?.data?.dataResponse) ? planningsRes?.data?.dataResponse.length : 0;
      const projects = Array.isArray(projectsRes?.data?.dataResponse) ? projectsRes?.data?.dataResponse.length : 0;

      setStats({ users: usersCount, plannings, projects });
    } catch (e: any) {
      setError(e?.response?.data?.message || e?.message || 'Không thể tải thống kê');
    } finally {
      setIsLoading(false);
    }
  }, [axiosInstance]);

  return { stats, isLoading, error, refresh };
};

export default useAdminStats;


