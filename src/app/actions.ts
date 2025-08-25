
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

    if (fileType === 'text/csv' || fileName.endsWith('.csv')) {
        return parseCsv(buffer.toString('utf-8'));
    }

    if (fileType === 'text/plain' || fileName.endsWith('.txt')) {
        return buffer.toString('utf-8');
    }
    
    throw new Error(`Unsupported file type: ${fileType}`);
}

function parseCsv(csvText: string): string {
    const lines = csvText.split('\n').filter(line => line.trim());
    if (lines.length === 0) return '';
    
    // Try to detect if first line is header
    const firstLine = lines[0];
    const hasHeader = firstLine.toLowerCase().includes('review') || 
                     firstLine.toLowerCase().includes('comment') || 
                     firstLine.toLowerCase().includes('feedback') ||
                     firstLine.toLowerCase().includes('text');
    
    const dataLines = hasHeader ? lines.slice(1) : lines;
    
    return dataLines.map(line => {
        const columns = line.split(',').map(col => col.trim().replace(/^"|"$/g, ''));
        
        // Find the column that looks like review text (longest text column)
        const reviewColumn = columns.reduce((longest, current) => 
            current.length > longest.length ? current : longest, '');
        
        // Try to find date column
        const dateColumn = columns.find(col => 
            /^\d{4}-\d{2}-\d{2}/.test(col) || /^\d{1,2}\/\d{1,2}\/\d{4}/.test(col));
        
        if (dateColumn && reviewColumn) {
            return `[${dateColumn}] ${reviewColumn}`;
        }
        
        return reviewColumn || columns.join(' ');
    }).filter(text => text.trim().length > 0).join('\n');
}
