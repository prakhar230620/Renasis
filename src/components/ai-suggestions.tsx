import { Lightbulb } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";

interface AiSuggestionsProps {
    suggestions: string;
}

interface SuggestionCategory {
    title: string;
    points: string[];
}

export function AiSuggestions({ suggestions }: AiSuggestionsProps) {
    const parseSuggestions = (text: string): SuggestionCategory[] => {
        const categories: SuggestionCategory[] = [];
        const sections = text.split(/\n\n(?=\*\*)/);

        sections.forEach(section => {
            const lines = section.split('\n').map(l => l.trim()).filter(l => l.length > 0);
            if (lines.length === 0) return;

            const titleMatch = lines[0].match(/\*\*(.*?):\*\*/);
            const title = titleMatch ? titleMatch[1] : 'General Suggestions';

            const points = lines.slice(1).map(line => line.replace(/^\* /, '').trim());

            if (points.length > 0) {
                 categories.push({ title, points });
            }
        });
        return categories;
    };
    
    const suggestionCategories = parseSuggestions(suggestions);

    return (
        <Card className="bg-gradient-to-br from-primary/10 via-transparent to-transparent border-primary/20 shadow-lg hover:shadow-primary/20 transition-shadow">
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
                <Accordion type="multiple" defaultValue={suggestionCategories.map(c => c.title)}>
                    {suggestionCategories.map((category, index) => (
                        <AccordionItem key={index} value={category.title}>
                            <AccordionTrigger className="text-lg font-semibold text-primary/90 hover:text-primary">
                                {category.title}
                            </AccordionTrigger>
                            <AccordionContent>
                                <ul className="space-y-3 pl-5 pt-2">
                                    {category.points.map((point, pIndex) => (
                                        <li key={pIndex} className="relative pl-4 text-base leading-relaxed">
                                            <span className="absolute left-0 top-1.5 h-1.5 w-1.5 rounded-full bg-primary/70"></span>
                                            {point}
                                        </li>
                                    ))}
                                </ul>
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </CardContent>
        </Card>
    );
}
