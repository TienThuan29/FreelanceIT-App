import Redis from "ioredis";
import { redisClient } from "@/configs/redis";

export class RedisRepository {

    private readonly redisClient: Redis;

    constructor() {
        this.redisClient = redisClient;
    }


    // Save to redis
    public async saveString(key: string, value: string, expiresIn: number): Promise<void> {
        await this.redisClient.set(key, value, 'EX', expiresIn);
    }

    public async saveObject(key: string, value: Record<string, any>, expiresIn: number): Promise<void> {
        await this.redisClient.set(key, JSON.stringify(value), 'EX', expiresIn);
    }

    // Get from redis
    public async getString(key: string): Promise<string | null> {
        return await this.redisClient.get(key);
    }

    public async getObject(key: string): Promise<Record<string, any> | null> {
        const value = await this.redisClient.get(key);
        return value ? JSON.parse(value) : null;
    }

    // Delete from redis
    public async delete(key: string): Promise<void> {
        await this.redisClient.del(key);
    }
}