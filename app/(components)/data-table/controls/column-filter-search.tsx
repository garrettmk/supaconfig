'use client';

import { Button } from "@/app/(components)/button";
import { Input } from "@/app/(components)/input";
import { useQueryState } from "@/app/(lib)/utils/use-query-state";
import { debounce } from "@/app/(lib)/utils/utils";
import { Cross2Icon } from "@radix-ui/react-icons";
import clsx from "clsx";
import React from "react";

export type ColumnFilterSearchProps = Omit<React.ComponentProps<'div'>, 'children'> & {
  placeholder?: string;
  columnKey: string;
};

export function ColumnFilterSearch(props: ColumnFilterSearchProps) {
  const {
    columnKey,
    placeholder = 'Search',
    ...rest
  } = props;

  const [filterValue, setFilterValue] = useQueryState(columnKey);
  const [inputValue, setInputValue] = React.useState(filterValue);
  const debouncedSetFilterValue = React.useMemo(() => debounce(setFilterValue, 500), []);

  React.useEffect(() => {
    setInputValue(filterValue);
  }, [filterValue]);

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const shouldDelete = value === '';
    
    setInputValue(value);

    if (shouldDelete)
      debouncedSetFilterValue(undefined);
    else
      debouncedSetFilterValue(value);
  };

  return (
    <div className={clsx(
      "h-9 flex flex-row items-center",
      "rounded-md border border-input",
      "focus-within:ring-1 focus-within:ring-ring ring-offset-background"
    )} {...rest}>
      <Input
        className="rounded-r-none border-r-0 focus-visible:ring-0"
        value={inputValue ?? ''}
        onChange={onChange}
        placeholder={placeholder}
      />
      <Button 
        className="flex-none w-9 text-muted-foreground border-l border-input rounded-l-none"
        size="icon"
        variant="ghost"
        onClick={() => setFilterValue(undefined)}
      >
        <Cross2Icon />
      </Button>
    </div>
  );
}