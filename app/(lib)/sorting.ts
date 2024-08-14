import { ReadonlyURLSearchParams } from "next/navigation";
import { getFromSearchParams, parseAsString, parseAsStringEnum } from "@/app/(lib)/utils/search-params";
import { makeUrl } from "@/app/(lib)/utils/url";
import { pick } from "@/app/(lib)/utils/utils";

export type SortingInput = {
  sortKey?: string;
  sortDirection?: 'asc' | 'desc';
};

export type SortingResult = SortingInput;

export function useSortingSearchParams(searchParams: ReadonlyURLSearchParams | Record<string, string>): SortingResult {
  return getFromSearchParams(searchParams, {
    sortKey: parseAsString,
    sortDirection: parseAsStringEnum(['asc', 'desc'])
  });
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
  keys: string[];
  baseUrl?: string;
  searchParams?: Record<string, string>;
  sorting?: SortingResult;
}

export type UseSortingUrlsResult = Record<string, string>;

export function useSortingUrls({
  keys,
  baseUrl = '',
  searchParams = {},
  sorting = {},
}: UseSortingUrlsInput): UseSortingUrlsResult {
  return keys.reduce(
    (result, key) => {
      result[key] = makeUrl({
        baseUrl,
        searchParams,
        set: {
          sortKey: key,
          sortDirection: sorting.sortKey === key 
            ? sorting.sortDirection === 'asc' ? 'desc' : 'asc'
            : 'asc'
        }
      });
      
      return result;
    },
    {} as UseSortingUrlsResult
  );
}


export function pickSortingResult<T extends SortingResult>(input: T): SortingResult {
  return pick(input, ['sortKey', 'sortDirection']);
}