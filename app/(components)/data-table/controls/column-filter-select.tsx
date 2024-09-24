'use client';

import { Button } from "@/app/(components)/button";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/app/(components)/select";
import { useQueryState } from '@/app/(lib)/utils/use-query-state';
import { Cross2Icon } from "@radix-ui/react-icons";
import React from "react";

export type ColumnFilterSelectProps = Omit<React.ComponentProps<typeof Select>, 'value' | 'onValueChange' | 'children'> & {
  placeholder?: string;
  columnKey: string;
  options: { value: string, label: string }[];
};

export function ColumnFilterSelect(props: ColumnFilterSelectProps) {
  const {
    columnKey,
    options,
    placeholder = 'Any',
    ...rest
  } = props;
  const [filterValue = '*', setFilterValue] = useQueryState(columnKey);
  const selectedLabel = options.find(option => option.value === filterValue)?.label;

  const onValueChange = (value: string) => {
    const shouldDelete = value === '*';
    if (shouldDelete)
      setFilterValue(undefined);
    else
      setFilterValue(value);
  }

  const clearFilterValue: React.MouseEventHandler<HTMLButtonElement> = (event) => {
    event.stopPropagation();
    setFilterValue(undefined);
  }

  return (
    <Select
      value={filterValue ?? ''}
      onValueChange={onValueChange}
      {...rest}
    >
      <div className="flex flex-row rounded-md focus-within:ring-1 focus-within:ring-ring ring-offset-background">
        <SelectTrigger className="rounded-r-none">
          {selectedLabel ? selectedLabel : (
            <span className="text-muted-foreground">
              {placeholder}
            </span>
          )}
        </SelectTrigger>
        <Button
          className="flex-none w-9 rounded-l-none border-l-0 text-muted-foreground"
          variant="outline"
          size="icon"
          onClick={clearFilterValue}
        >
          <Cross2Icon />
        </Button>
      </div>
      <SelectContent>
        <SelectItem value="*">
          Any
        </SelectItem>
        <div className="border-b border-foreground/10 my-1" />
        {options.map(option => (
          <SelectItem
            key={option.value}
            value={option.value}
          >
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}