import { ReadonlyURLSearchParams } from "next/navigation";
import { getFromSearchParams } from "@/lib/url";


export function usePaginationSearchParams(searchParams: ReadonlyURLSearchParams | Record<string, string>) {
  return {
    offset: Number(getFromSearchParams(searchParams, 'offset', '0')),
    limit: Number(getFromSearchParams(searchParams, 'limit', '10'))
  };
}

