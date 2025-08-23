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
        <Card className="bg-primary/5 border-primary/20 shadow-sm hover:shadow-md transition-shadow">
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
                <ul className="space-y-3 pl-5">
                    {suggestionPoints.map((point, index) => (
                        <li key={index} className="relative pl-4 text-base leading-relaxed">
                            <span className="absolute left-0 top-1.5 h-1.5 w-1.5 rounded-full bg-primary/70"></span>
                            {point}
                        </li>
                    ))}
                </ul>
            </CardContent>
        </Card>
    );
}
