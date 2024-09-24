import { ReadonlyURLSearchParams } from "next/navigation";

export type MakeUrlInput = {
  baseUrl?: string;
  searchParams?: Record<string, string> | URLSearchParams | ReadonlyURLSearchParams;
  set?: Record<string, string | number | null>;
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
    if (value === null)
      newSearchParams.delete(key);
    else
      newSearchParams.set(key, value + '');
  }

  for (const key of deleteValues) {
    newSearchParams.delete(key);
  }

  return `${baseUrl}?${newSearchParams.toString()}`;
}