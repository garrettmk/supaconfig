'use client'

import { useSearchParams } from 'next/navigation';
import { useRouter } from 'nextjs-toploader/app';
import { parseAsString, type SearchParamParserFn } from './search-params';
import React from 'react';
import { makeUrl } from './url';

export type SearchParamSerializerFn<T> = (value: T | undefined) => string | undefined;

export type UseQueryStateOptions<T> = {
  serializer?: SearchParamSerializerFn<T>;
};

export type UseQueryStateResult<T> = [
  value: T | undefined,
  setter: (value: T | undefined) => void
];

export function useQueryState(key: string, options?: UseQueryStateOptions<string>): UseQueryStateResult<string>;
export function useQueryState<T = string>(key: string, parser: SearchParamParserFn<T>, options?: UseQueryStateOptions<T>): UseQueryStateResult<T>;
export function useQueryState<T = string>(key: string, maybeParserOrOptions?: SearchParamParserFn<T> | UseQueryStateOptions<T>, maybeOptions?: UseQueryStateOptions<T>): UseQueryStateResult<T> {
  const searchParams = useSearchParams();
  const router = useRouter();
  const options = typeof maybeParserOrOptions === 'object' ? maybeParserOrOptions : maybeOptions ?? {};
  const parser = typeof maybeParserOrOptions === 'function' ? maybeParserOrOptions : (parseAsString as SearchParamParserFn<T>);
  const serializer = options.serializer ?? (serializeToString as SearchParamSerializerFn<T>);
  
  const value = searchParams.get(key);
  const parsedValue = parser(value);

  const setter = React.useCallback((value: T | undefined) => {
    const newValue = serializer(value);

    const newUrl = makeUrl({
      searchParams,
      set: { [key]: newValue ?? null }
    });

    router.push(newUrl);
  }, [key, parser, searchParams, router]);

  return [parsedValue, setter] as const;
}

export function serializeToString(value: any): string | undefined {
  if (value === null || value === undefined) {
    return undefined;
  }

  return value + '';
}