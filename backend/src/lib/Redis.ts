import { createClient } from "redis";
import { logger } from "./logger.js";

type RedisClient = ReturnType<typeof createClient>;

export class RedisManager {
    private static client: RedisClient | null = null;
    private static inMemoryLocks = new Map<string, number>();
    private static inMemorySaveTimes = new Map<string, Map<string, number>>();
    private static isRedisDisabled = false;

    private constructor() {}

    public static async getClient(): Promise<RedisClient | null> {
        if (this.isRedisDisabled) return null;
        if (this.client?.isOpen) {
            return this.client;
        }

        try {
            const client =
                this.client ??
                createClient({
                    url: process.env.REDIS_URL ?? "redis://127.0.0.1:6379",
                    socket: {
                        reconnectStrategy: (retries) => {
                            if (retries > 3) {
                                this.isRedisDisabled = true;
                                return false;
                            }
                            return 1000;
                        },
                    },
                });

            client.on("error", (e) => {
                if (!this.isRedisDisabled) {
                    logger.warn({ err: e.message }, "Redis connection issue, falling back to in-memory cache");
                }
            });

            client.on("ready", () => {
                logger.info("Redis cache connected successfully");
            });

            if (!client.isOpen) {
                await client.connect();
            }
            this.client = client;
            return client;
        } catch {
            this.isRedisDisabled = true;
            return null;
        }
    }

    public static async quit(): Promise<void> {
        if (this.client?.isOpen) {
            await this.client.quit();
        }
        this.client = null;
    }

    public static async acquireLock(
        key: string,
        ttlSeconds = 30,
    ): Promise<boolean> {
        const client = await this.getClient().catch(() => null);
        if (client) {
            try {
                const result = await client.set(key, "1", { NX: true, EX: ttlSeconds });
                return result === "OK";
            } catch {
                // fallback to in-memory
            }
        }

        const now = Date.now();
        const existingExpiresAt = this.inMemoryLocks.get(key);
        if (existingExpiresAt && existingExpiresAt > now) {
            return false;
        }
        this.inMemoryLocks.set(key, now + ttlSeconds * 1000);
        return true;
    }

    public static async releaseLock(key: string): Promise<void> {
        const client = await this.getClient().catch(() => null);
        if (client) {
            try {
                await client.del(key);
                return;
            } catch {
                // fallback
            }
        }
        this.inMemoryLocks.delete(key);
    }

    public static async getOrSetSaveTime(
        key: string,
        id: string,
        cb: () => Promise<void>,
        saveWindow = 5000,
    ) {
        const client = await this.getClient().catch(() => null);
        const now = Date.now();

        if (client) {
            try {
                const lastSaveTime = await client.zScore(key, id);
                if (lastSaveTime != null && now - Number(lastSaveTime) < saveWindow) {
                    return false;
                }
                await cb();
                await client.zAdd(key, [{ score: now, value: id }]);
                return true;
            } catch {
                // fallback
            }
        }

        let map = this.inMemorySaveTimes.get(key);
        if (!map) {
            map = new Map<string, number>();
            this.inMemorySaveTimes.set(key, map);
        }
        const lastSaveTime = map.get(id);
        if (lastSaveTime != null && now - lastSaveTime < saveWindow) {
            return false;
        }
        await cb();
        map.set(id, now);
        return true;
    }
}
