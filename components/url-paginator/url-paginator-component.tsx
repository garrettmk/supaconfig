"use client";

import { usePaginationSearchParams } from "@/lib/pagination";
import { usePathname, useSearchParams } from "next/navigation";
import React from "react";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "../ui/pagination";
import clsx from "clsx";
import { range, clamp } from "@/lib/utils";

export type UrlPaginatorComponentProps = React.ComponentProps<typeof Pagination> & {
  count: number;
  maxPages?: number;
};

export function UrlPaginatorComponent(props: UrlPaginatorComponentProps) {
  const { count, maxPages = 3, ...rest } = props;
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { offset, limit } = usePaginationSearchParams(searchParams);

  const currentPage = Math.floor(offset / limit) + 1;
  const totalPages = Math.ceil(count / limit);

  const pageHref = (page: number) => {
    const pageOffset = (clamp(1, page, totalPages) - 1) * limit;
    const pageSearchParams = new URLSearchParams(searchParams);
    pageSearchParams.set('offset', pageOffset.toString());
    
    return pathname + '?' + pageSearchParams.toString();
  }

  const displayedRange = range(
    Math.max(currentPage - Math.floor(maxPages / 2), 1),
    Math.min(currentPage + Math.floor(maxPages / 2), totalPages)
  );

  const displayPreviousEllipsis = currentPage > Math.ceil(maxPages / 2);
  const displayNextEllipsis = currentPage < totalPages - Math.floor(maxPages / 2);

  return (
    <Pagination {...rest}>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious 
            className={clsx({ 'pointer-events-none opacity-50': currentPage === 1 })} 
            href={pageHref(currentPage - 1)}
          />
        </PaginationItem>
        {displayPreviousEllipsis && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}
        {displayedRange.map(page => (
          <PaginationItem key={page}>
            <PaginationLink href={pageHref(page)} isActive={currentPage === page}>{page}</PaginationLink>
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
            href={pageHref(currentPage + 1)}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
