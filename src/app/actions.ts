
'use server';

import { readDocx, readXlsx } from '@/lib/parsers';

export async function parseFile(fileName: string, fileType: string, fileContent: string): Promise<string> {
    const buffer = Buffer.from(fileContent, 'base64');
    
    if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || fileName.endsWith('.docx')) {
        return readDocx(buffer);
    }
    
    if (fileType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || fileName.endsWith('.xlsx')) {
        return readXlsx(buffer);
    }

    if (fileType === 'text/plain' || fileName.endsWith('.txt') || fileType === 'text/csv' || fileName.endsWith('.csv')) {
        return buffer.toString('utf-8');
    }
    
    throw new Error(`Unsupported file type: ${fileType}`);
}
