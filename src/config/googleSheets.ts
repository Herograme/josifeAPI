import { GoogleSpreadsheet, GoogleSpreadsheetRow, GoogleSpreadsheetWorksheet } from "google-spreadsheet";
import { JWT } from "google-auth-library";
import creds from "@/etc/secret/hardy-position-396622-ded3816d62fa.json";
import { IlinkData, IrowData } from "@/models";
;



const SCOPES = [
    'https://www.googleapis.com/auth/spreadsheets',
    'https://www.googleapis.com/auth/drive.file',
];



export default class GoogleSheets {
    private static instance: GoogleSheets;
    private doc: GoogleSpreadsheet;

    private clientemail = creds.client_email;
    private privatekey = creds.private_key;;
    private sheetId = process.env.GOOGLE_SHEET_ID;

    public static getInstance(): GoogleSheets {
        if (!this.instance) {
            this.instance = new GoogleSheets();
        }
        return this.instance;
    }

    private constructor() {
        const auth = new JWT({
            email: this.clientemail,
            key: this.privatekey,
            scopes: SCOPES
        })
        this.doc = new GoogleSpreadsheet(this.sheetId || "", auth);

    }

    public async getInfo() {
        try {
            await this.doc.loadInfo();
            console.log(`Title: ${this.doc.title}, Sheet Count: ${this.doc.sheetCount}`);
        } catch (error) {
            console.error("Error loading Google Sheet:", error);
        }
    }

    public async getSheetByIndex(index: number): Promise<GoogleSpreadsheetWorksheet | undefined> {
        try {
            await this.getInfo()

            return this.doc.sheetsByIndex[index];
        } catch (error) {
            console.error("Error loading Google Sheet:", error);
            return undefined;
        }
    }

    public async getSheetByTitle(title: string): Promise<GoogleSpreadsheetWorksheet | undefined> {
        try {
            await this.doc.loadInfo();
            return this.doc.sheetsByTitle[title];
        } catch (error) {
            console.error("Error loading Google Sheet:", error);
            return undefined;
        }
    }

    public async getRows(sheet: GoogleSpreadsheetWorksheet, options?: { offset?: number, limit?: number }): Promise<GoogleSpreadsheetRow<Record<string, any>>[] | undefined> {
        try {
            return await sheet.getRows(options);
        } catch (error) {
            console.error("Error loading Google Sheet:", error);
            return undefined;
        }
    }

    public mapRows(rows: GoogleSpreadsheetRow<Record<string, IrowData>>[]): IlinkData[] {
        const data: IlinkData[] = [];
        rows.map(row => {
            const { Link, Categoria, Destaque, Status } = row.toObject() as unknown as IrowData;
            if (Link && Categoria && Destaque && Status) {
                data.push({ link: Link, category: Categoria.toLowerCase(), feature: Destaque, status: Status });
            }
        });

        return data;
    }
}
