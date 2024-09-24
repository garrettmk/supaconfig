'use client';

import { Button } from "@/app/(components)/button";
import { Input } from "@/app/(components)/input";
import { useQueryState } from "@/app/(lib)/utils/use-query-state";
import { Cross2Icon } from "@radix-ui/react-icons";
import clsx from "clsx";

export type ColumnFilterUUIDProps = {
  columnKey: string;
};

export function ColumnFilterUUID(props: ColumnFilterUUIDProps) {
  const { columnKey } = props;
  const [filterValue, setFilterValue] = useQueryState(columnKey);

  const clearFilterValue = () => {
    setFilterValue(undefined);
  }

  return (
    <div className={clsx(
      "h-9 flex flex-row items-center", 
      "rounded-md border border-input",
      "focus-within:ring-1 focus-within:ring-ring ring-offset-background"
    )}>
      <Input 
        className={clsx(
          "grow shrink px-3 text-sm font-mono border-0 focus-visible:ring-0",
          !filterValue && 'text-muted-foreground'
        )}
        value={filterValue ?? 'Any'}
        readOnly
      />
      <Button
        className="flex-none w-9 text-muted-foreground border-l border-input rounded-l-none"
        variant="ghost"
        size="icon"
        onClick={clearFilterValue}
      >
        <Cross2Icon />
      </Button>
    </div>
  );
}