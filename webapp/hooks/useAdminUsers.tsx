'use client';
import { useCallback, useState } from 'react';
import useAxios from '@/hooks/useAxios';
import { Api } from '@/configs/api';
import { DeveloperProfile, CustomerProfile, User } from '@/types/user.type';
import { UserPlanning } from '@/types/planning.type';

export type DeveloperWithProfile = User & {
  developerProfile?: DeveloperProfile;
};

export type CustomerWithProfile = User & {
  customerProfile?: CustomerProfile;
};

export type UserWithPlannings = {
  user: DeveloperWithProfile | CustomerWithProfile;
  plannings: UserPlanning[];
  activePlanning?: UserPlanning;
};

export const useAdminUsers = () => {
  const axiosInstance = useAxios();
  const [developers, setDevelopers] = useState<DeveloperWithProfile[]>([]);
  const [customers, setCustomers] = useState<CustomerWithProfile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDevelopers = useCallback(async (page: number = 1, pageSize: number = 50) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await axiosInstance.get(Api.Developer.ADMIN_GET_LIST, {
        params: { page, pageSize }
      });
      
      console.log('Raw developer response:', response.data);
      
      if (response.data?.success && response.data?.dataResponse?.developers) {
        // Transform backend structure to frontend structure
        const transformedDevelopers = response.data.dataResponse.developers.map((dev: any) => ({
          ...dev.userProfile,
          developerProfile: dev.developerProfile
        }));
        console.log('Transformed developers:', transformedDevelopers);
        setDevelopers(transformedDevelopers);
      }
    } catch (e: any) {
      console.error('Error fetching developers:', e);
      setError(e?.response?.data?.message || e?.message || 'Không thể tải danh sách developers');
    } finally {
      setIsLoading(false);
    }
  }, [axiosInstance]);

  const fetchCustomers = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await axiosInstance.get(Api.Customer.ADMIN_GET_LIST);
      
      console.log('Raw customer response:', response.data);
      
      if (response.data?.success && response.data?.dataResponse) {
        console.log('Customers data:', response.data.dataResponse);
        setCustomers(response.data.dataResponse);
      }
    } catch (e: any) {
      console.error('Error fetching customers:', e);
      setError(e?.response?.data?.message || e?.message || 'Không thể tải danh sách customers');
    } finally {
      setIsLoading(false);
    }
  }, [axiosInstance]);

  const fetchUserPlannings = useCallback(async (userId: string): Promise<UserPlanning[]> => {
    try {
      const response = await axiosInstance.get(`${Api.Planning.GET_USER_PLANNINGS}`, {
        headers: {
          'X-User-Id': userId // Assuming backend can handle this for admin
        }
      });
      
      if (response.data?.success && response.data?.dataResponse) {
        return response.data.dataResponse;
      }
      return [];
    } catch (e) {
      console.error('Error fetching user plannings:', e);
      return [];
    }
  }, [axiosInstance]);

  const refreshAll = useCallback(async () => {
    await Promise.all([fetchDevelopers(), fetchCustomers()]);
  }, [fetchDevelopers, fetchCustomers]);

  return {
    developers,
    customers,
    isLoading,
    error,
    fetchDevelopers,
    fetchCustomers,
    fetchUserPlannings,
    refreshAll,
  };
};

export default useAdminUsers;
