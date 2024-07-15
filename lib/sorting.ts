import { ReadonlyURLSearchParams } from "next/navigation";
import { getFromSearchParams } from "./utils/url";

export type SortingInput = {
  sortKey?: string;
  sortDirection?: 'asc' | 'desc';
};

export type SortingResult = SortingInput;

export function useSortingSearchParams(searchParams: ReadonlyURLSearchParams | Record<string, string>): SortingResult {
  return {
    sortKey: getFromSearchParams(searchParams, 'sortKey'),
    sortDirection: getFromSearchParams(searchParams, 'sortDirection') as 'asc' | 'desc' | undefined
  }
}

export type UseSortingInput = SortingInput;

export function useSorting(input: UseSortingInput) { 
  const sortBy = (sortKey: string) => ({
    sortKey,
    sortDirection: input.sortDirection === 'asc' ? 'desc' : 'asc'
  } as SortingInput);

  const sortDirection = (sortDirection: 'asc' | 'desc') => ({
    ...input,
    sortDirection
  });

  return {
    ...input,
    sortBy,
    sortDirection
  }
}


export type UseSortingUrlsInput = {
  baseUrl?: string;
  searchParams?: Record<string, string>;
  sortingResult?: SortingResult;
}

export function useSortingUrl({
  baseUrl = '',
  searchParams = {},
  sortingResult = {},
}: UseSortingUrlsInput) {
  return (sortKey: string) => {
    const newSearchParams = new URLSearchParams(searchParams);
    if (sortKey) {
      const newSortDirection = sortingResult.sortKey === sortKey 
        ? sortingResult.sortDirection === 'asc' ? 'desc' : 'asc'
        : 'asc';

      newSearchParams.set('sortKey', sortKey);
      newSearchParams.set('sortDirection', newSortDirection);
    }

    return `${baseUrl}?${newSearchParams.toString()}`;
  }
}