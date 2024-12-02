import { IProduct, IProductScraped } from "@/models";
import { v4 as uuid } from "uuid";

export const CategorizeProducts = (products: IProductScraped[]): Map<string, IProduct[]> => {
    //console.log("------products-------")
    //console.log(products)
    const categorized = new Map<string, IProductScraped[]>();
    products.forEach((product) => {
        if (product.featured) {
            categorized.set('featured', [...(categorized.get('featured') || []), product]);
        }
        categorized.set(product.category, [...(categorized.get(product.category) || []), product]);
    })
    //console.log("------categorized-------")
    //console.log(categorized)

    const categorizedMappedProducts: Map<string, IProduct[]> = new Map();

    categorized.forEach((products, category) => {
        categorizedMappedProducts.set(category, products.map((product) => {
            return {
                id: uuid(),
                name: product.name,
                price: product.price,
                image_url: product.image,
                category: product.category,
                description: product.description,
                link: product.link,
            }
        }))
    });
    //console.log("------categorizedMappedProducts-------")
    //console.log(categorizedMappedProducts)
    return categorizedMappedProducts;
}