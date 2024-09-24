import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import clsx from "clsx";
import { range } from "@/app/(lib)/utils/utils";
import { Button } from "./button";
import { Pagination, PaginationContent, PaginationItem } from "./pagination";
import { Select, SelectContent, SelectItem, SelectTrigger } from "./select";

export type PaginationPagesProps = Omit<React.ComponentProps<typeof Pagination>, 'children'> & {
  currentPage?: number;
  hasPreviousPage?: boolean;
  hasNextPage?: boolean;
  totalPages?: number;
  onPreviousPage?: React.MouseEventHandler<HTMLButtonElement>;
  onNextPage?: React.MouseEventHandler<HTMLButtonElement>;
  onGotoPage?: (page: number) => void;
};

export function PaginationPages(props: PaginationPagesProps) {
  const {
    className,
    currentPage,
    hasPreviousPage,
    hasNextPage,
    totalPages = 1,
    onPreviousPage,
    onNextPage,
    onGotoPage,
    ...rest
  } = props;

  return (
    <Pagination className={clsx("block", className)} {...rest}>
      <PaginationContent className="h-9 rounded-md border border-input focus-within:ring-1 focus-within:ring-ring ring-offset-background gap-0">
        <PaginationItem>
          <Button
            variant="ghost"
            size="icon"
            className="w-9 rounded-r-none border-r border-input"
            onClick={onPreviousPage}
            disabled={!hasPreviousPage}
          >
            <ChevronLeftIcon />
          </Button>
        </PaginationItem>
        <PaginationItem className="grow shrink text-center">
          <Select
            value={currentPage + ''}
            onValueChange={(value) => onGotoPage?.(parseInt(value) - 1)}
          >
            <SelectTrigger className="justify-center gap-1 border-0 focus:ring-0 text-sm text-muted-foreground">
              Page <span className="text-foreground">{currentPage}</span> of <span className="text-foreground">{totalPages}</span>
            </SelectTrigger>
            <SelectContent>
                {range(1, totalPages).map((page) => (
                  <SelectItem
                    key={page}
                    value={page + ''}
                  >
                    {page}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </PaginationItem>
        <PaginationItem>
          <Button
            variant="ghost"
            size="icon"
            className="w-9 rounded-l-none border-l border-input"
            onClick={onNextPage}
            disabled={!hasNextPage}
          >
            <ChevronRightIcon />
          </Button>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}