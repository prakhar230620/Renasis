import { ChevronDown, Download, FileText, RotateCcw } from "lucide-react";
import type { AnalysisResult } from "@/types";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { SentimentChart } from "./sentiment-chart";
import { IssueTags } from "./issue-tags";
import { AiSuggestions } from "./ai-suggestions";
import { ReviewsTable } from "./reviews-table";
import { Skeleton } from "./ui/skeleton";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { exportToCSV, exportToJSON, exportToPDF, exportToTXT } from "@/lib/export";

interface DashboardProps {
    result: AnalysisResult;
    onReset: () => void;
}

export function Dashboard({ result, onReset }: DashboardProps) {
    const handleExportCSV = () => {
        exportToCSV(result.reviews, result.fileName);
    };

    const handleExportJSON = () => {
        exportToJSON(result, result.fileName);
    };

    const handleExportPDF = () => {
        exportToPDF(result, result.fileName);
    };

    const handleExportTXT = () => {
        exportToTXT(result, result.fileName);
    }
    
    return (
        <div className="space-y-6">
            <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                        <FileText className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Analysis for: {result.fileName}</h2>
                        <p className="text-muted-foreground">{result.reviews.length} reviews analyzed</p>
                    </div>
                </div>
                <div className="flex w-full shrink-0 gap-2 sm:w-auto">
                    <Button variant="outline" onClick={onReset} className="w-1/2 sm:w-auto">
                        <RotateCcw className="mr-2 h-4 w-4" />
                        Analyze Another
                    </Button>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button className="w-1/2 sm:w-auto">
                                <Download className="mr-2 h-4 w-4" />
                                Export
                                <ChevronDown className="ml-2 h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={handleExportPDF}>
                                Export as PDF
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={handleExportCSV}>
                                Export as CSV
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={handleExportJSON}>
                                Export as JSON
                            </DropdownMenuItem>
                             <DropdownMenuItem onClick={handleExportTXT}>
                                Export as TXT
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card className="lg:col-span-1">
                    <CardHeader>
                        <CardTitle>Sentiment Analysis</CardTitle>
                        <CardDescription>Distribution of customer sentiment.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <SentimentChart data={result.sentimentDistribution} />
                    </CardContent>
                </Card>
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Key Issues Identified</CardTitle>
                        <CardDescription>Common topics mentioned in reviews.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <IssueTags issues={result.issues} />
                    </CardContent>
                </Card>
            </div>

            <AiSuggestions suggestions={result.suggestions} />

            <Card>
                <CardHeader>
                    <CardTitle>Processed Reviews</CardTitle>
                    <CardDescription>A detailed view of each analyzed review.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ReviewsTable reviews={result.reviews} />
                </CardContent>
            </Card>
        </div>
    );
}

export const DashboardSkeleton = () => (
    <div className="space-y-6 animate-pulse">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div className="flex items-center gap-3">
                <Skeleton className="h-12 w-12 rounded-lg" />
                <div>
                    <Skeleton className="mb-2 h-7 w-64" />
                    <Skeleton className="h-4 w-32" />
                </div>
            </div>
            <div className="flex w-full shrink-0 gap-2 sm:w-auto">
                 <Skeleton className="h-10 w-1/2 sm:w-44" />
                 <Skeleton className="h-10 w-1/2 sm:w-28" />
            </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="lg:col-span-1">
                <CardHeader>
                    <Skeleton className="h-6 w-40" />
                    <Skeleton className="mt-2 h-4 w-48" />
                </CardHeader>
                <CardContent className="flex h-[250px] items-center justify-center">
                    <Skeleton className="h-40 w-40 rounded-full" />
                </CardContent>
            </Card>
            <Card className="lg:col-span-2">
                <CardHeader>
                     <Skeleton className="h-6 w-48" />
                     <Skeleton className="mt-2 h-4 w-56" />
                </CardHeader>
                <CardContent className="h-[250px] space-y-3 pt-4">
                     <div className="flex flex-wrap gap-2">
                        <Skeleton className="h-8 w-24 rounded-full" />
                        <Skeleton className="h-8 w-32 rounded-full" />
                        <Skeleton className="h-8 w-20 rounded-full" />
                        <Skeleton className="h-8 w-28 rounded-full" />
                        <Skeleton className="h-8 w-36 rounded-full" />
                     </div>
                </CardContent>
            </Card>
        </div>
         <Card>
            <CardHeader>
                <Skeleton className="h-6 w-56" />
                <Skeleton className="mt-2 h-4 w-64" />
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-[90%]" />
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <Skeleton className="h-6 w-40" />
                 <Skeleton className="mt-2 h-4 w-56" />
            </CardHeader>
            <CardContent>
                <Skeleton className="h-40 w-full" />
            </CardContent>
        </Card>
    </div>
);
