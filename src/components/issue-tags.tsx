import { Badge } from "./ui/badge";
import { Tag } from "lucide-react";

interface IssueTagsProps {
    issues: string[];
}

export function IssueTags({ issues }: IssueTagsProps) {
    if (!issues || issues.length === 0) {
        return (
            <div className="flex h-full min-h-[150px] items-center justify-center rounded-lg border-2 border-dashed border-border/50">
                <p className="text-muted-foreground">No specific issues identified by AI.</p>
            </div>
        );
    }
    return (
        <div className="flex flex-wrap gap-3 pt-2">
            {issues.map((issue, index) => (
                <Badge key={index} variant="secondary" className="px-3 py-1.5 text-sm font-medium transition-all hover:bg-primary/10 hover:text-primary-foreground">
                   <Tag className="mr-2 h-4 w-4"/>
                    {issue}
                </Badge>
            ))}
        </div>
    );
}
