import { ReadonlyURLSearchParams } from "next/navigation";

export function getFromSearchParams(searchParams: URLSearchParams | ReadonlyURLSearchParams | Record<string, string>, key: string, defaultValue?: string) {
  return searchParams instanceof URLSearchParams || searchParams instanceof ReadonlyURLSearchParams
    ? searchParams.get(key) ?? defaultValue
    : searchParams[key] ?? defaultValue;
}


export type MakeUrlInput = {
  baseUrl?: string;
  searchParams?: Record<string, string>;
  set?: Record<string, string>;
  delete?: string[];
}

export function makeUrl({
  baseUrl = '',
  searchParams = {},
  set = {},
  delete: deleteValues = []
}: MakeUrlInput) {
  const newSearchParams = new URLSearchParams(searchParams);

  for (const [key, value] of Object.entries(set)) {
    newSearchParams.set(key, value);
  }

  for (const key of deleteValues) {
    newSearchParams.delete(key);
  }

  if (newSearchParams.size)
    return `${baseUrl}?${newSearchParams.toString()}`;
  else
    return baseUrl;
}