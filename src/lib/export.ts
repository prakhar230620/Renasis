import type { AnalysisResult, Review, SuggestionCategory } from '@/types';
import jsPDF from 'jspdf';

function convertToCSV(data: Review[]): string {
  if (!data || data.length === 0) {
    return '';
  }

  const headers: (keyof Review)[] = ['id', 'product', 'user', 'date', 'text', 'sentiment', 'confidence'];
  const csvRows = [headers.join(',')];

  for (const row of data) {
    const values = headers.map(header => {
      const value = row[header];
      const escaped = ('' + value).replace(/"/g, '""');
      return `"${escaped}"`;
    });
    csvRows.push(values.join(','));
  }
  return csvRows.join('\n');
}

function formatSuggestionsForText(suggestions: SuggestionCategory[]): string {
    return suggestions.map(category => {
        const points = category.points.map(p => `  • ${p}`).join('\n');
        return `${category.title}:\n${points}`;
    }).join('\n\n');
}

function generateTextContent(analysisResult: AnalysisResult): string {
  const { fileName, reviews, sentimentDistribution, issues, suggestions } = analysisResult;
  const totalReviews = reviews.length;
  const sentimentCounts = sentimentDistribution.reduce((acc, curr) => {
      acc[curr.name as 'positive' | 'negative' | 'neutral'] = curr.value;
      return acc;
  }, {} as Record<'positive' | 'negative' | 'neutral', number>);

  let content = `==================================================\n`;
  content += `    Analysis Report for: ${fileName}\n`;
  content += `==================================================\n\n`;

  content += `I. EXECUTIVE SUMMARY\n`;
  content += `--------------------------------------------------\n`;
  content += `Total Reviews Analyzed: ${totalReviews}\n`;
  content += `\n`;
  content += `Sentiment Overview:\n`;
  content += `  - Positive: ${sentimentCounts.positive || 0} (${totalReviews > 0 ? ((sentimentCounts.positive || 0) / totalReviews * 100).toFixed(1) : 0}%)\n`;
  content += `  - Negative: ${sentimentCounts.negative || 0} (${totalReviews > 0 ? ((sentimentCounts.negative || 0) / totalReviews * 100).toFixed(1) : 0}%)\n`;
  content += `  - Neutral:  ${sentimentCounts.neutral || 0} (${totalReviews > 0 ? ((sentimentCounts.neutral || 0) / totalReviews * 100).toFixed(1) : 0}%)\n\n`;
  
  content += `\nII. KEY ISSUES IDENTIFIED\n`;
  content += `--------------------------------------------------\n`;
  if (issues.length > 0) {
    issues.forEach(issue => {
      content += `• ${issue}\n`;
    });
  } else {
    content += `No specific issues were identified from the reviews.\n`;
  }
  content += `\n`;

  content += `\nIII. AI-POWERED SUGGESTIONS\n`;
  content += `--------------------------------------------------\n`;
  if (suggestions.length > 0) {
    content += `${formatSuggestionsForText(suggestions)}\n\n`;
  } else {
    content += `No specific suggestions were generated.\n`;
  }

  content += `\nIV. DETAILED REVIEW DATA\n`;
  content += `--------------------------------------------------\n`;
  reviews.forEach(review => {
    content += `Review ID: ${review.id}\n`;
    content += `User:      ${review.user}\n`;
    content += `Sentiment: ${review.sentiment} (Confidence: ${review.confidence.toFixed(2)})\n`;
    content += `Text:      ${review.text}\n`;
    content += `--------------------------------------------------\n`;
  });

  return content;
}

function downloadFile(blob: Blob, fileName: string) {
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', fileName);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function getBaseName(fileName: string): string {
    return fileName.substring(0, fileName.lastIndexOf('.')) || fileName;
}

export function exportToCSV(reviews: Review[], fileName:string) {
  const csvContent = convertToCSV(reviews);
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  downloadFile(blob, `${getBaseName(fileName)}_analysis.csv`);
}

export function exportToJSON(analysisResult: AnalysisResult, fileName: string) {
    const jsonContent = JSON.stringify(analysisResult, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
    downloadFile(blob, `${getBaseName(fileName)}_analysis.json`);
}

export function exportToPDF(analysisResult: AnalysisResult, fileName: string) {
    const doc = new jsPDF();
    const pageHeight = doc.internal.pageSize.height;
    const margin = 10;
    let y = 20;

    const addText = (text: string, x: number, yPos: number, options?: any) => {
        if (yPos > pageHeight - margin) {
            doc.addPage();
            y = margin;
            return margin;
        }
        doc.text(text, x, yPos, options);
        return yPos;
    }
    
    doc.setFontSize(18);
    y = addText(`Analysis Report`, doc.internal.pageSize.width / 2, y, { align: 'center' });
    y += 8;
    doc.setFontSize(12);
    y = addText(`Source File: ${analysisResult.fileName}`, doc.internal.pageSize.width / 2, y, { align: 'center' });
    y += 15;

    const textContent = generateTextContent(analysisResult);
    const splitText = doc.splitTextToSize(textContent, doc.internal.pageSize.width - margin * 2);
    
    for (let i = 0; i < splitText.length; i++) {
        if (y > pageHeight - margin - 10) { // check for footer space
            doc.addPage();
            y = margin;
        }
        y = addText(splitText[i], margin, y) + 6; // line height
    }
    
    doc.save(`${getBaseName(fileName)}_analysis.pdf`);
}

export function exportToTXT(analysisResult: AnalysisResult, fileName: string) {
    const textContent = generateTextContent(analysisResult);
    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8;' });
    downloadFile(blob, `${getBaseName(fileName)}_analysis.txt`);
}
