import { useState, useCallback, useEffect } from 'react';
import useAxios from './useAxios';
import { Api } from '@/configs/api';
import { DeveloperProfile, User } from '@/types/user.type';
import { DeveloperLevel, SkillProficiency } from '@/types/user.type';

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
    
    // Loading states
    isLoading: boolean;
    isUpdating: boolean;
    
    // Error states
    error: string | null;
    updateError: string | null;
    
    // Success states
    isUpdated: boolean;
}

// Hook return interface
export interface UseDeveloperProfileReturn extends UseDeveloperProfileState {
    // Actions
    getDeveloperProfile: (userId: string) => Promise<void>;
    updateDeveloperProfile: (userId: string, profileData: Partial<DeveloperProfile>) => Promise<boolean>;
    updateUserProfile: (userId: string, userData: Partial<UserProfileResponse>) => Promise<boolean>;
    updateUserAvatar: (userId: string, avatarFile: File) => Promise<boolean>;
    refreshProfile: () => Promise<void>;
    clearErrors: () => void;
    resetUpdateState: () => void;
    
    // Computed values
    isProfileComplete: boolean;
    hasProfile: boolean;
}

// Default state
const defaultState: UseDeveloperProfileState = {
    userProfile: null,
    developerProfile: null,
    isLoading: false,
    isUpdating: false,
    error: null,
    updateError: null,
    isUpdated: false,
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
    const getDeveloperProfile = useCallback(async (userId: string): Promise<void> => {
        if (!userId) {
            setState(prev => ({
                ...prev,
                error: 'User ID is required',
                isLoading: false,
            }));
            return;
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

    return {
        // State
        ...state,
        
        // Actions
        getDeveloperProfile,
        updateDeveloperProfile,
        updateUserProfile,
        updateUserAvatar,
        refreshProfile,
        clearErrors,
        resetUpdateState,
        
        // Computed values
        isProfileComplete: isProfileComplete(),
        hasProfile: hasProfile(),
    };
};

export default useDeveloperProfile;
