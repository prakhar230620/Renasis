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

function formatSuggestions(suggestions: SuggestionCategory[]): string {
    return suggestions.map(category => {
        const points = category.points.map(p => `  - ${p}`).join('\n');
        return `${category.title}:\n${points}`;
    }).join('\n\n');
}

function generateTextContent(analysisResult: AnalysisResult): string {
  let content = `Analysis for: ${analysisResult.fileName}\n`;
  content += `Total Reviews: ${analysisResult.reviews.length}\n\n`;

  content += '--- Sentiment Distribution ---\n';
  analysisResult.sentimentDistribution.forEach(d => {
    content += `${d.name}: ${d.value}\n`;
  });
  content += '\n';

  content += '--- Key Issues Identified ---\n';
  analysisResult.issues.forEach(issue => {
    content += `- ${issue}\n`;
  });
  content += '\n';
  
  content += '--- AI Suggestions ---\n';
  content += `${formatSuggestions(analysisResult.suggestions)}\n\n`;

  content += '--- Processed Reviews ---\n';
  analysisResult.reviews.forEach(review => {
    content += `ID: ${review.id}, Product: ${review.product}, User: ${review.user}, Date: ${review.date}, Sentiment: ${review.sentiment}\n`;
    content += `Review: ${review.text}\n\n`;
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

    doc.setFontSize(18);
    doc.text(`Analysis Report for ${analysisResult.fileName}`, margin, y);
    y += 10;

    doc.setFontSize(12);
    const textContent = generateTextContent(analysisResult);
    const splitText = doc.splitTextToSize(textContent, doc.internal.pageSize.width - margin * 2);
    
    for (let i = 0; i < splitText.length; i++) {
        if (y > pageHeight - margin) {
            doc.addPage();
            y = margin;
        }
        doc.text(splitText[i], margin, y);
        y += 7; // line height
    }
    
    doc.save(`${getBaseName(fileName)}_analysis.pdf`);
}


export function exportToTXT(analysisResult: AnalysisResult, fileName: string) {
    const textContent = generateTextContent(analysisResult);
    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8;' });
    downloadFile(blob, `${getBaseName(fileName)}_analysis.txt`);
}
