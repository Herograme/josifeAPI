import { IProductScraped } from "@/models";

export const CategorizeProducts = (products: IProductScraped[]) => {
    const categorized = new Map<string, IProductScraped[]>();

    products.forEach((product) => {
        if (product.featured) {
            categorized.set('featured', [...(categorized.get('featured') || []), product]);
        }
        categorized.set(product.category, [...(categorized.get(product.category) || []), product]);
    })

    return categorized;
}