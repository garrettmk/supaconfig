import { ReadonlyURLSearchParams } from "next/navigation";

/**
 * Parses a string value and returns a type T.
 */
export type SearchParamParserFn<T = any, D = T> = (value: string | null) => T | undefined;

/**
 * A group of SearchParamParserFn's organized in an object.
 */
export type SearchParamsParsers<T extends object> = Record<string, SearchParamParserFn>;

/**
 * The result of parsing search params.
 */
export type SearchParamsParsersResult<T extends object, P extends SearchParamsParsers<T>> = {
  [K in keyof P]: ReturnType<P[K]>
};

/**
 * Takes an search params object and a group of parsers, and returns a typed result object.
 * 
 * @param searchParams 
 * @param parsers 
 * @returns 
 */
export function getFromSearchParams<T extends object, P extends SearchParamsParsers<T> = SearchParamsParsers<T>>(searchParams: Record<string, string> | ReadonlyURLSearchParams, parsers: P): SearchParamsParsersResult<T, P> {
  return Object.fromEntries(Object.entries(parsers).map(([key, parser]) => {
    const value = searchParams instanceof URLSearchParams || searchParams instanceof ReadonlyURLSearchParams
      ? searchParams.get(key)
      : searchParams[key];

    return [
      key,
      parser(value ?? null)
    ];
  })) as SearchParamsParsersResult<T, P>;
}


export type BuildableSearchParamParserFn<T> = SearchParamParserFn<T> & {
  withDefault: (defaultValue: T) => SearchParamParserFn<T>;
};

/**
 * Takes a simple parser function (like parseInt) and returns a SearchParamsParserFn. The returned function
 * also has a withDefault property, which returns another SearchParamsParserFn which will return a default
 * value if the input is null.
 * 
 * @param valueParser 
 * @returns 
 */
export function makeSearchParamsParser<T>(valueParser: (value: string) => T): BuildableSearchParamParserFn<T> {
  const parser = (value: string | null) => value === null ? undefined : valueParser(value);
  parser.withDefault = (defaultValue: T) => (value: string | null) => value === null ? defaultValue : valueParser(value);

  return parser;
}

export const parseAsInteger = makeSearchParamsParser(parseInt);
export const parseAsFloat = makeSearchParamsParser(parseFloat);
export const parseAsJson = makeSearchParamsParser(JSON.parse);
export const parseAsString = makeSearchParamsParser(value => value + '');

export function parseAsStringEnum<T extends string[]>(values: [...T]) {
  const parser = (value: string | null) => value === null 
    ? undefined
    : values.includes(value as T[number]) 
      ? value as T[number]
      : undefined;

  parser.withDefault = (defaultValue: T[number]) => (value: string | null) => parser(value) ?? defaultValue;

  return parser;
}