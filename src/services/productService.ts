import { RedisConfig } from "@/config";
import { IProduct } from "@/models";

export class ProductService {
    static async saveProductsByCategory(category: string, products: IProduct[]): Promise<void> {
        const redisClient = RedisConfig.getInstance();

        await redisClient.del(`category:${category}`);

        const productsJson = products.map(product => JSON.stringify(product));
        await redisClient.rpush(`category:${category}`, ...productsJson);
    }

    static async getProductsByCategory(category: string): Promise<IProduct[]> {
        const redisClient = RedisConfig.getInstance();

        const productsJson = await redisClient.lrange(`category:${category}`, 0, -1);

        return productsJson.map(productJson => JSON.parse(productJson));
    }
}