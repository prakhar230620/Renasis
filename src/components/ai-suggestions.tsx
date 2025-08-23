import { Lightbulb } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";

interface AiSuggestionsProps {
    suggestions: string;
}

export function AiSuggestions({ suggestions }: AiSuggestionsProps) {
    const suggestionPoints = suggestions
        .split(/\n-|\* /)
        .map(s => s.trim())
        .filter(s => s.length > 0);

    return (
        <Card className="bg-primary/5 border-primary/20">
            <CardHeader className="flex flex-row items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <Lightbulb className="h-6 w-6 text-primary" />
                </div>
                <div>
                    <CardTitle>AI-Powered Suggestions</CardTitle>
                    <CardDescription>Actionable insights to improve your business.</CardDescription>
                </div>
            </CardHeader>
            <CardContent>
                <ul className="list-disc space-y-2 pl-5">
                    {suggestionPoints.map((point, index) => (
                        <li key={index} className="text-sm leading-relaxed">{point}</li>
                    ))}
                </ul>
            </CardContent>
        </Card>
    );
}
