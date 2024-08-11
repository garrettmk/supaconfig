import { noop } from "@tanstack/react-table";
import { ReadonlyURLSearchParams } from "next/navigation";

const defaultParser = (value: string | null) => value;

export function parseAsInteger(value: string | null): number | undefined {
  return value === null ? undefined : parseInt(value);
}

parseAsInteger.withDefault = function <T>(defaultValue: T) {
  return (value: string | null) => value === null
    ? defaultValue
    : parseInt(value);
}

export function getFromSearchParams<T = string>(searchParams: URLSearchParams | ReadonlyURLSearchParams | Record<string, string>, key: string, parser?: (value: string | null) => T): T;
export function getFromSearchParams<T = string>(searchParams: URLSearchParams | ReadonlyURLSearchParams | Record<string, string>, key: string, defaultValue?: T): T;
export function getFromSearchParams<T = string>(searchParams: URLSearchParams | ReadonlyURLSearchParams | Record<string, string>, key: string, defaultValueOrParser?: T | ((value: string | null) => T)): T {
  const parser = typeof defaultValueOrParser === 'function' ? defaultValueOrParser as Function : defaultParser;
  const defaultValue = typeof defaultValueOrParser !== 'function' ? defaultValueOrParser : undefined;

  const valueOfSearchParam = searchParams instanceof URLSearchParams || searchParams instanceof ReadonlyURLSearchParams
    ? searchParams.get(key)
    : searchParams[key] ?? null;

  return parser(valueOfSearchParam) ?? defaultValue;
}

export type MakeUrlInput = {
  baseUrl?: string;
  searchParams?: Record<string, string> | URLSearchParams | ReadonlyURLSearchParams;
  set?: Record<string, string | number>;
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
    newSearchParams.set(key, value + '');
  }

  for (const key of deleteValues) {
    newSearchParams.delete(key);
  }

  if (newSearchParams.size)
    return `${baseUrl}?${newSearchParams.toString()}`;
  else
    return baseUrl;
}