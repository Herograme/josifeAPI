import { IlinkData, IProductScraped } from "@/models";
import { delay, scrapeProduct } from "@/utils";

type IlinkDataArray = IlinkData[];

const MagazineLuizaSelectors = {
    productName: '#__next > div > main > section:nth-child(7) > div > h1',
    productPrice: '#__next > div > main > section:nth-child(9) > div.sc-gxoAxl.hIQEMy > div > div > div > div > p',
    productDescription: '#__next > div > main > section:nth-child(6) > div.sc-iGgWBj.hZQAA-D.sc-lkkHPy.ccsMKd > div > div',
    productImage: '#__next > div > main > section:nth-child(8) > div.sc-gxoAxl.dYVFvy > div > div > div.sc-fqkvVR.geBByu > img'
}

const randomTime = [2000, 3000, 4000, 5000];


export class DataScraper {
    private datalinks: Map<string, IlinkDataArray>;
    constructor(datalinks: Map<string, IlinkDataArray>) {
        this.datalinks = datalinks;

    }

    public async scrapDataLinks(): Promise<IProductScraped[] | undefined> {
        //console.log("1")
        //console.log("datalinks:")
        //console.log(this.datalinks)
        const allData: IProductScraped[] = [];
        try {
            const max = this.getMax();
            //console.log(`max:${max}`)
            for (let i = 0; i < max; i++) {
                for (const [key, datalink] of this.datalinks) {
                    //console.log("3")
                    let siteSelectors
                    switch (key) {
                        case "Magazine":
                            siteSelectors = MagazineLuizaSelectors;
                            break;
                        case "Shopee":
                            siteSelectors = MagazineLuizaSelectors;
                            break;
                        default:
                            break;
                    }
                    //console.log("4")
                    if (siteSelectors && datalink[i]) {
                        console.log(`----------datalink[i]:----------`)
                        console.log(datalink[i])
                        const featured = this.CheckFeatured(datalink[i]?.feature);
                        const category = datalink[i]?.category;
                        const link = datalink[i]?.link;
                        await delay(randomTime[Math.floor(Math.random() * randomTime.length)] || 2000)
                        await scrapeProduct(siteSelectors, link || "", category || "", featured).catch((error) => { return error }).then((data: IProductScraped) => {
                            console.log(`data:`)
                            console.log(data)

                            data.price = data.price.replace(/R\$/g, "").replace(/ou/g, "").replace(/ /g, "")
                            allData.push(data)
                        });
                    }

                }
                await delay(randomTime[Math.floor(Math.random() * randomTime.length)] || 2000);
            }
            console.log(`allData:`)
            console.log(allData)
            return allData;
        } catch (error) {
            throw new Error(`error:${error}`);
        }
    }

    private getMax() {
        //console.log("2")
        let max = 0;
        this.datalinks.forEach((datalink, _index, _) => {
            console.log(`datalink.length:${datalink.length}`)
            max = Math.max(max, datalink.length);
        })
        return max;
    }

    private CheckFeatured(featured: string | undefined): boolean {
        if (!featured) {
            return false;
        }
        const featuredLowerd = featured.toLowerCase()
        return featuredLowerd === "sim" ? true : false;
    }

}