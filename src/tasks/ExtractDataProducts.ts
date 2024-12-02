import { GoogleSheets } from "@/config";
import { IlinkData } from "@/models";
import { GoogleSpreadsheetWorksheet } from "google-spreadsheet";

enum Status {
    SUCCESS = "success",
    ERROR = "error"
}

enum SheetName {
    'shopee' = 0,
    'magazine' = 1,
}

export const ExtractDataLinks = async (sheetName: string): Promise<{ data: IlinkData[]; status: Status; message: string | undefined }> => {
    try {
        const googleSheets = GoogleSheets.getInstance();
        //await googleSheets.getInfo();
        const sheetIndex = SheetName[sheetName as keyof typeof SheetName];
        const products: GoogleSpreadsheetWorksheet = await googleSheets.getSheetByIndex(sheetIndex).catch((error) => { return error });

        if (!products) {
            return { data: [], status: Status.ERROR, message: `Sheet not found` };
        }
        //console.log(products)

        const dataRows = await googleSheets.getRows(products).catch((error) => { return error });

        const data = googleSheets.mapRows(dataRows);
        return { data, status: Status.SUCCESS, message: undefined };
    } catch (error) {
        return { data: [], status: Status.ERROR, message: `error:${error}` };
    }
}

