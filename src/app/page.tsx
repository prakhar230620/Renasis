'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Upload, FileText, TrendingUp, AlertTriangle, Lightbulb, BarChart3, Key, BookOpen } from 'lucide-react';
import Link from 'next/link';
import { ApiKeyManagerComponent } from '@/components/api-key-manager';
import { ApiKeyManager } from '@/lib/api-key-manager';
import { AnalysisService } from '@/lib/analysis-service';
import { ClientOnly } from '@/components/client-only';
import { TermsAcceptance, checkTermsAcceptance } from '@/components/terms-acceptance';
import { useToast } from '@/hooks/use-toast';
import { FileUploader } from '@/components/file-uploader';
import { Dashboard } from '@/components/dashboard';
import { ApiKeyError } from '@/types/api-keys';

// Import types from shared types file
import { Review, AnalysisResult, SentimentData } from '@/types';

// Helper to parse text and create reviews with better format detection
const parseReviewsFromText = (text: string): Omit<Review, 'sentiment' | 'confidence'>[] => {
  const lines = text.split('\n').filter(line => line.trim().length > 0);
  const reviews: Omit<Review, 'sentiment' | 'confidence'>[] = [];
  
  // For Word documents that are already pre-processed, each line is likely a separate review
  if (lines.length > 0 && lines.every(line => line.length > 10)) {
    lines.forEach((line, index) => {
      const processedReview = processReviewLine(line.trim(), index);
      if (processedReview) {
        reviews.push(processedReview);
      }
    });
    return reviews;
  }
  
  // Try to detect if this is a structured document with multiple reviews
  const isStructuredDoc = lines.some(line => 
    /^\d+[\.\)]\s/.test(line) || // Numbered lists
    /^[•\-\*]\s/.test(line) ||   // Bullet points
    /^(review|customer|feedback)\s*\d*:?\s*/i.test(line) // Review headers
  );
  
  let currentReview = '';
  let reviewCount = 0;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.length === 0) continue;
    
    // Check if this line starts a new review entry
    const isNewReview = isStructuredDoc && (
      /^\d+[\.\)]\s/.test(line) ||
      /^[•\-\*]\s/.test(line) ||
      /^(review|customer|feedback)\s*\d*:?\s*/i.test(line) ||
      (i > 0 && line.length > 50 && !currentReview) // Long line after processing previous
    );
    
    if (isNewReview && currentReview.trim()) {
      // Process the accumulated review
      const processedReview = processReviewLine(currentReview.trim(), reviewCount);
      if (processedReview) {
        reviews.push(processedReview);
        reviewCount++;
      }
      currentReview = '';
    }
    
    // Add current line to review (clean it first)
    let cleanLine = line
      .replace(/^\d+[\.\)]\s*/, '')  // Remove numbering
      .replace(/^[•\-\*]\s*/, '')    // Remove bullets
      .replace(/^(review|customer|feedback)\s*\d*:?\s*/i, '') // Remove headers
      .trim();
    
    if (cleanLine.length > 0) {
      currentReview += (currentReview ? ' ' : '') + cleanLine;
    }
    
    // For unstructured docs, treat each substantial line as a separate review
    if (!isStructuredDoc && cleanLine.length > 10) {
      const processedReview = processReviewLine(cleanLine, reviewCount);
      if (processedReview) {
        reviews.push(processedReview);
        reviewCount++;
      }
      currentReview = '';
    }
  }
  
  // Process any remaining review
  if (currentReview.trim()) {
    const processedReview = processReviewLine(currentReview.trim(), reviewCount);
    if (processedReview) {
      reviews.push(processedReview);
    }
  }
  
  return reviews.filter(review => review.text.length > 5);
};

