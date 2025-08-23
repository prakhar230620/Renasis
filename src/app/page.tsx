'use client';

import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { mockReviews, mockReviewText } from '@/lib/mock-data';
import type { AnalysisResult, Review, SentimentData } from '@/types';
import { analyzeCustomerSentiment } from '@/ai/flows/analyze-customer-sentiment';
import { identifyCustomerIssues } from '@/ai/flows/identify-customer-issues';
import { generateBusinessSuggestions } from '@/ai/flows/generate-business-suggestions';
import { FileUploader } from '@/components/file-uploader';
import { Dashboard, DashboardSkeleton } from '@/components/dashboard';


export default function Home() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const { toast } = useToast();

  const handleFileUpload = async (file: File) => {
    setIsProcessing(true);
    setAnalysisResult(null);

    try {
      // In a real app, this would involve parsing the uploaded file.
      // Here, we use mock data for demonstration.
      const reviews = mockReviews;
      const allReviewText = mockReviewText;

      const sentimentPromises = reviews.map(review => 
        analyzeCustomerSentiment({ reviewText: review.text })
          .then(result => ({ ...review, sentiment: result.sentiment, confidence: result.confidence }))
          .catch(() => ({ ...review, sentiment: 'neutral', confidence: 0.5 })) // Fallback on error
      );

      const [issuesResult, suggestionsResult, reviewsWithSentiment] = await Promise.all([
        identifyCustomerIssues({ reviews: allReviewText }),
        generateBusinessSuggestions({ reviewAnalysis: allReviewText }),
        Promise.all(sentimentPromises),
      ]);
      
      const sentimentCounts = reviewsWithSentiment.reduce((acc, review) => {
        const sentimentKey = review.sentiment || 'neutral';
        acc[sentimentKey] = (acc[sentimentKey] || 0) + 1;
        return acc;
      }, {} as Record<'positive' | 'negative' | 'neutral', number>);

      const sentimentDistribution: SentimentData[] = [
        { name: 'positive', value: sentimentCounts.positive || 0, color: 'hsl(var(--chart-2))' },
        { name: 'negative', value: sentimentCounts.negative || 0, color: 'hsl(var(--chart-5))' },
        { name: 'neutral', value: sentimentCounts.neutral || 0, color: 'hsl(var(--chart-4))' },
      ];

      setAnalysisResult({
        fileName: file.name,
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
        <FileUploader onFileUpload={handleFileUpload} isProcessing={isProcessing} />
      )}
    </div>
  );
}
