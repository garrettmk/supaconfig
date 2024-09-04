import { PaginationResult } from "@/app/(lib)/pagination";
import { makeUrl } from "@/app/(lib)/utils/url";
import { PaginationState } from "@tanstack/react-table";
import { useSearchParams } from "next/navigation";
import { useRouter } from "nextjs-toploader/app";
import React from "react";

export function useTablePaginationNavigation({ offset = 0, limit = 0 }: PaginationResult) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Build the table pagination state from the search params
  const paginationState: PaginationState = React.useMemo(() => ({
    pageIndex: offset! / limit!,
    pageSize: limit!
  }), [offset, limit]);

  // Update the search params when the table pagination state changes
  const setPagination = React.useCallback((updater: ((pagination: PaginationState) => PaginationState) | PaginationState) => {
    const newPagination = typeof updater === 'function' ? updater(paginationState) : updater;
    const newPaginationInput = {
      offset: newPagination.pageIndex * newPagination.pageSize,
      limit: newPagination.pageSize
    };

    console.log('newPaginationInput', newPaginationInput);

    router.push(makeUrl({
      searchParams,
      set: newPaginationInput
    }));

  }, [router, searchParams]);

  return [paginationState, setPagination] as const;
}