'use client';

import React, { JSXElementConstructor } from 'react';
import { useQueryState } from "@/app/(lib)/utils/use-query-state";
import { Button } from "@/app/(components)/button";
import clsx from 'clsx';
import { MagnifyingGlassIcon } from '@radix-ui/react-icons';


export type FilterableCellProps<T extends keyof JSX.IntrinsicElements | JSXElementConstructor<any>> = React.ComponentProps<T> & {
  as?: T
  columnKey: string;
  value?: string;
};

export function FilterableCell<T extends keyof JSX.IntrinsicElements | JSXElementConstructor<any> = 'div'>(props: FilterableCellProps<T>) {
  const { as = 'div', columnKey, value, className, children, ...rest } = props;
  const [, setFilterState] = useQueryState(props.columnKey);
  const Component = as;

  return (
    <Component className={clsx('group flex flex-row items-center', className)} {...rest}>
      {children ?? value}
      <Button
        className="ml-2 w-8 h-8 opacity-0 group-hover:opacity-100"
        size="icon"
        variant="ghost"
        onClick={() => setFilterState(value)}
      >
        <MagnifyingGlassIcon/>
      </Button>
    </Component>
  );
}