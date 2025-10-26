export const Api = {

    BASE_API: process.env.NEXT_PUBLIC_BASE_API || 'http://localhost:5000',
    SOCKET_URL: process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000',

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
        GET_ALL_PROJECTS: '/api/v1/projects/get-all',
        GET_ALL_PROJECTS_PUBLIC: '/api/v1/projects/public/get-all',
        GET_PROJECT_BY_ID: '/api/v1/projects/get-by-id',
        GET_PROJECT_BY_ID_PUBLIC: '/api/v1/projects/public/get-by-id',
        UPDATE_PROJECT: '/api/v1/projects/update',
        DELETE_PROJECT: '/api/v1/projects/delete',
        
        // Project team endpoints
        ADD_USER_TO_PROJECT: '/api/v1/projects/team/add-user-to-project',
        REMOVE_USER_FROM_PROJECT: '/api/v1/projects/team/remove-user-from-project',
    },

    Developer: {
        GET_PROFILE: '/api/v1/developers/profile/get',
        GET_LIST: '/api/v1/developers/list',
        UPDATE_PROFILE: '/api/v1/developers/profile/update',
        UPDATE_USER: '/api/v1/developers/user/update',
        UPDATE_AVATAR: '/api/v1/developers/avatar/update',
        // Skill management endpoints
        ADD_SKILL: '/api/v1/developers/skills/add',
        UPDATE_SKILL: '/api/v1/developers/skills/update',
        REMOVE_SKILL: '/api/v1/developers/skills/remove',
        GET_SKILLS: '/api/v1/developers/skills',
    },

    Customer: {
        // Customer Profile endpoints
        CREATE_PROFILE: '/api/v1/customers/profile',
        GET_PROFILE: '/api/v1/customers/profile',
        UPDATE_PROFILE: '/api/v1/customers/profile',
        DELETE_PROFILE: '/api/v1/customers/profile',
        GET_ALL_PROFILES: '/api/v1/customers/profiles',

        // Chatbot endpoints
        SEND_MESSAGE: '/api/v1/customers/chatbot/send-message',
        GET_SESSIONS: '/api/v1/customers/chatbot/get-sessions',
        GET_SESSION: '/api/v1/customers/chatbot/session',
        RENAME_SESSION: '/api/v1/customers/chatbot/session',
        DELETE_SESSION: '/api/v1/customers/chatbot/session',
    },

    Chat: {
        CONVERSATIONS: '/api/v1/chat/conversations',
        MESSAGES: '/api/v1/chat/conversations',
        MARK_READ: '/api/v1/chat/messages/read',
    },

    Application: {
        CREATE: '/api/v1/applications/create',
        GET_BY_PROJECT: '/api/v1/applications/by-project',
        GET_BY_DEVELOPER: '/api/v1/applications/by-developer',
        GET_BY_ID: '/api/v1/applications',
        UPDATE_STATUS: '/api/v1/applications',
        DELETE: '/api/v1/applications',
        CHECK_APPLIED: '/api/v1/applications/check-applied',
    },

    ProjectTeam: {
        GET_MEMBERS: '/api/v1/project-teams/project',
        ADD_MEMBER: '/api/v1/project-teams/project',
        REMOVE_MEMBER: '/api/v1/project-teams/project',
        UPDATE_MEMBER: '/api/v1/project-teams/member',
        GET_MEMBER_BY_ID: '/api/v1/project-teams/member',
        GET_DEVELOPER_PROJECTS: '/api/v1/project-teams/developer/projects',
    },

    File: {
        UPLOAD_PROJECT_FILE: '/api/v1/projects',
        GET_PROJECT_FILES: '/api/v1/projects',
        GET_FILE_BY_ID: '/api/v1/files',
        DELETE_FILE: '/api/v1/files',
    },

    ThirdParty: {
        VietnamAddress: {
            GET_PROVINCES: 'https://production.cas.so/address-kit/2025-07-01/provinces',
            GET_COMMUNES_FROM_PROVINCE: 'https://production.cas.so/address-kit/2025-07-01/provinces/{province_id}/communes',
        }
    },
    Planning: {
        // Public endpoints
        GET_ALL_PLANNINGS: '/api/plannings',
        GET_PLANNING_BY_ID: '/api/plannings',

        // User endpoints
        GET_USER_PLANNINGS: '/api/v1/user/plannings',
        GET_ACTIVE_USER_PLANNING: '/api/v1/user/plannings/active',
        PURCHASE_PLANNING: '/api/v1/plannings/purchase',
        CONFIRM_PAYMENT: '/api/v1/plannings',

        // Admin endpoints
        CREATE_PLANNING: '/api/admin/plannings',
        UPDATE_PLANNING: '/api/admin/plannings',
        DELETE_PLANNING: '/api/admin/plannings',
    },
    Momo: {
        CREATE_PAYMENT: '/api/v1/momo/payment',
        CONFIRM_PAYMENT: '/api/momo/confirm-payment',
        CHECK_STATUS: '/api/v1/payment/momo/status',
        VERIFY_CALLBACK: '/api/v1/payment/momo/verify',
        REFUND: '/api/v1/payment/momo/refund',
    }
}