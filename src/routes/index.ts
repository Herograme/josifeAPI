import { RedisConfig } from "@/config";
import { IlinkData } from "@/models";
import { ProductService } from "@/services";
import { ExtractDataLinks } from "@/tasks";
import { DataScraper } from "@/tasks/scraperDataLinks";
import { CategorizeProducts } from "@/utils/CategorizeProducts";
import { CheckUser } from "@/utils/CheckUser";
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

type userparam = {
    name: string;
    passworld: string;
}

const checkerror = (status: string, message: string, res: Response) => {
    if (status === "error") {
        res.status(500).json({
            error: "Failed to fetch products",
            details: message,
        });
    }
}

router.post("/secret/update", async (req: Request<{}, {}, userparam>, res) => {
    const datalinks = new Map<string, IlinkData[]>();
    const redisConfig = RedisConfig.getInstance();


    try {
        const userdata = req.body
        //console.log(userdata)
        if (CheckUser(userdata.name, userdata.passworld)) {

            const { data: MagazineData, status, message } = await ExtractDataLinks('magazine');
            //console.log(status, message)
            checkerror(status, message || "", res)

            console.log(MagazineData)
            datalinks.set("Magazine", MagazineData);

            const dataScraper = new DataScraper(datalinks)

            await dataScraper.scrapDataLinks().then((data) => {


                CategorizeProducts(data || []).forEach((products, category) => {
                    redisConfig.set(category, JSON.stringify(products));
                })

                res.status(200).json({
                    message: "Data updated successfully",
                })

            }).catch((error) => {
                res.status(500).json({
                    error: "Failed to data links products",
                    details: error instanceof Error ? error.message : "Unknown error",
                });
            })

        } else {
            res.status(500).json({
                error: "Failed to update products",
                details: "User not found",
            });
        }

    } catch (error) {
        res.status(500).json({
            error: "Failed to data links products",
            details: error instanceof Error ? error.message : "Unknown error",
        });
    }
})

export default router;