import { SortingResult } from "@/app/(lib)/sorting";
import { makeUrl } from "@/app/(lib)/utils/url";
import { SortingState } from "@tanstack/react-table";
import { useSearchParams } from "next/navigation";
import { useRouter } from "nextjs-toploader/app";
import React from "react";

export function useTableSortingNavigation({ sortKey, sortDirection }: SortingResult) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Build the table sorting state from the search params
  const sortingState: SortingState = React.useMemo(() => (
    sortKey 
      ? [{
        id: sortKey,
        desc: sortDirection === 'desc'
      }]
      : []
    ), [sortKey, sortDirection]);

  // Update the search params when the table sorting state changes
  const setSorting = React.useCallback((updater: ((sorting: SortingState) => SortingState) | SortingState) => {
    const newSorting = typeof updater === 'function' ? updater(sortingState) : updater;
    const newSortingInput = newSorting.length
      ? {
        sortKey: newSorting[0].id,
        sortDirection: newSorting[0].desc ? 'desc' : 'asc'
      }
      : undefined;
    
    const newUrl = makeUrl({
      searchParams,
      set: newSortingInput,
      delete: newSortingInput 
        ? ['offset', 'limit'] 
        : ['offset', 'limit', 'sortKey', 'sortDirection']
    }) || '?';

    router.push(newUrl);

    return newSorting;
  }, [router, searchParams]);

  return [sortingState, setSorting] as const;
}