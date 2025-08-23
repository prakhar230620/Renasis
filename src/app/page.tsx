'use client';

import { useEffect, useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import type { AnalysisResult, Review, SentimentData, SuggestionCategory } from '@/types';
import { analyzeCustomerSentiment } from '@/ai/flows/analyze-customer-sentiment';
import { identifyCustomerIssues } from '@/ai/flows/identify-customer-issues';
import { generateBusinessSuggestions } from '@/ai/flows/generate-business-suggestions';
import { FileUploader } from '@/components/file-uploader';
import { Dashboard, DashboardSkeleton } from '@/components/dashboard';

// Helper to parse text and create mock reviews
const parseReviewsFromText = (text: string): Omit<Review, 'sentiment' | 'confidence'>[] => {
  return text.split('\n').filter(line => line.trim().length > 0).map((line, index) => ({
    id: index + 1,
    product: 'Uploaded File',
    user: `User ${index + 1}`,
    date: new Date().toISOString().split('T')[0],
    text: line,
  }));
};

export default function Home() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (analysisResult) {
        e.preventDefault();
        e.returnValue = 'You have an ongoing analysis. Are you sure you want to leave? Your results will be lost.';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [analysisResult]);


  const handleFileText = async (fileName: string, fileText: string) => {
    setIsProcessing(true);
    setAnalysisResult(null);

    try {
      const reviewsToProcess = parseReviewsFromText(fileText);
      const allReviewText = reviewsToProcess.map(r => r.text);
      const combinedReviewText = allReviewText.join('\n');

      const [issuesResult, suggestionsResult, sentimentResult] = await Promise.all([
        identifyCustomerIssues({ reviews: combinedReviewText }),
        generateBusinessSuggestions({ reviewAnalysis: combinedReviewText }),
        analyzeCustomerSentiment({ reviews: allReviewText }),
      ]);

      const reviewsWithSentiment = reviewsToProcess.map(review => {
        const sentimentInfo = sentimentResult.results.find(r => r.reviewText === review.text);
        return {
          ...review,
          sentiment: sentimentInfo?.sentiment || 'neutral',
          confidence: sentimentInfo?.confidence || 0.5,
        };
      });
      
      const sentimentCounts = reviewsWithSentiment.reduce((acc, review) => {
        const sentimentKey = review.sentiment || 'neutral';
        acc[sentimentKey] = (acc[sentimentKey] || 0) + 1;
        return acc;
      }, {} as Record<'positive' | 'negative' | 'neutral', number>);

      const sentimentDistribution: SentimentData[] = [
        { name: 'positive', value: sentimentCounts.positive || 0, color: 'hsl(var(--chart-3))' },
        { name: 'negative', value: sentimentCounts.negative || 0, color: 'hsl(var(--chart-5))' },
        { name: 'neutral', value: sentimentCounts.neutral || 0, color: 'hsl(var(--chart-4))' },
      ];

      setAnalysisResult({
        fileName: fileName,
        reviews: reviewsWithSentiment as Review[],
        sentimentDistribution,
        issues: issuesResult.issues,
        suggestions: suggestionsResult.suggestions,
      });

    } catch (e) {
      console.error(e);
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred during analysis.';
      toast({
        title: 'Analysis Failed',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setAnalysisResult(null);
  };

  return (
    <div className="container mx-auto h-full px-4 py-8 sm:px-6 lg:px-8">
      {isProcessing && <DashboardSkeleton />}
      {!isProcessing && analysisResult && (
        <Dashboard result={analysisResult} onReset={handleReset} />
      )}
      {!isProcessing && !analysisResult && (
        <FileUploader onFileText={handleFileText} isProcessing={isProcessing} />
      )}
    </div>
  );
}
