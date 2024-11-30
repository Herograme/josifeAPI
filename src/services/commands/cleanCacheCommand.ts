import { RedisConfig } from "@/config";

export class CleanCacheCommand {
    name = 'cleanCache';
    description = 'Clean the Redis cache';

    async execute(): Promise<void> {
        try {
            const redisClient = RedisConfig.getInstance();
            await redisClient.flushdb();
            console.log('✅ Cache limpo com sucesso');
        } catch (error) {
            console.error('❌ Erro ao limpar o cache:', error);
        }
    }
}