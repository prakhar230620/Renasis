import type { Review } from "@/types";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge, type BadgeProps } from "./ui/badge";

interface ReviewsTableProps {
    reviews: Review[];
}

export function ReviewsTable({ reviews }: ReviewsTableProps) {
    const getSentimentVariant = (sentiment: Review['sentiment']): BadgeProps['variant'] => {
        switch (sentiment) {
            case 'positive': return 'positive';
            case 'negative': return 'destructive';
            case 'neutral': return 'secondary';
            default: return 'secondary';
        }
    };

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow className="hover:bg-card">
                        <TableHead className="w-[150px]">Product</TableHead>
                        <TableHead className="w-[120px]">User</TableHead>
                        <TableHead>Review Text</TableHead>
                        <TableHead className="w-[150px] text-center">Sentiment</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {reviews.map((review) => (
                        <TableRow key={review.id}>
                            <TableCell className="font-medium text-foreground/90">{review.product}</TableCell>
                            <TableCell className="text-muted-foreground">{review.user}</TableCell>
                            <TableCell className="text-muted-foreground">{review.text}</TableCell>
                            <TableCell className="text-center">
                                <Badge variant={getSentimentVariant(review.sentiment)} className="capitalize">
                                    {review.sentiment}
                                </Badge>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}