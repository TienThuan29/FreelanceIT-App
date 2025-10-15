import { useState, useCallback } from 'react';
import useAxios from './useAxios';
import { Api } from '@/configs/api';
import { CustomerProfile, UserProfile, Commune, Province } from '@/types/user.type';
import cacheService, { CacheKeys } from '@/utils/cache';

// Types for API responses
export interface UserProfileResponse {
    id?: string;
    email: string;
    fullname: string;
    phone?: string;
    dateOfBirth?: Date;
    avatarUrl?: string;
    role: string;
    isEnable: boolean;
    lastLoginDate?: Date;
    createdDate?: Date;
    updatedDate?: Date;
}

export interface CustomerProfileResponse {
    userProfile: UserProfileResponse;
    customerProfile: CustomerProfile | null;
}

// Request types
export interface CreateCustomerProfileRequest {
    userId: string;
    companyName?: string;
    companyWebsite?: string;
    industry?: string;
    companySize?: string;
    taxId?: string;
    houseNumberAndStreet?: string;
    commune: Commune;
    province: Province;
}

export interface UpdateCustomerProfileRequest {
    companyName?: string;
    companyWebsite?: string;
    industry?: string;
    companySize?: string;
    taxId?: string;
    houseNumberAndStreet?: string;
    commune?: Commune;
    province?: Province;
}

// Hook state interface
export interface UseCustomerProfileState {
    // Data
    userProfile: UserProfileResponse | null;
    customerProfile: CustomerProfile | null;
    customersList: CustomerProfileResponse[];
    
    // Loading states
    isLoading: boolean;
    isUpdating: boolean;
    isLoadingList: boolean;
    isCreating: boolean;
    isDeleting: boolean;
    
    // Error states
    error: string | null;
    updateError: string | null;
    createError: string | null;
    deleteError: string | null;
    listError: string | null;
    
    // Success states
    isUpdated: boolean;
    isCreated: boolean;
    isDeleted: boolean;
    
    // Cache states
    isFromCache: boolean;
}

// Hook return interface
export interface UseCustomerProfileReturn extends UseCustomerProfileState {
    // Actions
    getCustomerProfile: (userId: string, forceRefresh?: boolean) => Promise<void>;
    getAllCustomerProfiles: (forceRefresh?: boolean) => Promise<void>;
    createCustomerProfile: (profileData: CreateCustomerProfileRequest) => Promise<boolean>;
    updateCustomerProfile: (userId: string, profileData: UpdateCustomerProfileRequest) => Promise<boolean>;
    updateUserProfile: (userId: string, userData: Partial<UserProfileResponse>) => Promise<boolean>;
    deleteCustomerProfile: (userId: string) => Promise<boolean>;
    refreshProfile: (userId: string) => Promise<void>;
    clearErrors: () => void;
    resetUpdateState: () => void;
    resetCreateState: () => void;
    resetDeleteState: () => void;
    clearCache: () => void;
    refreshCustomersList: () => Promise<void>;
    
    // Computed values
    isProfileComplete: boolean;
    hasProfile: boolean;
}

// Default state
const defaultState: UseCustomerProfileState = {
    userProfile: null,
    customerProfile: null,
    customersList: [],
    isLoading: false,
    isUpdating: false,
    isLoadingList: false,
    isCreating: false,
    isDeleting: false,
    error: null,
    updateError: null,
    createError: null,
    deleteError: null,
    listError: null,
    isUpdated: false,
    isCreated: false,
    isDeleted: false,
    isFromCache: false,
};

