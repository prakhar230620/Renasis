import type { AnalysisResult, Review } from '@/types';

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

export function exportToCSV(reviews: Review[], fileName: string) {
  const csvContent = convertToCSV(reviews);
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  const baseName = fileName.substring(0, fileName.lastIndexOf('.')) || fileName;
  link.setAttribute('download', `${baseName}_analysis.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportToJSON(analysisResult: AnalysisResult, fileName: string) {
    const jsonContent = JSON.stringify(analysisResult, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    const baseName = fileName.substring(0, fileName.lastIndexOf('.')) || fileName;
    link.setAttribute('download', `${baseName}_analysis.json`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}
