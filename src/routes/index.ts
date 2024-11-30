import { RedisConfig } from "@/config";
import { ProductService } from "@/services";
import { Request, Response, Router } from "express";

const router = Router();

router.get("/test-redis", async (_req, res) => {
    try {
        await RedisConfig.set("test", "Hello World");


        const value = await RedisConfig.get("test");

        res.json({
            message: "Redis test successful",
            value: value
        });
    } catch (error) {
        res.status(500).json({
            error: "Redis connection failed",
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
})

router.get("/api/products/:category", async (req: Request<{ category: string }>, res: Response) => {
    try {
        const { category } = req.params; // Extrai o parâmetro diretamente da URL.



        // Validação não é mais necessária porque o parâmetro é obrigatório.
        const products = await ProductService.getProductsByCategory(category);

        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({
            error: "Failed to fetch products",
            details: error instanceof Error ? error.message : "Unknown error",
        });
    }
})

export default router;