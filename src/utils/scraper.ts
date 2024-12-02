import { IProductScraped } from "@/models";
import puppeteer, { Browser, Page } from "puppeteer";

const userAgents = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.82 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
];

type selectors = {
    productName: string,
    productPrice: string,
    productDescription: string
    productImage: string
};

export const scrapeProduct = async (selectors: selectors, url: string, category: string, featured: boolean): Promise<IProductScraped | undefined> => {
    let browser: Browser | null = null;

    try {
        browser = await puppeteer.launch({
            //executablePath: '/opt/render/.cache/puppeteer/chrome/linux-131.0.6778.85/chrome-linux64/chrome',
            headless: true,
            defaultViewport: null,

            args: [
                //`--proxy-server=${proxyConfig.server}`, 
                //'--ignore-certificate-errors',
            ]
        });

        const page: Page = await browser.newPage();

        const randomUserAgent = userAgents[Math.floor(Math.random() * userAgents.length)] || 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36';
        await page.setUserAgent(randomUserAgent);



        //url = 'https://www.magazineluiza.com.br/smartphone-samsung-galaxy-a15-65-128gb-azul-claro-4g-4gb-ram-cam-tripla-50mp-selfie-13mp-5000mah-dual-chip/p/237216300/te/ga15/';

        await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });

        await page.waitForSelector(selectors.productName, { timeout: 15000 });
        await page.waitForSelector(selectors.productPrice, { timeout: 15000 });
        await page.waitForSelector(selectors.productDescription, { timeout: 15000 });
        await page.waitForSelector(selectors.productImage, { timeout: 15000 });

        const productName: string = await page.$eval(selectors.productName, el => el.textContent || '');
        //console.log('Nome do produto:', productName);

        const productPrice: string = await page.$eval(selectors.productPrice, el => el.textContent || '');
        //console.log('Preço do produto:', productPrice);

        const productDescription: string = await page.$eval(selectors.productDescription, el => el.textContent || '');
        //console.log('Descrição do produto:', productDescription);
        const productImage: string = await page.$eval(selectors.productImage, el => el.getAttribute('src') || '');
        return new Promise((resolve) => {
            resolve({
                name: productName,
                price: productPrice,
                description: productDescription,
                image: productImage,
                category: category,
                link: url,
                featured: featured
            });
        })

    } catch (error) {
        console.error('Erro ao fazer scraping:', (error as Error).message);
        return undefined;
    } finally {
        if (browser) {
            await browser.close();
        }
    }
};