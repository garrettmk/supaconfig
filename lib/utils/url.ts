import { ReadonlyURLSearchParams } from "next/navigation";

export function getFromSearchParams(searchParams: URLSearchParams | ReadonlyURLSearchParams | Record<string, string>, key: string, defaultValue?: string) {
  return searchParams instanceof URLSearchParams || searchParams instanceof ReadonlyURLSearchParams
    ? searchParams.get(key) ?? defaultValue
    : searchParams[key] ?? defaultValue;
}