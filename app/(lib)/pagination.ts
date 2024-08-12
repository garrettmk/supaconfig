import { makeUrl } from "@/app/(lib)/utils/url";
import { clamp, pick, range } from "@/app/(lib)/utils/utils";
import { ReadonlyURLSearchParams } from "next/navigation";
import { getFromSearchParams, parseAsInteger } from "@/app/(lib)/utils/search-params";

/**
 * Types
 */

export type PaginationInput = {
  offset?: number;
  limit?: number;
};

export type PaginationResult = {
  count: number;
  offset: number;
  limit: number;
};

/**
 * Utils
 */

export function pickPaginationResult<T extends PaginationResult>(input: T): PaginationResult {
  return pick(input, ['count', 'limit', 'offset']) as PaginationResult;
}

/**
 * Process URLSearchParams into a PaginationInput.
 * 
 * @param searchParams 
 * @returns PaginationInput
 */
export function usePaginationSearchParams(searchParams: ReadonlyURLSearchParams | Record<string, string>): PaginationInput {
  return getFromSearchParams(searchParams, {
    offset: parseAsInteger.withDefault(0),
    limit: parseAsInteger.withDefault(10)
  });
}


/**
 * Logic related to pagination.
 */

export type UsePaginationInput = PaginationResult & {
  maxPages?: number;
};

export type UsePaginationResult = {
  currentPage: number;
  totalPages: number;
  displayedRange: number[];
  displayPreviousEllipsis: boolean;
  displayNextEllipsis: boolean;
  nextPage: () => PaginationInput;
  previousPage: () => PaginationInput;
  gotoPage: (page: number) => PaginationInput;
};

export function usePagination(input: UsePaginationInput): UsePaginationResult {
  const { count, offset = 0, limit = 10, maxPages = 5 } = input;

  const currentPage = Math.floor(offset / limit) + 1;
  const totalPages = Math.ceil(count / limit);

  const displayedRange = range(
    Math.max(currentPage - Math.floor(maxPages / 2), 1),
    Math.min(currentPage + Math.floor(maxPages / 2), totalPages)
  );

  const displayPreviousEllipsis = displayedRange[0] >= 2;
  const displayNextEllipsis = displayedRange[displayedRange.length - 1] < totalPages;

  const maxOffset = Math.floor(count / limit) * limit;

  const nextPage = () => ({
    offset: clamp(0, offset + limit, maxOffset),
    limit
  });

  const previousPage = () => ({
    offset: clamp(0, offset - limit, maxOffset),
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


/**
 * URLs for SSR pagination
 */

export type UsePaginationUrlsInput = {
  baseUrl?: string;
  searchParams?: Record<string, string>;
  paginationResult: PaginationResult;
  maxPages?: number;
}

export type UsePaginationUrlsResult = {
  previousPage?: string;
  currentPage?: string;
  nextPage?: string;
  displayedRange: Record<string, string>;
  displayNextEllipsis: boolean;
  displayPreviousEllipsis: boolean;
}

export function usePaginationUrls({
  baseUrl = '',
  searchParams = {},
  paginationResult,
  maxPages = 5
}: UsePaginationUrlsInput): UsePaginationUrlsResult {
  const {
    nextPage, 
    currentPage, 
    previousPage, 
    gotoPage, 
    displayedRange, 
    displayNextEllipsis, 
    displayPreviousEllipsis
  } = usePagination({ ...paginationResult, maxPages });

  const toHref = ({ offset = 0, limit = 10 }: PaginationInput) => makeUrl({
    baseUrl,
    searchParams,
    set: { offset, limit }
  });

  return {
    nextPage: toHref(nextPage()),
    currentPage: toHref(gotoPage(currentPage)),
    previousPage: toHref(previousPage()),
    displayedRange: Object.fromEntries(displayedRange.map(page => [
      page,
      toHref(gotoPage(page))
    ])),
    displayNextEllipsis,
    displayPreviousEllipsis
  };
}