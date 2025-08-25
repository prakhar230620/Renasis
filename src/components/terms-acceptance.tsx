'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, ExternalLink } from 'lucide-react';

interface TermsAcceptanceProps {
  onAccept: () => void;
}

const TERMS_ACCEPTANCE_KEY = 'renasis_terms_accepted';

export function TermsAcceptance({ onAccept }: TermsAcceptanceProps) {
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);

  const handleAccept = () => {
    if (termsAccepted && privacyAccepted) {
      localStorage.setItem(TERMS_ACCEPTANCE_KEY, JSON.stringify({
        accepted: true,
        timestamp: new Date().toISOString(),
        version: '1.0'
      }));
      onAccept();
    }
  };

  const canProceed = termsAccepted && privacyAccepted;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <FileText className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">Terms & Conditions</CardTitle>
          <CardDescription>
            Please review and accept our terms to continue using RENASIS
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-muted p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Before you continue:</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• You will provide your own Google AI API keys</li>
              <li>• Your API keys are stored locally on your device</li>
              <li>• We don't store your data or API keys on our servers</li>
              <li>• You're responsible for API usage costs</li>
            </ul>
          </div>

          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <Checkbox 
                id="terms" 
                checked={termsAccepted}
                onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
                className="mt-1"
              />
              <div className="flex-1">
                <label htmlFor="terms" className="text-sm font-medium cursor-pointer">
                  I have read and agree to the{' '}
                  <Link 
                    href="/terms" 
                    target="_blank"
                    className="text-primary hover:underline inline-flex items-center gap-1"
                  >
                    Terms of Service
                    <ExternalLink className="h-3 w-3" />
                  </Link>
                </label>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Checkbox 
                id="privacy" 
                checked={privacyAccepted}
                onCheckedChange={(checked) => setPrivacyAccepted(checked as boolean)}
                className="mt-1"
              />
              <div className="flex-1">
                <label htmlFor="privacy" className="text-sm font-medium cursor-pointer">
                  I have read and agree to the{' '}
                  <Link 
                    href="/privacy" 
                    target="_blank"
                    className="text-primary hover:underline inline-flex items-center gap-1"
                  >
                    Privacy Policy
                    <ExternalLink className="h-3 w-3" />
                  </Link>
                </label>
              </div>
            </div>
          </div>

          <div className="pt-4">
            <Button 
              onClick={handleAccept}
              disabled={!canProceed}
              className="w-full"
              size="lg"
            >
              {canProceed ? 'Accept & Continue' : 'Please accept both terms to continue'}
            </Button>
          </div>

          <p className="text-xs text-muted-foreground text-center">
            By accepting, you confirm that you understand and agree to our terms and privacy policy.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export function checkTermsAcceptance(): boolean {
  if (typeof window === 'undefined') return false;
  
  try {
    const stored = localStorage.getItem(TERMS_ACCEPTANCE_KEY);
    if (!stored) return false;
    
    const acceptance = JSON.parse(stored);
    return acceptance.accepted === true;
  } catch {
    return false;
  }
}