// Helper function to process individual review lines
function processReviewLine(text: string, index: number): Omit<Review, 'sentiment' | 'confidence'> | null {
  let reviewText = text.trim();
  let extractedDate = new Date().toISOString().split('T')[0];
  let userName = `Customer ${index + 1}`;
  let productName = 'Product Review';
  
  // Extract date in various formats
  const datePatterns = [
    /^\[([^\]]+)\]\s*(.*)$/,  // [date] text
    /^(\d{4}-\d{2}-\d{2})[,\s]+(.*)$/,   // 2024-01-01, text
    /^(\d{1,2}\/\d{1,2}\/\d{4})[,\s]+(.*)$/,  // 12/31/2024, text
    /^(\d{1,2}-\d{1,2}-\d{4})[,\s]+(.*)$/,    // 12-31-2024, text
  ];
  
  for (const pattern of datePatterns) {
    const match = reviewText.match(pattern);
    if (match) {
      extractedDate = match[1];
      reviewText = match[2].trim();
      break;
    }
  }
  
  // Try to extract user/customer info from various patterns
  const userPatterns = [
    /^([A-Za-z\s]{2,30}),\s*(.*)$/,  // "John Doe, great product"
    /by\s+([A-Za-z\s]{2,30})/i,     // "reviewed by John"
    /-\s*([A-Za-z\s]{2,30})$/,      // "great product - John"
    /\(([A-Za-z\s]{2,30})\)\s*(.*)$/,  // "(John Doe) great product"
  ];
  
  for (const pattern of userPatterns) {
    const match = reviewText.match(pattern);
    if (match && match[1].trim().length > 1 && match[1].trim().length < 30) {
      userName = match[1].trim();
      reviewText = (match[2] || reviewText.replace(match[0], '')).trim();
      break;
    }
  }
  
  // Clean up review text
  reviewText = reviewText
    .replace(/^(review|comment|feedback):\s*/i, '')
    .replace(/^\d+[\.\)]\s*/, '')
    .replace(/^[•\-\*]\s*/, '')
    .trim();
  
  if (reviewText.length < 5) return null;
  
  return {
    id: index + 1,
    text: reviewText,
    date: extractedDate,
    product: productName,
    user: userName,
  };
}

