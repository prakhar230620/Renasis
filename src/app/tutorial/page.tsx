'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowRight, Key, ExternalLink, Copy, CheckCircle, AlertTriangle, Info } from 'lucide-react';
import Link from 'next/link';

export default function TutorialPage() {
  const [copiedStep, setCopiedStep] = useState<string | null>(null);

  const copyToClipboard = (text: string, step: string) => {
    navigator.clipboard.writeText(text);
    setCopiedStep(step);
    setTimeout(() => setCopiedStep(null), 2000);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Getting Started with Renasis</h1>
        <p className="text-lg text-muted-foreground">
          Learn how to set up and manage your Google AI API keys for customer review analysis
        </p>
      </div>

      <Tabs defaultValue="setup" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="setup">API Setup</TabsTrigger>
          <TabsTrigger value="management">Key Management</TabsTrigger>
          <TabsTrigger value="usage">Using the App</TabsTrigger>
          <TabsTrigger value="troubleshooting">Troubleshooting</TabsTrigger>
        </TabsList>

        <TabsContent value="setup" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="w-5 h-5" />
                Step 1: Get Your Google AI API Key
              </CardTitle>
              <CardDescription>
                Follow these steps to obtain your Google AI API key from Google Cloud Console
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Badge variant="outline" className="mt-1">1</Badge>
                  <div>
                    <p className="font-medium">Visit Google AI Studio</p>
                    <p className="text-sm text-muted-foreground">Go to Google AI Studio to create your API key</p>
                    <Button variant="outline" size="sm" className="mt-2" asChild>
                      <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer">
                        Open Google AI Studio <ExternalLink className="w-4 h-4 ml-1" />
                      </a>
                    </Button>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Badge variant="outline" className="mt-1">2</Badge>
                  <div>
                    <p className="font-medium">Sign in with your Google Account</p>
                    <p className="text-sm text-muted-foreground">Use your Google account to access AI Studio</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Badge variant="outline" className="mt-1">3</Badge>
                  <div>
                    <p className="font-medium">Create API Key</p>
                    <p className="text-sm text-muted-foreground">Click "Create API Key" button</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Badge variant="outline" className="mt-1">4</Badge>
                  <div>
                    <p className="font-medium">Copy Your API Key</p>
                    <p className="text-sm text-muted-foreground">Copy the generated API key (starts with "AIza")</p>
                  </div>
                </div>
              </div>

              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  <strong>Important:</strong> Keep your API key secure and never share it publicly. 
                  Your API key is stored locally on your device and never sent to our servers.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Step 2: Add API Key to Renasis</CardTitle>
              <CardDescription>
                Add your Google AI API key to the app for review analysis
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Badge variant="outline" className="mt-1">1</Badge>
                  <div>
                    <p className="font-medium">Go to the main page</p>
                    <p className="text-sm text-muted-foreground">Navigate to the home page of Renasis</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Badge variant="outline" className="mt-1">2</Badge>
                  <div>
                    <p className="font-medium">Click "Add API Key"</p>
                    <p className="text-sm text-muted-foreground">Find and click the "Add API Key" button</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Badge variant="outline" className="mt-1">3</Badge>
                  <div>
                    <p className="font-medium">Enter key details</p>
                    <p className="text-sm text-muted-foreground">Provide a name for your key and paste the API key</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Badge variant="outline" className="mt-1">4</Badge>
                  <div>
                    <p className="font-medium">Save the key</p>
                    <p className="text-sm text-muted-foreground">Click "Add Key" to save it to your local storage</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="management" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Managing Multiple API Keys</CardTitle>
              <CardDescription>
                Learn how to add, remove, and switch between multiple API keys
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Key Status Indicators</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="default" className="bg-green-500">
                        <CheckCircle className="w-3 h-3 mr-1" />Active
                      </Badge>
                      <span className="text-sm">Currently being used for API calls</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="destructive">
                        <AlertTriangle className="w-3 h-3 mr-1" />Rate Limited
                      </Badge>
                      <span className="text-sm">Temporarily unavailable due to rate limits</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">Inactive</Badge>
                      <span className="text-sm">Available but not currently active</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Adding Multiple Keys</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    You can add multiple API keys to avoid rate limiting issues:
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                    <li>• Create multiple API keys in Google AI Studio</li>
                    <li>• Add each key with a descriptive name</li>
                    <li>• The app will automatically rotate keys when rate limits are hit</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Switching Active Keys</h4>
                  <p className="text-sm text-muted-foreground">
                    Click the "Activate" button next to any inactive key to make it the current active key.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Rate Limit Management</CardTitle>
              <CardDescription>
                Understanding and handling API rate limits
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Google AI API has rate limits. When a key hits its limit, the app will automatically 
                  try to use another available key if you have multiple keys configured.
                </AlertDescription>
              </Alert>

              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold mb-2">What happens when rate limited:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                    <li>• The key is marked as "Rate Limited"</li>
                    <li>• App automatically switches to next available key</li>
                    <li>• You'll see a notification about the rate limit</li>
                    <li>• Rate limited keys become available again after the reset time</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Best Practices:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                    <li>• Add 2-3 API keys for better reliability</li>
                    <li>• Monitor your usage in Google Cloud Console</li>
                    <li>• Remove old or unused keys regularly</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="usage" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Using Renasis for Review Analysis</CardTitle>
              <CardDescription>
                Step-by-step guide to analyzing customer reviews
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Badge variant="outline" className="mt-1">1</Badge>
                  <div>
                    <p className="font-medium">Prepare Your Review Data</p>
                    <p className="text-sm text-muted-foreground">
                      Format your reviews as plain text, one review per line. Optionally include dates in [YYYY-MM-DD] format.
                    </p>
                    <div className="mt-2 p-3 bg-muted rounded-md">
                      <code className="text-sm">
                        [2024-01-15] Great product, fast delivery!<br/>
                        [2024-01-16] Poor quality, disappointed with purchase<br/>
                        Amazing customer service, highly recommend
                      </code>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Badge variant="outline" className="mt-1">2</Badge>
                  <div>
                    <p className="font-medium">Upload Your File</p>
                    <p className="text-sm text-muted-foreground">
                      Drag and drop your text file or click to browse. Supported formats: .txt, .csv, .xlsx, .docx
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Badge variant="outline" className="mt-1">3</Badge>
                  <div>
                    <p className="font-medium">Wait for Analysis</p>
                    <p className="text-sm text-muted-foreground">
                      The app will analyze sentiment, identify issues, and generate business suggestions
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Badge variant="outline" className="mt-1">4</Badge>
                  <div>
                    <p className="font-medium">Review Results</p>
                    <p className="text-sm text-muted-foreground">
                      Explore the dashboard with sentiment analysis, identified issues, and actionable suggestions
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="troubleshooting" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Common Issues & Solutions</CardTitle>
              <CardDescription>
                Troubleshoot common problems with API keys and analysis
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">❌ "Invalid API Key" Error</h4>
                  <p className="text-sm text-muted-foreground mb-2">Solutions:</p>
                  <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                    <li>• Verify the API key starts with "AIza"</li>
                    <li>• Check for extra spaces or characters</li>
                    <li>• Ensure the key is from Google AI Studio, not Google Cloud Console</li>
                    <li>• Try generating a new API key</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">⏱️ "Rate Limit Exceeded" Error</h4>
                  <p className="text-sm text-muted-foreground mb-2">Solutions:</p>
                  <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                    <li>• Add additional API keys to your account</li>
                    <li>• Wait for the rate limit to reset (usually 1 minute)</li>
                    <li>• Check your usage in Google AI Studio</li>
                    <li>• Consider upgrading your Google Cloud billing account</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">🔄 Analysis Taking Too Long</h4>
                  <p className="text-sm text-muted-foreground mb-2">Solutions:</p>
                  <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                    <li>• Check your internet connection</li>
                    <li>• Reduce the number of reviews in your file</li>
                    <li>• Try with a different API key</li>
                    <li>• Refresh the page and try again</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">💾 Keys Not Saving</h4>
                  <p className="text-sm text-muted-foreground mb-2">Solutions:</p>
                  <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                    <li>• Enable local storage in your browser</li>
                    <li>• Clear browser cache and try again</li>
                    <li>• Disable private/incognito mode</li>
                    <li>• Check if browser storage is full</li>
                  </ul>
                </div>
              </div>

              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  <strong>Still having issues?</strong> Your API keys are stored locally and never sent to our servers. 
                  Try clearing your browser's local storage for this site and re-adding your keys.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Managing Old/Expired Keys</CardTitle>
              <CardDescription>
                How to remove old keys from Google AI Studio
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Badge variant="outline" className="mt-1">1</Badge>
                  <div>
                    <p className="font-medium">Visit Google AI Studio</p>
                    <Button variant="outline" size="sm" className="mt-1" asChild>
                      <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer">
                        Open API Key Management <ExternalLink className="w-4 h-4 ml-1" />
                      </a>
                    </Button>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Badge variant="outline" className="mt-1">2</Badge>
                  <div>
                    <p className="font-medium">Find the old key</p>
                    <p className="text-sm text-muted-foreground">Locate the API key you want to remove</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Badge variant="outline" className="mt-1">3</Badge>
                  <div>
                    <p className="font-medium">Delete the key</p>
                    <p className="text-sm text-muted-foreground">Click the delete/trash icon next to the key</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Badge variant="outline" className="mt-1">4</Badge>
                  <div>
                    <p className="font-medium">Remove from Renasis</p>
                    <p className="text-sm text-muted-foreground">Also remove the key from your Renasis key management</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="text-center mt-8">
        <Button asChild size="lg">
          <Link href="/">
            Start Using Renasis <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
