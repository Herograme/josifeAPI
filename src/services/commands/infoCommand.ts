import { RedisConfig } from "@/config";
import { IcommandModel } from "./commandModel";

export class InfoCommand implements IcommandModel {
    public name = "info";
    public description = "Display information about the api";

    async execute(): Promise<void> {
        console.log('\n📊  Server information:');
        console.log(`- Memory usage: ${process.memoryUsage().rss / 1024 / 1024} MB`);
        console.log(`- Running Time: ${process.uptime().toFixed(2)} seconds`);

        try {
            const redisClient = RedisConfig.getInstance();
            const redisInfo = await redisClient.info();
            console.log(`\n 📊 Redis information:`);
            console.log(redisInfo.slice(0, 500) + '...');
        } catch (error) {
            console.error('❌ Error getting redis info:', error);
        }
    }
}