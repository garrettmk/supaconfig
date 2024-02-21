"use client";

import { PaginationInput, usePaginationSearchParams, usePaginator } from "@/lib/pagination";
import clsx from "clsx";
import { usePathname, useSearchParams } from "next/navigation";
import React from "react";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "../ui/pagination";

export type UrlPaginatorComponentProps = React.ComponentProps<typeof Pagination> & {
  count: number;
  maxPages?: number;
};

export function UrlPaginatorComponent(props: UrlPaginatorComponentProps) {
  const { count, maxPages = 3, ...rest } = props;
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { offset, limit } = usePaginationSearchParams(searchParams);
  const { 
    currentPage, 
    totalPages, 
    displayedRange, 
    displayPreviousEllipsis, 
    displayNextEllipsis, 
    nextPage, 
    previousPage, 
    gotoPage 
  } = usePaginator({ count, maxPages, offset, limit });

  const toHref = ({ offset = 0, limit = 10 }: PaginationInput) => {
    const pageSearchParams = new URLSearchParams(searchParams);
    pageSearchParams.set('offset', offset.toString());
    pageSearchParams.set('limit', limit.toString());
    
    return pathname + '?' + pageSearchParams.toString();
  }

  return (
    <Pagination {...rest}>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious 
            className={clsx({ 'pointer-events-none opacity-50': currentPage === 1 })} 
            href={toHref(previousPage())}
          />
        </PaginationItem>
        {displayPreviousEllipsis && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}
        {displayedRange.map(page => (
          <PaginationItem key={page}>
            <PaginationLink 
              href={toHref(gotoPage(page))} 
              isActive={currentPage === page}
            >
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}
        {displayNextEllipsis && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}
        <PaginationItem>
          <PaginationNext 
            className={clsx({ 'pointer-events-none opacity-50': currentPage === totalPages })}
            href={toHref(nextPage())}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
