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
        <div className="space-y-8 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0">
            <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-card shadow-inner-shadow">
                        <FileText className="h-7 w-7 text-primary" />
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Analysis Report</p>
                        <h2 className="text-2xl font-bold tracking-tight">{result.fileName}</h2>
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
                        <DropdownMenuContent align="end" className="bg-background border-border">
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

            <Card className="shadow-lg hover:shadow-primary/20 transition-shadow">
                <CardHeader>
                    <CardTitle>Sentiment Analysis</CardTitle>
                    <CardDescription>Distribution of customer sentiment.</CardDescription>
                </CardHeader>
                <CardContent>
                    <SentimentChart data={result.sentimentDistribution} />
                </CardContent>
            </Card>

            <Card className="shadow-lg hover:shadow-primary/20 transition-shadow">
                <CardHeader>
                    <CardTitle>Key Issues Identified</CardTitle>
                    <CardDescription>Common topics mentioned in reviews.</CardDescription>
                </CardHeader>
                <CardContent>
                    <IssueTags issues={result.issues} />
                </CardContent>
            </Card>

            <AiSuggestions suggestions={result.suggestions} />

            <Card className="shadow-lg hover:shadow-primary/20 transition-shadow">
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
    <div className="space-y-8 animate-pulse">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div className="flex items-center gap-4">
                <Skeleton className="h-14 w-14 rounded-lg" />
                <div>
                    <Skeleton className="h-4 w-24 mb-2" />
                    <Skeleton className="h-7 w-64" />
                </div>
            </div>
            <div className="flex w-full shrink-0 gap-2 sm:w-auto">
                 <Skeleton className="h-10 w-1/2 sm:w-44 rounded-md" />
                 <Skeleton className="h-10 w-1/2 sm:w-32 rounded-md" />
            </div>
        </div>

        <Card>
            <CardHeader>
                <Skeleton className="h-6 w-40" />
                <Skeleton className="mt-2 h-4 w-48" />
            </CardHeader>
            <CardContent className="flex h-[250px] items-center justify-center">
                <Skeleton className="h-44 w-44 rounded-full" />
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                 <Skeleton className="h-6 w-48" />
                 <Skeleton className="mt-2 h-4 w-56" />
            </CardHeader>
            <CardContent className="h-[150px] space-y-3 pt-4">
                 <div className="flex flex-wrap gap-3">
                    <Skeleton className="h-8 w-24 rounded-full" />
                    <Skeleton className="h-8 w-32 rounded-full" />
                    <Skeleton className="h-8 w-20 rounded-full" />
                    <Skeleton className="h-8 w-28 rounded-full" />
                    <Skeleton className="h-8 w-36 rounded-full" />
                    <Skeleton className="h-8 w-24 rounded-full" />
                 </div>
            </CardContent>
        </Card>

         <Card>
            <CardHeader>
                <Skeleton className="h-6 w-56" />
                <Skeleton className="mt-2 h-4 w-64" />
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
                <Skeleton className="h-5 w-full rounded" />
                <Skeleton className="h-5 w-[90%] rounded" />
                <Skeleton className="h-5 w-[95%] rounded" />
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <Skeleton className="h-6 w-40" />
                 <Skeleton className="mt-2 h-4 w-56" />
            </CardHeader>
            <CardContent>
                <Skeleton className="h-48 w-full rounded-md" />
            </CardContent>
        </Card>
    </div>
);
