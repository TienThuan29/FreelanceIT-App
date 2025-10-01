import Redis from 'ioredis';
import { config } from './config';
import logger from '@/libs/logger';

class RedisConnection {
    private static instance: RedisConnection;
    private client: Redis;

    private constructor() {
        this.client = new Redis({
            host: config.REDIS_HOST,
            port: config.REDIS_PORT,
            password: config.REDIS_PASSWORD || undefined,
            db: config.REDIS_DB,
            maxRetriesPerRequest: 3,
            lazyConnect: true,
        });

        this.setupEventHandlers();
    }

    private setupEventHandlers(): void {
        this.client.on('connect', () => {
            logger.info('Redis client connected');
        });

        this.client.on('ready', () => {
            logger.info('Redis client ready');
        });

        this.client.on('error', (error) => {
            logger.error('Redis client error:', error);
        });

        this.client.on('close', () => {
            logger.warn('Redis client connection closed');
        });

        this.client.on('reconnecting', () => {
            logger.info('Redis client reconnecting...');
        });

        this.client.on('end', () => {
            logger.warn('Redis client connection ended');
        });
    }

    public static getInstance(): RedisConnection {
        if (!RedisConnection.instance) {
            RedisConnection.instance = new RedisConnection();
        }
        return RedisConnection.instance;
    }

    public getClient(): Redis {
        return this.client;
    }

    public async connect(): Promise<void> {
        try {
            await this.client.connect();
            logger.info('Successfully connected to Redis');
        } catch (error) {
            logger.error('Failed to connect to Redis:', error);
            throw error;
        }
    }

    public async disconnect(): Promise<void> {
        try {
            await this.client.quit();
            logger.info('Successfully disconnected from Redis');
        } catch (error) {
            logger.error('Error disconnecting from Redis:', error);
            throw error;
        }
    }

    public async ping(): Promise<string> {
        try {
            return await this.client.ping();
        } catch (error) {
            logger.error('Redis ping failed:', error);
            throw error;
        }
    }

    public async isConnected(): Promise<boolean> {
        try {
            await this.client.ping();
            return true;
        } catch (error) {
            return false;
        }
    }
}

export const redisConnection = RedisConnection.getInstance();
export const redisClient = redisConnection.getClient();
export default redisConnection;
