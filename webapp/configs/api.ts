export const Api = {

    BASE_API: process.env.NEXT_PUBLIC_BASE_API || 'http://localhost:5000',

    Auth: {
        LOGIN: '/api/v1/auth/authenticate',
        SIGNUP: '/api/v1/auth/register',
        VERIFY_CODE: '/api/v1/auth/verify-code',
        REFRESH_TOKEN: '/api/v1/auth/refresh-token',
        GET_PROFILE: '/api/v1/auth/profile',
        GOOGLE_LOGIN: '/api/v1/auth/google/login',
        GOOGLE_CALLBACK: '/api/v1/auth/google/callback',
        GOOGLE_PROFILE: '/api/v1/auth/google/profile',
        FORGOT_PASSWORD: '/api/v1/auth/forgot-password',
        RESET_PASSWORD: '/api/v1/auth/reset-password',
    },

    Project: {
        // ProjectType endpoints
        CREATE_PROJECT_TYPE: '/api/v1/projects/types/create-project-type',
        GET_PROJECT_TYPES_BY_USER: '/api/v1/projects/types/get-by-user-id',
        GET_PROJECT_TYPE_BY_ID: '/api/v1/projects/types',
        UPDATE_PROJECT_TYPE: '/api/v1/projects/types/update',
        DELETE_PROJECT_TYPE: '/api/v1/projects/types/delete',
        
        // Project endpoints
        CREATE_PROJECT: '/api/v1/projects/create-project',
        GET_PROJECTS_BY_USER: '/api/v1/projects/get-by-user-id',
        GET_PROJECT_BY_ID: '/api/v1/projects/get-by-id',
        UPDATE_PROJECT: '/api/v1/projects/update',
        DELETE_PROJECT: '/api/v1/projects/delete',
        
        // Project team endpoints
        ADD_USER_TO_PROJECT: '/api/v1/projects/team/add-user-to-project',
        REMOVE_USER_FROM_PROJECT: '/api/v1/projects/team/remove-user-from-project',
    },

    Developer: {
        GET_PROFILE: '/api/v1/developers/profile/get',
        UPDATE_PROFILE: '/api/v1/developers/profile/update',
        UPDATE_USER: '/api/v1/developers/user/update',
        UPDATE_AVATAR: '/api/v1/developers/avatar/update',
    },

    
}