import { useState, useCallback } from 'react';
import useAxios from './useAxios';
import { Api } from '@/configs/api';
import { DeveloperProfile, Skill, SkillProficiency } from '@/types/user.type';
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

export interface DeveloperProfileResponse {
    userProfile: UserProfileResponse;
    developerProfile: DeveloperProfile | null;
}

// Hook state interface
export interface UseDeveloperProfileState {
    // Data
    userProfile: UserProfileResponse | null;
    developerProfile: DeveloperProfile | null;
    developersList: DeveloperProfileResponse[];
    totalAvailable: number;
    skills: Skill[];
    
    // Loading states
    isLoading: boolean;
    isUpdating: boolean;
    isLoadingList: boolean;
    isSkillLoading: boolean;
    
    // Error states
    error: string | null;
    updateError: string | null;
    listError: string | null;
    skillError: string | null;
    
    // Success states
    isUpdated: boolean;
    isSkillUpdated: boolean;
    
    // Cache states
    isFromCache: boolean;
}

// Hook return interface
export interface UseDeveloperProfileReturn extends UseDeveloperProfileState {
    // Actions
    getDeveloperProfile: (userId: string, forceRefresh?: boolean) => Promise<void>;
    getDevelopersByPage: (page: number, pageSize: number, forceRefresh?: boolean) => Promise<void>;
    updateDeveloperProfile: (userId: string, profileData: Partial<DeveloperProfile>) => Promise<boolean>;
    updateUserProfile: (userId: string, userData: Partial<UserProfileResponse>) => Promise<boolean>;
    updateUserAvatar: (userId: string, avatarFile: File) => Promise<boolean>;
    refreshProfile: () => Promise<void>;
    clearErrors: () => void;
    resetUpdateState: () => void;
    clearCache: () => void;
    refreshDevelopersList: () => Promise<void>;
    
    // Skill management actions
    addSkill: (userId: string, skill: Omit<Skill, 'id' | 'createdDate' | 'updatedDate'>) => Promise<boolean>;
    updateSkill: (userId: string, skillId: string, updatedSkill: Partial<Skill>) => Promise<boolean>;
    removeSkill: (userId: string, skillId: string) => Promise<boolean>;
    getSkills: (userId: string) => Promise<void>;
    resetSkillState: () => void;
    
    // Computed values
    isProfileComplete: boolean;
    hasProfile: boolean;
}

// Default state
const defaultState: UseDeveloperProfileState = {
    userProfile: null,
    developerProfile: null,
    developersList: [],
    totalAvailable: 0,
    skills: [],
    isLoading: false,
    isUpdating: false,
    isLoadingList: false,
    isSkillLoading: false,
    error: null,
    updateError: null,
    listError: null,
    skillError: null,
    isUpdated: false,
    isSkillUpdated: false,
    isFromCache: false,
};

