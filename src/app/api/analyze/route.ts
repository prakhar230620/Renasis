import { NextRequest, NextResponse } from 'next/server';
import { AIClient } from '../lib/ai-client';

// Helper function to parse AI response and handle markdown code blocks
function parseAIResponse(text: string) {
  try {
    // Remove markdown code blocks if present
    let cleanText = text.trim();
    if (cleanText.startsWith('```json')) {
      cleanText = cleanText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    } else if (cleanText.startsWith('```')) {
      cleanText = cleanText.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }
    
    return JSON.parse(cleanText);
  } catch (error) {
    console.error('Failed to parse AI response:', text);
    throw new Error(`Invalid JSON response from AI: ${text}`);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { reviews, apiKey } = body;

    if (!reviews || !apiKey) {
      return NextResponse.json(
        { error: 'Reviews and API key are required' },
        { status: 400 }
      );
    }

    const aiClient = AIClient.getInstance();
    const allReviewText = reviews.map((r: any) => r.text);
    const combinedReviewText = allReviewText.join('\n');

    // Define analysis operations
    const analyzeSentiment = async (ai: any) => {
      const prompt = `You are a sentiment analysis expert. Analyze the sentiment of each customer review below. Be accurate and consider the actual emotional tone of each review.

For each review, determine:
- sentiment: "positive" (happy, satisfied, praising), "negative" (unhappy, complaining, criticizing), or "neutral" (factual, mixed feelings)
- confidence: score from 0.1 to 1.0 based on how clear the sentiment is

Return ONLY valid JSON in this exact format:
{
  "results": [
    {
      "reviewText": "exact original review text",
      "sentiment": "positive",
      "confidence": 0.85
    }
  ]
}

Customer Reviews:
${allReviewText.map((text: string, index: number) => `${index + 1}. ${text}`).join('\n')}

Analyze each review carefully and return the JSON response:`;

      const response = await ai.generate({ prompt });
      return parseAIResponse(response.text);
    };

    const identifyIssues = async (ai: any) => {
      const prompt = `Analyze the following customer reviews and identify the key issues or pain points that customers are mentioning. Provide a list of these issues.

Return the response in this exact JSON format:
{
  "issues": ["issue 1", "issue 2", "issue 3"]
}

Reviews: ${combinedReviewText}`;

      const response = await ai.generate({ prompt });
      return parseAIResponse(response.text);
    };

    const generateSuggestions = async (ai: any) => {
      const prompt = `Based on the following analysis of customer reviews, provide actionable business improvements suggestions. Group the suggestions into logical categories.

Return the response in this exact JSON format:
{
  "suggestions": [
    {
      "title": "Category Name",
      "points": ["suggestion 1", "suggestion 2"]
    }
  ]
}

Analysis: ${combinedReviewText}`;

      const response = await ai.generate({ prompt });
      return parseAIResponse(response.text);
    };

    // Run all AI operations in parallel
    const [sentimentResult, issuesResult, suggestionsResult] = await Promise.all([
      aiClient.executeWithRetry(analyzeSentiment, apiKey),
      aiClient.executeWithRetry(identifyIssues, apiKey),
      aiClient.executeWithRetry(generateSuggestions, apiKey),
    ]);

    return NextResponse.json({
      issues: issuesResult.issues || [],
      suggestions: suggestionsResult.suggestions || [],
      sentiment: sentimentResult.results || [],
    });

  } catch (error: any) {
    console.error('Analysis error:', error);
    
    // Check for rate limiting errors
    if (error.message?.includes('quota') || 
        error.message?.includes('rate limit') || 
        error.message?.includes('429')) {
      return NextResponse.json(
        { error: 'Rate limit exceeded', type: 'rate_limit' },
        { status: 429 }
      );
    }
    
    // Check for invalid API key errors
    if (error.message?.includes('API key') || 
        error.message?.includes('authentication') || 
        error.message?.includes('401')) {
      return NextResponse.json(
        { error: 'Invalid API key', type: 'invalid_key' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: 'Analysis failed', type: 'unknown', details: error.message },
      { status: 500 }
    );
  }
}
