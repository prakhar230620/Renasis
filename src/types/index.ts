export interface Review {
  id: number;
  product: string;
  user: string;
  date: string;
  text: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  confidence: number;
}

export interface SentimentData {
  name: string;
  value: number;
  color: string;
}

export interface SuggestionCategory {
  title: string;
  points: string[];
}

export interface AnalysisResult {
  fileName: string;
  reviews: Review[];
  sentimentDistribution: SentimentData[];
  issues: string[];
  suggestions: SuggestionCategory[];
}
