"use client";

import { buttonVariants } from "@/components/ui/button";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem } from "@/components/ui/pagination";
import { cn } from "@/lib/utils/cn";
import { UsePaginatorInput, usePaginator } from "@/lib/pagination";
import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import clsx from "clsx";
import React from "react";

export type PaginatorProps = React.ComponentProps<typeof Pagination> & UsePaginatorInput & {
  onUpdate?: (value: Omit<UsePaginatorInput, 'count' | 'maxPages'>) => void;
};

export function Paginator(props: PaginatorProps) {
  const { count, offset, limit, maxPages, onUpdate, ...rest } = props;
  const {
    currentPage,
    totalPages,
    displayedRange,
    displayPreviousEllipsis,
    displayNextEllipsis,
    nextPage,
    previousPage,
    gotoPage
  } = usePaginator({ count, offset, limit, maxPages });

  return (
    <Pagination {...rest}>
      <PaginationContent>
        <PaginationItem
          className={clsx(
            cn("gap-1 pl-2.5", buttonVariants({ variant: 'ghost' })),
            { 'pointer-events-none opacity-50': currentPage === 1 }
          )}
          onClick={() => onUpdate?.(previousPage())}
        >
          <ChevronLeftIcon className="h-4 w-4" />
          <span>Previous</span>
        </PaginationItem>
        {displayPreviousEllipsis && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}
        {displayedRange.map(page => (
          <PaginationItem
            key={page}
            className={clsx(
              { 'pointer-events-none opacity-50': currentPage === page},
              buttonVariants({ variant: currentPage === page ? 'outline' : 'ghost', size: 'icon' }),
            )}
            onClick={() => onUpdate?.(gotoPage(page))}
          >
            {page}
          </PaginationItem>
        ))}
        {displayNextEllipsis && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}
        <PaginationItem
          className={clsx(
            cn("gap-1 pr-2.5", buttonVariants({ variant: 'ghost' })),
            { 'pointer-events-none opacity-50': currentPage === totalPages }
          )}
          onClick={() => onUpdate?.(nextPage())}
        >
          <span>Next</span>
          <ChevronRightIcon className="h-4 w-4" />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}