export default function Home() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [hasApiKeys, setHasApiKeys] = useState(false);
  const [isFirstTime, setIsFirstTime] = useState(true);
  const [showApiKeyManager, setShowApiKeyManager] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const { toast } = useToast();

  const keyManager = ApiKeyManager.getInstance();
  const analysisService = new AnalysisService();

  useEffect(() => {
    // Set client-side flag to prevent hydration mismatch
    setIsClient(true);
    
    // Check terms acceptance first
    const termsAcceptanceStatus = checkTermsAcceptance();
    setTermsAccepted(termsAcceptanceStatus);
    
    // Check if user has API keys and if it's their first time
    const keys = keyManager.getAllKeys();
    const firstTime = keyManager.isFirstTime();
    console.log('Initial state:', { keys: keys.length, firstTime, showApiKeyManager: keys.length === 0, termsAccepted: termsAcceptanceStatus });
    setHasApiKeys(keys.length > 0);
    setIsFirstTime(firstTime);
    setShowApiKeyManager(keys.length === 0);

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
      
      if (reviewsToProcess.length === 0) {
        toast({
          title: 'No Reviews Found',
          description: 'Could not extract any reviews from the uploaded file. Please check the file format.',
          variant: 'destructive',
        });
        setIsProcessing(false);
        return;
      }
      
      // Use the analysis service instead of direct AI flow calls
      const analysisResponse = await analysisService.analyzeReviews(
        reviewsToProcess.map(review => ({ text: review.text }))
      );
      
      const reviewsWithSentiment = reviewsToProcess.map((review, index) => {
        // Try to match by text first, then by index as fallback
        let sentimentInfo = analysisResponse.sentiment.find((s: any) => 
          s.reviewText && s.reviewText.trim().toLowerCase() === review.text.trim().toLowerCase()
        );
        
        // If no exact match, try by index
        if (!sentimentInfo && analysisResponse.sentiment[index]) {
          sentimentInfo = analysisResponse.sentiment[index];
        }
        
        return {
          ...review,
          sentiment: (sentimentInfo?.sentiment as 'positive' | 'negative' | 'neutral') || 'neutral',
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
        issues: analysisResponse.issues,
        suggestions: analysisResponse.suggestions,
        sentiment: analysisResponse.sentiment as Array<{
          reviewText: string;
          sentiment: 'positive' | 'negative' | 'neutral';
          confidence: number;
        }>,
      });

    } catch (e) {
      console.error(e);
      
      // Handle API key specific errors
      if (e instanceof ApiKeyError) {
        switch (e.type) {
          case 'rate_limit':
            toast({
              title: 'Rate Limit Exceeded',
              description: 'API key rate limit reached. The app has automatically switched to another key if available.',
              variant: 'destructive',
            });
            break;
          case 'invalid_key':
            toast({
              title: 'Invalid API Key',
              description: 'Please check your API key or add a new one.',
              variant: 'destructive',
            });
            setShowApiKeyManager(true);
            break;
          case 'network_error':
            toast({
              title: 'Network Error',
              description: 'Please check your internet connection and try again.',
              variant: 'destructive',
            });
            break;
          default:
            toast({
              title: 'Analysis Failed',
              description: e.message,
              variant: 'destructive',
            });
        }
      } else {
        const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred during analysis.';
        toast({
          title: 'Analysis Failed',
          description: errorMessage,
          variant: 'destructive',
        });
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setAnalysisResult(null);
  };

  const handleApiKeyChange = (hasKeys: boolean) => {
    console.log('handleApiKeyChange called:', hasKeys);
    setHasApiKeys(hasKeys);
    // Don't automatically close the manager when keys are added
    // Let user manually close it with "Continue to Analysis" button
    if (hasKeys) {
      keyManager.resetFirstTime();
      setIsFirstTime(false);
    }
  };

  const handleTermsAccept = () => {
    setTermsAccepted(true);
  };

  // Show terms acceptance screen if not accepted
  if (!termsAccepted) {
    return <TermsAcceptance onAccept={handleTermsAccept} />;
  }

  return (
    <ClientOnly fallback={<div className="container mx-auto h-full px-4 py-8 sm:px-6 lg:px-8"></div>}>
      {/* Show first-time user experience */}
      {isFirstTime && !hasApiKeys ? (
        <div className="container mx-auto h-full px-4 py-8 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold">Welcome to Renasis</h1>
              <p className="text-xl text-muted-foreground mb-8">
                AI-powered customer review analysis to help grow your business
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Key className="w-5 h-5" />
                    Setup Required
                  </CardTitle>
                  <CardDescription>
                    Add your Google AI API key to start analyzing reviews
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    You'll need a Google AI API key to use Renasis. Don't worry - your keys are stored locally on your device and never sent to our servers.
                  </p>
                  <Button onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('Add API Key clicked (first-time) - current state:', { showApiKeyManager, isFirstTime });
                    setShowApiKeyManager(true);
                  }} className="w-full">
                    <Key className="w-4 h-4 mr-2" />
                    Add API Key
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    Need Help?
                  </CardTitle>
                  <CardDescription>
                    Learn how to get your API key and use the app
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Our tutorial will guide you through getting your Google AI API key and using all the features of Renasis.
                  </p>
                  <Button variant="outline" asChild className="w-full">
                    <Link href="/tutorial">
                      <BookOpen className="w-4 h-4 mr-2" />
                      View Tutorial
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>

            {showApiKeyManager && (
              <ApiKeyManagerComponent onKeyChange={handleApiKeyChange} />
            )}
          </div>
        </div>
      ) : (
        <div className="container mx-auto h-full px-4 py-8 sm:px-6 lg:px-8">
          {/* Show API key warning if no keys available */}
          {!hasApiKeys && !showApiKeyManager && (
            <Alert className="mb-6">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>No API keys configured.</strong> You need to add a Google AI API key to analyze reviews.
                <Button 
                  variant="link" 
                  className="p-0 h-auto ml-2" 
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('Add API Key clicked (alert) - current state:', { showApiKeyManager, hasApiKeys });
                    setShowApiKeyManager(true);
                  }}
                >
                  Add API Key
                </Button>
              </AlertDescription>
            </Alert>
          )}

          {/* API Key Manager */}
          {showApiKeyManager && (
            <div className="mb-6">
              <ApiKeyManagerComponent onKeyChange={handleApiKeyChange} />
              {hasApiKeys && (
                <div className="mt-4 text-center">
                  <Button 
                    variant="outline" 
                    onClick={() => setShowApiKeyManager(false)}
                  >
                    Continue to Analysis
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Main Content */}
          {!showApiKeyManager && (
            <>
              {/* Header with API key management button */}
              {hasApiKeys && !analysisResult && !isProcessing && (
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h1 className="text-3xl font-bold">Customer Review Analysis</h1>
                    <p className="text-muted-foreground">Upload your reviews to get AI-powered insights</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" asChild>
                      <Link href="/tutorial">
                        <BookOpen className="w-4 h-4 mr-2" />
                        Tutorial
                      </Link>
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        console.log('Manage Keys clicked - current state:', { showApiKeyManager, hasApiKeys });
                        setShowApiKeyManager(prev => {
                          console.log('setShowApiKeyManager: changing from', prev, 'to true');
                          return true;
                        });
                      }}
                    >
                      <Key className="w-4 h-4 mr-2" />
                      Manage Keys
                    </Button>
                  </div>
                </div>
              )}

              {isProcessing && (
                <div className="flex items-center justify-center p-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  <span className="ml-2">Processing...</span>
                </div>
              )}
              {!isProcessing && analysisResult && (
                <Dashboard result={analysisResult} onReset={handleReset} />
              )}
              {!isProcessing && !analysisResult && hasApiKeys && (
                <FileUploader onFileText={handleFileText} isProcessing={isProcessing} />
              )}
            </>
          )}
        </div>
      )}
    </ClientOnly>
  );
}
