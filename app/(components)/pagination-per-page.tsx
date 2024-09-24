import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger } from "./select";
import clsx from "clsx";

export type PaginationPerPageProps = Omit<React.ComponentProps<typeof Select>, 'value' | 'onChange'> & {
  className?: string;
  value?: number;
  onChange?: (value: number) => void;
};

export function PaginationPerPage(props: PaginationPerPageProps) {
  const { className, value, onChange, ...rest } = props;

  return (
    <Select
      value={value + ''}
      onValueChange={(value) => onChange?.(parseInt(value))}
      {...rest}
    >
      <SelectTrigger className={clsx("w-auto px-4 justify-center gap-1", className)}>
        {value}&nbsp;<span className="text-muted-foreground">per page</span>
      </SelectTrigger>
      <SelectContent>
        {[2, 10, 25, 50, 100].map((size) => (
          <SelectItem
            key={size}
            value={size + ''}
          >
            {size}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}