export const useCustomerProfile = (): UseCustomerProfileReturn => {
    const axiosInstance = useAxios();
    const [state, setState] = useState<UseCustomerProfileState>(defaultState);

    /**
     * Clear all errors
     */
    const clearErrors = useCallback(() => {
        setState(prev => ({
            ...prev,
            error: null,
            updateError: null,
            createError: null,
            deleteError: null,
            listError: null,
        }));
    }, []);

    /**
     * Reset update state
     */
    const resetUpdateState = useCallback(() => {
        setState(prev => ({
            ...prev,
            isUpdated: false,
            updateError: null,
        }));
    }, []);

    /**
     * Reset create state
     */
    const resetCreateState = useCallback(() => {
        setState(prev => ({
            ...prev,
            isCreated: false,
            createError: null,
        }));
    }, []);

    /**
     * Reset delete state
     */
    const resetDeleteState = useCallback(() => {
        setState(prev => ({
            ...prev,
            isDeleted: false,
            deleteError: null,
        }));
    }, []);

    /**
     * Get customer profile by userId
     */
    const getCustomerProfile = useCallback(async (userId: string, forceRefresh: boolean = false): Promise<void> => {
        if (!userId) {
            setState(prev => ({
                ...prev,
                error: 'User ID is required',
                isLoading: false,
            }));
            return;
        }

        const cacheKey = `customer_profile_${userId}`;

        // Check cache first (unless force refresh)
        if (!forceRefresh && cacheService.has(cacheKey)) {
            const cachedData = cacheService.get<CustomerProfileResponse>(cacheKey);
            if (cachedData) {
                setState(prev => ({
                    ...prev,
                    userProfile: cachedData.userProfile,
                    customerProfile: cachedData.customerProfile,
                    isLoading: false,
                    error: null,
                    isFromCache: true,
                }));
                return;
            }
        }

        setState(prev => ({
            ...prev,
            isLoading: true,
            error: null,
            isFromCache: false,
        }));

        try {
            const url = `${Api.Customer.GET_PROFILE}/${userId}`;
            const response = await axiosInstance.get(url);

            if (response.data.success) {
                const responseData: CustomerProfileResponse = response.data.dataResponse;
                
                // Cache the profile for 10 minutes
                cacheService.set(cacheKey, responseData, 10 * 60 * 1000);
                
                setState(prev => ({
                    ...prev,
                    userProfile: responseData.userProfile,
                    customerProfile: responseData.customerProfile,
                    isLoading: false,
                    error: null,
                    isFromCache: false,
                }));
            } else {
                setState(prev => ({
                    ...prev,
                    isLoading: false,
                    error: response.data.message || 'Failed to fetch customer profile',
                    isFromCache: false,
                }));
            }
        } catch (error: any) {
            if (error.response?.status === 404) {
                setState(prev => {
                    const newState = {
                        ...prev,
                        customerProfile: null,
                        isLoading: false,
                        error: null,
                        isFromCache: false,
                    };
                    return newState;
                });
            } else {
                setState(prev => {
                    const newState = {
                        ...prev,
                        isLoading: false,
                        error: error.response?.data?.message || 
                               error.message || 
                               'Failed to fetch customer profile',
                        isFromCache: false,
                    };
                    return newState;
                });
            }
        }
    }, [axiosInstance]);

    /**
     * Get all customer profiles
     */
    const getAllCustomerProfiles = useCallback(async (forceRefresh: boolean = false): Promise<void> => {
        const cacheKey = 'customers_list';

        // Check cache first (unless force refresh)
        if (!forceRefresh && cacheService.has(cacheKey)) {
            const cachedData = cacheService.get<CustomerProfile[]>(cacheKey);
            if (cachedData) {
                setState(prev => ({
                    ...prev,
                    customersList: cachedData.map(profile => ({
                        userProfile: {
                            id: profile.userId,
                            email: '',
                            fullname: '',
                            role: 'CUSTOMER',
                            isEnable: true,
                        },
                        customerProfile: profile,
                    })),
                    isLoadingList: false,
                    listError: null,
                    isFromCache: true,
                }));
                return;
            }
        }

        setState(prev => ({
            ...prev,
            isLoadingList: true,
            listError: null,
            isFromCache: false,
        }));

        try {
            const response = await axiosInstance.get(Api.Customer.GET_ALL_PROFILES);

            if (response.data.success) {
                const profiles: CustomerProfile[] = response.data.dataResponse;
                // Cache the response for 5 minutes
                cacheService.set(cacheKey, profiles, 5 * 60 * 1000);

                setState(prev => ({
                    ...prev,
                    customersList: profiles.map(profile => ({
                        userProfile: {
                            id: profile.userId,
                            email: '',
                            fullname: '',
                            role: 'CUSTOMER',
                            isEnable: true,
                        },
                        customerProfile: profile,
                    })),
                    isLoadingList: false,
                    listError: null,
                    isFromCache: false,
                }));
            } else {
                setState(prev => ({
                    ...prev,
                    isLoadingList: false,
                    listError: response.data.message || 'Failed to fetch customers list',
                    isFromCache: false,
                }));
            }
        } catch (error: any) {
            console.error('Error fetching customers list:', error);
            setState(prev => ({
                ...prev,
                isLoadingList: false,
                listError: error.response?.data?.message || 
                           error.message || 
                           'Failed to fetch customers list',
                isFromCache: false,
            }));
        }
    }, [axiosInstance]);

    /**
     * Create customer profile
     */
    const createCustomerProfile = useCallback(async (
        profileData: CreateCustomerProfileRequest
    ): Promise<boolean> => {
        if (!profileData.userId) {
            setState(prev => ({
                ...prev,
                createError: 'User ID is required',
                isCreating: false,
            }));
            return false;
        }

        setState(prev => ({
            ...prev,
            isCreating: true,
            createError: null,
            isCreated: false,
        }));

        try {
            const response = await axiosInstance.post(
                Api.Customer.CREATE_PROFILE,
                profileData
            );

            if (response.data.success) {
                console.log('Create customer profile API response:', response.data.dataResponse);
                const responseData: CustomerProfileResponse = response.data.dataResponse;
                setState(prev => ({
                    ...prev,
                    userProfile: responseData.userProfile,
                    customerProfile: responseData.customerProfile,
                    isCreating: false,
                    createError: null,
                    isCreated: true,
                }));
                return true;
            } else {
                setState(prev => ({
                    ...prev,
                    isCreating: false,
                    createError: response.data.message || 'Failed to create customer profile',
                }));
                return false;
            }
        } catch (error: any) {
            console.error('Error creating customer profile:', error);
            setState(prev => ({
                ...prev,
                isCreating: false,
                createError: error.response?.data?.message || 
                           error.message || 
                           'Failed to create customer profile',
            }));
            return false;
        }
    }, [axiosInstance]);

    /**
     * Update customer profile
     */
    const updateCustomerProfile = useCallback(async (
        userId: string, 
        profileData: UpdateCustomerProfileRequest
    ): Promise<boolean> => {
        if (!userId) {
            setState(prev => ({
                ...prev,
                updateError: 'User ID is required',
                isUpdating: false,
            }));
            return false;
        }

        setState(prev => ({
            ...prev,
            isUpdating: true,
            updateError: null,
            isUpdated: false,
        }));

        try {
            const response = await axiosInstance.put(
                `${Api.Customer.UPDATE_PROFILE}/${userId}`,
                profileData
            );

            if (response.data.success) {
                console.log('Update customer profile API response:', response.data.dataResponse);
                const responseData: CustomerProfileResponse = response.data.dataResponse;
                setState(prev => ({
                    ...prev,
                    userProfile: responseData.userProfile,
                    customerProfile: responseData.customerProfile,
                    isUpdating: false,
                    updateError: null,
                    isUpdated: true,
                }));
                return true;
            } else {
                setState(prev => ({
                    ...prev,
                    isUpdating: false,
                    updateError: response.data.message || 'Failed to update customer profile',
                }));
                return false;
            }
        } catch (error: any) {
            console.error('Error updating customer profile:', error);
            setState(prev => ({
                ...prev,
                isUpdating: false,
                updateError: error.response?.data?.message || 
                           error.message || 
                           'Failed to update customer profile',
            }));
            return false;
        }
    }, [axiosInstance]);

    /**
     * Update user profile
     */
    const updateUserProfile = useCallback(async (
        userId: string, 
        userData: Partial<UserProfileResponse>
    ): Promise<boolean> => {
        if (!userId) {
            setState(prev => ({
                ...prev,
                updateError: 'User ID is required',
                isUpdating: false,
            }));
            return false;
        }

        setState(prev => ({
            ...prev,
            isUpdating: true,
            updateError: null,
            isUpdated: false,
        }));

        try {
            const response = await axiosInstance.put(
                `${Api.Developer.UPDATE_USER}/${userId}`,
                userData
            );

            if (response.data.success) {
                console.log('Update user profile API response:', response.data.dataResponse);
                const responseData: { userProfile: UserProfileResponse, developerProfile: any } = response.data.dataResponse;
                console.log('Extracted user profile:', responseData.userProfile);
                setState(prev => ({
                    ...prev,
                    userProfile: responseData.userProfile,
                    isUpdating: false,
                    updateError: null,
                    isUpdated: true,
                }));
                
                // Clear cache to force refresh
                const cacheKey = `customer_profile_${userId}`;
                cacheService.delete(cacheKey);
                
                return true;
            } else {
                setState(prev => ({
                    ...prev,
                    isUpdating: false,
                    updateError: response.data.message || 'Failed to update user profile',
                }));
                return false;
            }
        } catch (error: any) {
            console.error('Error updating user profile:', error);
            setState(prev => ({
                ...prev,
                isUpdating: false,
                updateError: error.response?.data?.message || 
                           error.message || 
                           'Failed to update user profile',
            }));
            return false;
        }
    }, [axiosInstance]);

    /**
     * Delete customer profile
     */
    const deleteCustomerProfile = useCallback(async (userId: string): Promise<boolean> => {
        if (!userId) {
            setState(prev => ({
                ...prev,
                deleteError: 'User ID is required',
                isDeleting: false,
            }));
            return false;
        }

        setState(prev => ({
            ...prev,
            isDeleting: true,
            deleteError: null,
            isDeleted: false,
        }));

        try {
            const response = await axiosInstance.delete(
                `${Api.Customer.DELETE_PROFILE}/${userId}`
            );

            if (response.data.success) {
                setState(prev => ({
                    ...prev,
                    customerProfile: null,
                    isDeleting: false,
                    deleteError: null,
                    isDeleted: true,
                }));
                return true;
            } else {
                setState(prev => ({
                    ...prev,
                    isDeleting: false,
                    deleteError: response.data.message || 'Failed to delete customer profile',
                }));
                return false;
            }
        } catch (error: any) {
            console.error('Error deleting customer profile:', error);
            setState(prev => ({
                ...prev,
                isDeleting: false,
                deleteError: error.response?.data?.message || 
                           error.message || 
                           'Failed to delete customer profile',
            }));
            return false;
        }
    }, [axiosInstance]);


    const refreshProfile = useCallback(async (userId: string): Promise<void> => {
        if (userId) {
            await getCustomerProfile(userId);
        }
    }, [getCustomerProfile]);

    const clearCache = useCallback((): void => {
        cacheService.clear();
    }, []);

    const refreshCustomersList = useCallback(async (): Promise<void> => {
        // Clear cache for customers list
        const cacheKey = 'customers_list';
        cacheService.delete(cacheKey);
        
        // Force refresh
        await getAllCustomerProfiles(true);
    }, [getAllCustomerProfiles]);

    /**
     * Check if profile is complete
     */
    const isProfileComplete = useCallback((): boolean => {
        if (!state.customerProfile) return false;
        
        const profile = state.customerProfile;
        return !!(
            profile.companyName &&
            profile.industry &&
            profile.companySize &&
            profile.commune &&
            profile.province
        );
    }, [state.customerProfile]);

    /**
     * Check if profile exists
     */
    const hasProfile = useCallback((): boolean => {
        return !!state.customerProfile;
    }, [state.customerProfile]);

    return {
        // State
        ...state,
        
        // Actions
        getCustomerProfile,
        getAllCustomerProfiles,
        createCustomerProfile,
        updateCustomerProfile,
        updateUserProfile,
        deleteCustomerProfile,
        refreshProfile,
        clearErrors,
        resetUpdateState,
        resetCreateState,
        resetDeleteState,
        clearCache,
        refreshCustomersList,
        
        // Computed values
        isProfileComplete: isProfileComplete(),
        hasProfile: hasProfile(),
    };
};

export default useCustomerProfile;
