import pdf  from "pdf-parse";
import * as fs from "fs";
import * as https from "https";

export async function readPdf(url: string): Promise<string> {
    const pdfBuffer = await downloadFile(url);
    const data = await pdf(pdfBuffer);
    return data.text;
}

export async function readTextFile(url: string): Promise<string> {
    const textBuffer = await downloadFile(url);
    return textBuffer.toString();
}

function downloadFile(url: string): Promise<Buffer> {
    return new Promise((resolve, reject) => {
        const tempFilePath = 'temp'; 
        const file = fs.createWriteStream(tempFilePath);
        
        https.get(url, (response) => {
            response.pipe(file);
            file.on('finish', () => {
                file.close(); 
                const fileBuffer = fs.readFileSync(tempFilePath);
                fs.unlinkSync(tempFilePath);
                resolve(fileBuffer);
            });
        }).on('error', (err) => {
            fs.unlinkSync(tempFilePath);
            reject(err.message);
        });
    });
}