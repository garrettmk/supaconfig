import { getFromSearchParams } from "@/lib/utils/url";
import { clamp, range } from "@/lib/utils/utils";
import { ReadonlyURLSearchParams } from "next/navigation";

export type PaginationInput = {
  offset?: number;
  limit?: number;
};

export type PaginationResult = {
  count: number;
  offset: number;
  limit: number;
};


export function usePaginationSearchParams(searchParams: ReadonlyURLSearchParams | Record<string, string>) {
  return {
    offset: Number(getFromSearchParams(searchParams, 'offset', '0')),
    limit: Number(getFromSearchParams(searchParams, 'limit', '10'))
  };
}


export type UsePaginatorInput = PaginationInput & {
  count: number;
  maxPages?: number;
};

export function usePaginator(input: UsePaginatorInput) {
  const { count, offset = 0, limit = 10, maxPages = 5 } = input;

  const currentPage = Math.floor(offset / limit) + 1;
  const totalPages = Math.ceil(count / limit);

  const displayedRange = range(
    Math.max(currentPage - Math.floor(maxPages / 2), 1),
    Math.min(currentPage + Math.floor(maxPages / 2), totalPages)
  );

  const displayPreviousEllipsis = displayedRange[0] > 2;
  const displayNextEllipsis = displayedRange[displayedRange.length - 1] < totalPages - 1;

  const nextPage = () => ({
    offset: clamp(0, offset + limit, count),
    limit
  });

  const previousPage = () => ({
    offset: clamp(0, offset - limit, count),
    limit
  });

  const gotoPage = (page: number) => ({
    offset: (clamp(1, page, totalPages) - 1) * limit,
    limit
  });

  return {
    currentPage,
    totalPages,
    displayedRange,
    displayPreviousEllipsis,
    displayNextEllipsis,
    nextPage,
    previousPage,
    gotoPage,
  };
}