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
import { ScrollArea } from "./ui/scroll-area";

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
        <ScrollArea className="h-[400px] w-full rounded-md border">
            <Table>
                <TableHeader className="sticky top-0 bg-card z-10">
                    <TableRow className="hover:bg-muted/50">
                        <TableHead className="whitespace-nowrap">Product</TableHead>
                        <TableHead className="whitespace-nowrap">User</TableHead>
                        <TableHead>Review Text</TableHead>
                        <TableHead className="text-center whitespace-nowrap">Sentiment</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {reviews.length > 0 ? (
                        reviews.map((review) => (
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
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                                No reviews to display.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </ScrollArea>
    );
}
