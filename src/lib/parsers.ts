
'use server';

import { read, utils } from 'xlsx';
import mammoth from 'mammoth';

export async function readDocx(buffer: Buffer): Promise<string> {
    try {
        const result = await mammoth.extractRawText({ buffer });
        let text = result.value;
        
        // Clean up the extracted text
        text = text
            .replace(/\r\n/g, '\n')  // Normalize line endings
            .replace(/\r/g, '\n')    // Handle Mac line endings
            .trim();
        
        const lines = text.split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 0);
        
        const formattedLines = [];
        let currentReview = '';
        
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            if (line.length === 0) continue;
            
            // Check if this line starts a new review
            const isNewReviewStart = 
                /^\d+[\.\)]\s/.test(line) ||           // "1. " or "1) "
                /^[•\-\*]\s/.test(line) ||             // Bullet points
                /^Review\s*\d*:?\s*/i.test(line) ||    // "Review 1:"
                /^Customer\s*\d*:?\s*/i.test(line) ||  // "Customer 1:"
                /^Feedback\s*\d*:?\s*/i.test(line) ||  // "Feedback 1:"
                /^\d+\.\s*\w+/.test(line);             // "1. Great product"
            
            if (isNewReviewStart && currentReview.trim()) {
                // Save the previous review
                formattedLines.push(currentReview.trim());
                currentReview = '';
            }
            
            // Clean the current line
            let cleanedLine = line
                .replace(/^\d+[\.\)]\s*/, '')          // Remove numbering
                .replace(/^[•\-\*]\s*/, '')            // Remove bullet points
                .replace(/^Review\s*\d*:?\s*/i, '')    // Remove "Review 1:"
                .replace(/^Customer\s*\d*:?\s*/i, '')  // Remove "Customer 1:"
                .replace(/^Feedback\s*\d*:?\s*/i, '')  // Remove "Feedback:"
                .trim();
            
            // Add to current review if meaningful content
            if (cleanedLine.length > 0) {
                currentReview += (currentReview ? ' ' : '') + cleanedLine;
            }
            
            // For documents without clear structure, treat each substantial line as a review
            if (!isNewReviewStart && cleanedLine.length > 20 && !currentReview.includes(cleanedLine)) {
                if (currentReview.trim()) {
                    formattedLines.push(currentReview.trim());
                }
                currentReview = cleanedLine;
            }
        }
        
        // Add the last review
        if (currentReview.trim()) {
            formattedLines.push(currentReview.trim());
        }
        
        // Filter out very short reviews
        const finalReviews = formattedLines.filter(review => review.length > 10);
        
        return finalReviews.join('\n');
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
        
        // Try to get data with headers first
        const jsonWithHeaders = utils.sheet_to_json(worksheet);
        if (jsonWithHeaders.length > 0) {
            // Convert objects to readable text format
            return jsonWithHeaders.map((row: any) => {
                // Extract review text from common column names
                const reviewText = row['Review'] || row['review'] || row['Comment'] || row['comment'] || 
                                 row['Feedback'] || row['feedback'] || row['Text'] || row['text'] ||
                                 Object.values(row).find(val => typeof val === 'string' && val.length > 10);
                
                // Format with date if available
                const date = row['Date'] || row['date'] || row['Created'] || row['created'];
                if (date && reviewText) {
                    return `[${date}] ${reviewText}`;
                }
                
                return reviewText || Object.values(row).join(' ');
            }).filter(text => text && text.trim().length > 0).join('\n');
        }
        
        // Fallback to raw data
        const json = utils.sheet_to_json(worksheet, { header: 1 });
        return json.map(row => (row as any[]).filter(cell => cell && cell.toString().trim()).join(' ')).join('\n');
    } catch (error) {
        console.error("Error reading xlsx file", error);
        throw new Error('Failed to parse XLSX file.');
    }
}
