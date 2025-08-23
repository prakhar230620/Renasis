
'use server';

import { read, utils } from 'xlsx';
import mammoth from 'mammoth';

export async function readDocx(buffer: Buffer): Promise<string> {
    try {
        const result = await mammoth.extractRawText({ buffer });
        return result.value;
    } catch (error) {
        console.error("Error reading docx file with mammoth", error);
        throw new Error('Failed to parse DOCX file.');
    }
}

export async function readXlsx(buffer: Buffer): Promise<string> {
    try {
        const workbook = read(buffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = utils.sheet_to_json(worksheet, { header: 1 });
        return json.map(row => (row as any[]).join(',')).join('\n');
    } catch (error) {
        console.error("Error reading xlsx file", error);
        throw new Error('Failed to parse XLSX file.');
    }
}
