import xlsx from 'xlsx';

export const xlsxReader = {
    readBuffer: (buffer: string | Buffer): { userChunk: Object[], sheetHeader: any } => {

        try {
            const jsonOpts = {
                blankrows: false,
                raw: false,
                dateNF: 'dd"/"mm"/"yyyy'
            }

            const xlsxOut = xlsx.read(buffer, { type: "buffer", cellDates: true, cellText: false }); // converting buffer to xlsx

            const sheetName = xlsxOut.SheetNames[0];
            const sheets = xlsxOut.Sheets[sheetName];
            const sheetJson = xlsx.utils.sheet_to_json(sheets, jsonOpts);
            const sheetHeader = xlsx.utils.sheet_to_json(sheets, { header: 1 })[0];


            return { userChunk: sheetJson, sheetHeader };
        } catch (err) {
            throw new Error(err);
        }
    }
}