export const useDeveloperProfile = (): UseDeveloperProfileReturn => {
    const axiosInstance = useAxios();
    const [state, setState] = useState<UseDeveloperProfileState>(defaultState);

    /**
     * Clear all errors
     */
    const clearErrors = useCallback(() => {
        setState(prev => ({
            ...prev,
            error: null,
            updateError: null,
            listError: null,
            skillError: null,
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
     * Get developer profile by userId
     */
    const getDeveloperProfile = useCallback(async (userId: string, forceRefresh: boolean = false): Promise<void> => {
        if (!userId) {
            setState(prev => ({
                ...prev,
                error: 'User ID is required',
                isLoading: false,
            }));
            return;
        }

        const cacheKey = CacheKeys.DEVELOPER_PROFILE(userId);

        // Check cache first (unless force refresh)
        if (!forceRefresh && cacheService.has(cacheKey)) {
            const cachedData = cacheService.get<DeveloperProfileResponse>(cacheKey);
            if (cachedData) {
                console.log('Loading developer profile from cache:', userId);
                setState(prev => ({
                    ...prev,
                    userProfile: cachedData.userProfile,
                    developerProfile: cachedData.developerProfile,
                    isLoading: false,
                    error: null,
                }));
                return;
            }
        }

        setState(prev => ({
            ...prev,
            isLoading: true,
            error: null,
        }));

        try {
            const response = await axiosInstance.get(
                `${Api.Developer.GET_PROFILE}/${userId}`
            );

            if (response.data.success) {
                const profileData: DeveloperProfileResponse = response.data.dataResponse;
                console.log('profileData', response.data.dataResponse);
                
                // Cache the profile for 10 minutes
                cacheService.set(cacheKey, profileData, 10 * 60 * 1000);
                
                setState(prev => ({
                    ...prev,
                    userProfile: profileData.userProfile,
                    developerProfile: profileData.developerProfile,
                    isLoading: false,
                    error: null,
                }));
            } else {
                setState(prev => ({
                    ...prev,
                    isLoading: false,
                    error: response.data.message || 'Failed to fetch developer profile',
                }));
            }
        } catch (error: any) {
            console.error('Error fetching developer profile:', error);
            setState(prev => ({
                ...prev,
                isLoading: false,
                error: error.response?.data?.message || 
                       error.message || 
                       'Failed to fetch developer profile',
            }));
        }
    }, [axiosInstance]);

    /**
     * Get developers by page (requires CUSTOMER role authentication)
     */
    const getDevelopersByPage = useCallback(async (page: number, pageSize: number, forceRefresh: boolean = false): Promise<void> => {
        if (page < 1) {
            setState(prev => ({
                ...prev,
                listError: 'Page number must be greater than 0',
                isLoadingList: false,
            }));
            return;
        }

        if (pageSize < 1 || pageSize > 100) {
            setState(prev => ({
                ...prev,
                listError: 'Page size must be between 1 and 100',
                isLoadingList: false,
            }));
            return;
        }

        const cacheKey = CacheKeys.DEVELOPERS_LIST(page, pageSize);

        // Check cache first (unless force refresh)
        if (!forceRefresh && cacheService.has(cacheKey)) {
            const cachedData = cacheService.get<{developers: DeveloperProfileResponse[], totalAvailable: number}>(cacheKey);
            if (cachedData) {
                console.log('Loading developers from cache:', { page, pageSize });
                setState(prev => ({
                    ...prev,
                    developersList: cachedData.developers,
                    totalAvailable: cachedData.totalAvailable,
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
            // Use authenticated axios instance (requires CUSTOMER role)
            const response = await axiosInstance.get(Api.Developer.GET_LIST, {
                params: {
                    page,
                    pageSize,
                }
            });

            if (response.data.success) {
                const { developers, pagination } = response.data.dataResponse;
                const responseData = {
                    developers,
                    totalAvailable: pagination.totalAvailable || 0,
                };

                console.log('Developers list loaded from API:', response.data.dataResponse);
                
                // Cache the response for 5 minutes
                cacheService.set(cacheKey, responseData, 5 * 60 * 1000);

                setState(prev => ({
                    ...prev,
                    developersList: developers,
                    totalAvailable: pagination.totalAvailable || 0,
                    isLoadingList: false,
                    listError: null,
                    isFromCache: false,
                }));
            } else {
                setState(prev => ({
                    ...prev,
                    isLoadingList: false,
                    listError: response.data.message || 'Failed to fetch developers list',
                    isFromCache: false,
                }));
            }
        } catch (error: any) {
            console.error('Error fetching developers list:', error);
            setState(prev => ({
                ...prev,
                isLoadingList: false,
                listError: error.response?.data?.message || 
                           error.message || 
                           'Failed to fetch developers list',
                isFromCache: false,
            }));
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
                const updatedProfileData: DeveloperProfileResponse = response.data.dataResponse;
                setState(prev => ({
                    ...prev,
                    userProfile: updatedProfileData.userProfile,
                    developerProfile: updatedProfileData.developerProfile,
                    isUpdating: false,
                    updateError: null,
                    isUpdated: true,
                }));
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
     * Update user avatar
     */
    const updateUserAvatar = useCallback(async (
        userId: string, 
        avatarFile: File
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
            const formData = new FormData();
            formData.append('projectImage', avatarFile); // Using projectImage field name as per multer config

            const response = await axiosInstance.put(
                `${Api.Developer.UPDATE_AVATAR}/${userId}`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            if (response.data.success) {
                const updatedProfileData: DeveloperProfileResponse = response.data.dataResponse;
                setState(prev => ({
                    ...prev,
                    userProfile: updatedProfileData.userProfile,
                    developerProfile: updatedProfileData.developerProfile,
                    isUpdating: false,
                    updateError: null,
                    isUpdated: true,
                }));
                return true;
            } else {
                setState(prev => ({
                    ...prev,
                    isUpdating: false,
                    updateError: response.data.message || 'Failed to update avatar',
                }));
                return false;
            }
        } catch (error: any) {
            console.error('Error updating avatar:', error);
            setState(prev => ({
                ...prev,
                isUpdating: false,
                updateError: error.response?.data?.message || 
                           error.message || 
                           'Failed to update avatar',
            }));
            return false;
        }
    }, [axiosInstance]);

    /**
     * Update developer profile
     */
    const updateDeveloperProfile = useCallback(async (
        userId: string, 
        profileData: Partial<DeveloperProfile>
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
                `${Api.Developer.UPDATE_PROFILE}/${userId}`,
                profileData
            );

            if (response.data.success) {
                const updatedProfileData: DeveloperProfileResponse = response.data.dataResponse;
                setState(prev => ({
                    ...prev,
                    userProfile: updatedProfileData.userProfile,
                    developerProfile: updatedProfileData.developerProfile,
                    isUpdating: false,
                    updateError: null,
                    isUpdated: true,
                }));
                return true;
            } else {
                setState(prev => ({
                    ...prev,
                    isUpdating: false,
                    updateError: response.data.message || 'Failed to update developer profile',
                }));
                return false;
            }
        } catch (error: any) {
            console.error('Error updating developer profile:', error);
            setState(prev => ({
                ...prev,
                isUpdating: false,
                updateError: error.response?.data?.message || 
                           error.message || 
                           'Failed to update developer profile',
            }));
            return false;
        }
    }, [axiosInstance]);

    /**
     * Refresh profile data
     */
    const refreshProfile = useCallback(async (): Promise<void> => {
        if (state.userProfile?.id) {
            await getDeveloperProfile(state.userProfile.id);
        }
    }, [state.userProfile?.id, getDeveloperProfile]);

    /**
     * Clear all cache
     */
    const clearCache = useCallback((): void => {
        cacheService.clear();
        console.log('Cache cleared');
    }, []);

    /**
     * Refresh developers list (force refresh from API)
     */
    const refreshDevelopersList = useCallback(async (): Promise<void> => {
        // Clear cache for current page
        const currentPageSize = 12; // Default page size, you might want to track this in state
        const cacheKey = CacheKeys.DEVELOPERS_LIST(1, currentPageSize);
        cacheService.delete(cacheKey);
        
        // Force refresh
        await getDevelopersByPage(1, currentPageSize, true);
    }, [getDevelopersByPage]);

    /**
     * Check if profile is complete
     */
    const isProfileComplete = useCallback((): boolean => {
        if (!state.developerProfile) return false;
        
        const profile = state.developerProfile;
        return !!(
            profile.title &&
            profile.bio &&
            profile.hourlyRate &&
            profile.experienceYears &&
            profile.developerLevel &&
            profile.skills &&
            profile.skills.length > 0
        );
    }, [state.developerProfile]);

    /**
     * Check if profile exists
     */
    const hasProfile = useCallback((): boolean => {
        return !!state.developerProfile;
    }, [state.developerProfile]);

    /**
     * Reset skill state
     */
    const resetSkillState = useCallback(() => {
        setState(prev => ({
            ...prev,
            isSkillUpdated: false,
            skillError: null,
        }));
    }, []);

    /**
     * Add a skill to developer profile
     */
    const addSkill = useCallback(async (
        userId: string, 
        skill: Omit<Skill, 'id' | 'createdDate' | 'updatedDate'>
    ): Promise<boolean> => {
        if (!userId) {
            setState(prev => ({
                ...prev,
                skillError: 'User ID is required',
                isSkillLoading: false,
            }));
            return false;
        }

        setState(prev => ({
            ...prev,
            isSkillLoading: true,
            skillError: null,
            isSkillUpdated: false,
        }));

        try {
            const response = await axiosInstance.post(
                `${Api.Developer.ADD_SKILL}/${userId}`,
                skill
            );

            if (response.data.success) {
                const updatedProfileData: DeveloperProfileResponse = response.data.dataResponse;
                setState(prev => ({
                    ...prev,
                    userProfile: updatedProfileData.userProfile,
                    developerProfile: updatedProfileData.developerProfile,
                    skills: updatedProfileData.developerProfile?.skills || [],
                    isSkillLoading: false,
                    skillError: null,
                    isSkillUpdated: true,
                }));
                return true;
            } else {
                setState(prev => ({
                    ...prev,
                    isSkillLoading: false,
                    skillError: response.data.message || 'Failed to add skill',
                }));
                return false;
            }
        } catch (error: any) {
            console.error('Error adding skill:', error);
            setState(prev => ({
                ...prev,
                isSkillLoading: false,
                skillError: error.response?.data?.message || 
                           error.message || 
                           'Failed to add skill',
            }));
            return false;
        }
    }, [axiosInstance]);

    /**
     * Update a skill in developer profile
     */
    const updateSkill = useCallback(async (
        userId: string, 
        skillId: string, 
        updatedSkill: Partial<Skill>
    ): Promise<boolean> => {
        if (!userId || !skillId) {
            setState(prev => ({
                ...prev,
                skillError: 'User ID and Skill ID are required',
                isSkillLoading: false,
            }));
            return false;
        }

        setState(prev => ({
            ...prev,
            isSkillLoading: true,
            skillError: null,
            isSkillUpdated: false,
        }));

        try {
            const response = await axiosInstance.put(
                `${Api.Developer.UPDATE_SKILL}/${userId}/${skillId}`,
                updatedSkill
            );

            if (response.data.success) {
                const updatedProfileData: DeveloperProfileResponse = response.data.dataResponse;
                setState(prev => ({
                    ...prev,
                    userProfile: updatedProfileData.userProfile,
                    developerProfile: updatedProfileData.developerProfile,
                    skills: updatedProfileData.developerProfile?.skills || [],
                    isSkillLoading: false,
                    skillError: null,
                    isSkillUpdated: true,
                }));
                return true;
            } else {
                setState(prev => ({
                    ...prev,
                    isSkillLoading: false,
                    skillError: response.data.message || 'Failed to update skill',
                }));
                return false;
            }
        } catch (error: any) {
            console.error('Error updating skill:', error);
            setState(prev => ({
                ...prev,
                isSkillLoading: false,
                skillError: error.response?.data?.message || 
                           error.message || 
                           'Failed to update skill',
            }));
            return false;
        }
    }, [axiosInstance]);

    /**
     * Remove a skill from developer profile
     */
    const removeSkill = useCallback(async (
        userId: string, 
        skillId: string
    ): Promise<boolean> => {
        if (!userId || !skillId) {
            setState(prev => ({
                ...prev,
                skillError: 'User ID and Skill ID are required',
                isSkillLoading: false,
            }));
            return false;
        }

        setState(prev => ({
            ...prev,
            isSkillLoading: true,
            skillError: null,
            isSkillUpdated: false,
        }));

        try {
            const response = await axiosInstance.delete(
                `${Api.Developer.REMOVE_SKILL}/${userId}/${skillId}`
            );

            if (response.data.success) {
                const updatedProfileData: DeveloperProfileResponse = response.data.dataResponse;
                setState(prev => ({
                    ...prev,
                    userProfile: updatedProfileData.userProfile,
                    developerProfile: updatedProfileData.developerProfile,
                    skills: updatedProfileData.developerProfile?.skills || [],
                    isSkillLoading: false,
                    skillError: null,
                    isSkillUpdated: true,
                }));
                return true;
            } else {
                setState(prev => ({
                    ...prev,
                    isSkillLoading: false,
                    skillError: response.data.message || 'Failed to remove skill',
                }));
                return false;
            }
        } catch (error: any) {
            console.error('Error removing skill:', error);
            setState(prev => ({
                ...prev,
                isSkillLoading: false,
                skillError: error.response?.data?.message || 
                           error.message || 
                           'Failed to remove skill',
            }));
            return false;
        }
    }, [axiosInstance]);

    /**
     * Get skills for a developer
     */
    const getSkills = useCallback(async (userId: string): Promise<void> => {
        if (!userId) {
            setState(prev => ({
                ...prev,
                skillError: 'User ID is required',
                isSkillLoading: false,
            }));
            return;
        }

        setState(prev => ({
            ...prev,
            isSkillLoading: true,
            skillError: null,
        }));

        try {
            const response = await axiosInstance.get(
                `${Api.Developer.GET_SKILLS}/${userId}`
            );

            if (response.data.success) {
                const skills: Skill[] = response.data.dataResponse;
                setState(prev => ({
                    ...prev,
                    skills: skills,
                    isSkillLoading: false,
                    skillError: null,
                }));
            } else {
                setState(prev => ({
                    ...prev,
                    isSkillLoading: false,
                    skillError: response.data.message || 'Failed to fetch skills',
                }));
            }
        } catch (error: any) {
            console.error('Error fetching skills:', error);
            setState(prev => ({
                ...prev,
                isSkillLoading: false,
                skillError: error.response?.data?.message || 
                           error.message || 
                           'Failed to fetch skills',
            }));
        }
    }, [axiosInstance]);

    return {
        // State
        ...state,
        
        // Actions
        getDeveloperProfile,
        getDevelopersByPage,
        updateDeveloperProfile,
        updateUserProfile,
        updateUserAvatar,
        refreshProfile,
        clearErrors,
        resetUpdateState,
        clearCache,
        refreshDevelopersList,
        
        // Skill management actions
        addSkill,
        updateSkill,
        removeSkill,
        getSkills,
        resetSkillState,
        
        // Computed values
        isProfileComplete: isProfileComplete(),
        hasProfile: hasProfile(),
    };
};

export default useDeveloperProfile;
