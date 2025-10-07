export const Api = {

    BASE_API: process.env.NEXT_PUBLIC_BASE_API || 'http://localhost:5000',
    SOCKET_URL: process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000',

    Auth: {
        LOGIN: '/api/v1/auth/authenticate',
        SIGNUP: '/api/v1/auth/register',
        VERIFY_CODE: '/api/v1/auth/verify-code',
        REFRESH_TOKEN: '/api/v1/auth/refresh-token',
        GET_PROFILE: '/api/v1/auth/profile',
    },

    Chat: {
        CONVERSATIONS: '/api/v1/chat/conversations',
        MESSAGES: '/api/v1/chat/conversations',
        MARK_READ: '/api/v1/chat/messages/read',
    },

    
}