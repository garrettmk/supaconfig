import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem } from "@/components/ui/pagination";
import { cn } from '@/lib/cn';
import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import { buttonVariants } from "@/components/ui/button";

export type UrlPaginatorFallbackProps = React.ComponentProps<typeof Pagination>;

export function UrlPaginatorFallback(props: UrlPaginatorFallbackProps) {
  return (
    <Pagination {...props}>
      <PaginationContent>
        <PaginationItem className={cn("gap-1 pl-2.5", buttonVariants({
          variant: "ghost",
        }))}>
          <ChevronLeftIcon className="h-4 w-4" />
          <span>Previous</span>
        </PaginationItem>
        <PaginationItem className={buttonVariants({
          variant: "outline",
          size: 'icon'
        })}>
          1
        </PaginationItem>
        <PaginationItem className={buttonVariants({
          variant: "outline",
          size: 'icon'
        })}>
          2
        </PaginationItem>
        <PaginationItem className={buttonVariants({
          variant: "outline",
          size: 'icon'
        })}>
          3
        </PaginationItem>
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
        <PaginationItem className={cn("gap-1 pr-2.5", buttonVariants({
          variant: "ghost",
        }))}>
          <span>Next</span>
          <ChevronRightIcon className="h-4 w-4" />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}