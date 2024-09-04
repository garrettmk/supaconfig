'use client';

import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/app/(components)/pagination";
import { PaginationInput, PaginationResult, usePaginationUrls } from "@/app/(lib)/pagination";
import clsx from "clsx";
import { useSearchParams } from "next/navigation";
import React from "react";

export type DataTablePagination = React.ComponentProps<typeof Pagination> & {
  pagination: PaginationResult;
};

export function DataTablePagination(props: DataTablePagination) {
  const { pagination, ... paginationProps} = props;
  const searchParams = useSearchParams();
  const {
    previousPage = '',
    currentPage = '',
    nextPage = '',
    displayedRange,
    displayPreviousEllipsis,
    displayNextEllipsis
  } = usePaginationUrls({ pagination, searchParams });
  
  return (
    <Pagination {...paginationProps}>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious 
            className={clsx({ 'pointer-events-none opacity-50': currentPage === previousPage })} 
            href={previousPage}
          />
        </PaginationItem>
        {displayPreviousEllipsis && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}
        {Object.entries(displayedRange).map(([page, url]) => (
          <PaginationItem key={page}>
            <PaginationLink 
              href={url} 
              isActive={currentPage === url}
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
            className={clsx({ 'pointer-events-none opacity-50': currentPage === nextPage })}
            href={nextPage}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
