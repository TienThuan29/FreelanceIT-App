import dotenv from 'dotenv';

dotenv.config();

export const config = {

    NODE_ENV: process.env.NODE_ENV || 'dev',
    PORT: parseInt(process.env.PORT || '5000', 10),
    SYSTEM_SECRET: process.env.SYSTEM_SECRET || '',

    JWT_SECRET: process.env.JWT_SECRET,
    JWT_ACCESS_TOKEN_EXPIRATION: process.env.JWT_ACCESS_TOKEN_EXPIRATION,
    JWT_REFRESH_TOKEN_EXPIRATION: process.env.JWT_REFRESH_TOKEN_EXPIRATION,
    BCRYPT_SALT_ROUNDS: parseInt(process.env.BCRYPT_SALT_ROUNDS || '12', 10),
    HASHING_SECRET_KEY: process.env.HASHING_SECRET_KEY || '',

    RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
    RATE_LIMIT_MAX_REQUESTS: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
    CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3000',

    // aws
    AWS_REGION: process.env.AWS_REGION || '',
    AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID || '',
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY || '',
    DYNAMODB_TABLE_PREFIX: process.env.DYNAMODB_TABLE_PREFIX || '',
    S3_BUCKET_NAME: process.env.S3_BUCKET_NAME || '',

    // log
    LOG_LEVEL: process.env.LOG_LEVEL || 'debug',
    LOG_FILE_MAX_SIZE: process.env.LOG_FILE_MAX_SIZE || '20m',
    LOG_FILE_MAX_FILES: process.env.LOG_FILE_MAX_FILES || '14d',

    // tables
    USER_TABLE: process.env.USER_TABLE || '',
    DEVELOPER_PROFILE_TABLE: process.env.DEVELOPER_PROFILE_TABLE || '',
    CUSTOMER_PROFILE_TABLE: process.env.CUSTOMER_PROFILE_TABLE || '',
    PROJECT_TABLE: process.env.PROJECT_TABLE || '',
    PROJECT_TYPE_TABLE: process.env.PROJECT_TYPE_TABLE || '',
    PROJECT_TEAM_TABLE: process.env.PROJECT_TEAM_TABLE || '',
    APPLICATION_TABLE: process.env.APPLICATION_TABLE || '',
    FILE_TABLE: process.env.FILE_TABLE || '',
    USERS_PROJECTS_TABLE: process.env.USERS_PROJECTS_TABLE || '',
    CHATBOT_SESSION_TABLE: process.env.CHATBOT_SESSION_TABLE || '',
    LOG_TABLE: process.env.LOG_TABLE || '',
    CONVERSATION_TABLE: process.env.CONVERSATION_TABLE || '',
    MESSAGE_TABLE: process.env.MESSAGE_TABLE || '',
    PLANNING_TABLE: process.env.PLANNING_TABLE || '',
    USER_PLANNING_TABLE: process.env.USER_PLANNING_TABLE || '',
    PROJECT_FILE_TABLE: process.env.PROJECT_FILE_TABLE || '',

    // redis
    REDIS_HOST: process.env.REDIS_HOST || 'localhost',
    REDIS_PORT: parseInt(process.env.REDIS_PORT || '6379', 10),
    REDIS_PASSWORD: process.env.REDIS_PASSWORD || '',
    REDIS_DB: parseInt(process.env.REDIS_DB || '0', 10),

    // email
    SMTP_HOST: process.env.SMTP_HOST || 'smtp.gmail.com',
    SMTP_PORT: parseInt(process.env.SMTP_PORT || '587', 10),
    SMTP_SECURE: process.env.SMTP_SECURE === 'true',
    SMTP_USER: process.env.SMTP_USER || '',
    SMTP_PASSWORD: process.env.SMTP_PASSWORD || '',
    EMAIL_FROM: process.env.EMAIL_FROM || '',
    EMAIL_FROM_NAME: process.env.EMAIL_FROM_NAME || 'FreelanceIT',

    // google client oauth2
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || '',
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || '',

    // pinecone vector database
    PINECONE_API_KEY: process.env.PINECONE_API_KEY || '',
    PINECONE_HOST_URL: process.env.PINECONE_HOST_URL || '',
    PINECONE_INDEX_NAME: process.env.PINECONE_INDEX_NAME || '',

    // google gemini ai
    GEMINI_API_KEY: process.env.GEMINI_API_KEY || '',
    GEMINI_EMBEDDING_MODEL: process.env.GEMINI_EMBEDDING_MODEL || 'gemini-embedding-001',

    // n8n chatbot
    N8N_WEBHOOK_URL: process.env.N8N_WEBHOOK_URL || 'http://localhost:5678/webhook/4091fa09-fb9a-4039-9411-7104d213f601/chat',

    // planning
    PLANNING_TABLE: process.env.PLANNING_TABLE || 'plannings',
    USER_PLANNING_TABLE: process.env.USER_PLANNING_TABLE || 'user-plannings',

} as const;