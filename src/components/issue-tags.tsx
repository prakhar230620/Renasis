import { AlertTriangle } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";

interface IssueTagsProps {
    issues: string[];
}

export function IssueTags({ issues }: IssueTagsProps) {
    if (!issues || issues.length === 0) {
        return (
            <div className="flex h-full min-h-[150px] items-center justify-center rounded-lg border-2 border-dashed border-border/50 bg-background/30">
                <p className="text-muted-foreground">No specific issues identified by AI.</p>
            </div>
        );
    }
    return (
        <ScrollArea className="h-[250px] w-full">
            <div className="mt-4 pr-4">
                <ul className="grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2">
                    {issues.map((issue, index) => (
                        <li key={index} className="flex items-start gap-3">
                            <AlertTriangle className="h-5 w-5 flex-shrink-0 text-yellow-500 mt-0.5" />
                            <span className="text-muted-foreground">{issue}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </ScrollArea>
    );
}
