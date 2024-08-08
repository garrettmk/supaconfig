import clsx from "clsx";
import React from "react";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/app/(components)/pagination";

export type SsrPaginationProps = React.ComponentProps<typeof Pagination> & {
  maxPages?: number;
  previousPage?: string;
  currentPage?: string;
  nextPage?: string;
  displayPreviousEllipsis?: boolean;
  displayNextEllipsis?: boolean;
  displayedRange?: Record<string, string>;
};

export function SsrPagination(props: SsrPaginationProps) {
  const { 
    maxPages = 5,
    currentPage = 1, 
    previousPage = '',
    nextPage = '',
    displayPreviousEllipsis,
    displayNextEllipsis,
    displayedRange = {},
    ...rest
  } = props;
  
  return (
    <Pagination {...rest}>
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
