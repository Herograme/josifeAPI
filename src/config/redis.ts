import { Redis } from "ioredis";

class RedisConfig {
    private static instance: Redis;

    public static getInstance(): Redis {
        if (!this.instance) {
            console.log('🔌 Conectando ao Redis');
            console.log('ℹ️ URI:', process.env.REDIS_URI || 'N/A');
            this.instance = new Redis(process.env.REDIS_URI || "", {
                tls: {
                    rejectUnauthorized: false
                },
                maxRetriesPerRequest: 5,
                connectTimeout: 10000,
                retryStrategy(times) {
                    const delay = Math.min(times * 50, 2000);
                    return delay;
                },
            });

            this.instance.on('error', (err) => {
                console.error('❌ Error connecting to redis', err);
            });
        }
        return this.instance;
    }

    public static async set(key: string, value: string) {
        const client = this.getInstance();
        await client.set(key, value);
    }

    public static async get(key: string) {
        const client = this.getInstance();
        return await client.get(key);
    }
}

export default RedisConfig;