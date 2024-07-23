import { ReadonlyURLSearchParams } from "next/navigation";
import { getFromSearchParams, makeUrl } from "./utils/url";
import { pick } from "./utils/utils";

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
  keys: string[];
  baseUrl?: string;
  searchParams?: Record<string, string>;
  sortingResult?: SortingResult;
}

export type UseSortingUrlsResult = Record<string, string>;

export function useSortingUrls({
  keys,
  baseUrl = '',
  searchParams = {},
  sortingResult = {},
}: UseSortingUrlsInput): UseSortingUrlsResult {
  return keys.reduce(
    (result, key) => {
      result[key] = makeUrl({
        baseUrl,
        searchParams,
        set: {
          sortKey: key,
          sortDirection: sortingResult.sortKey === key 
            ? sortingResult.sortDirection === 'asc' ? 'desc' : 'asc'
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