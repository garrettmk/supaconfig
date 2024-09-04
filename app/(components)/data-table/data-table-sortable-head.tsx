import { TriangleDownIcon, TriangleUpIcon } from "@radix-ui/react-icons";
import { SortDirection } from "@tanstack/react-table";
import { Button } from "../button";
import { TableHead } from "../table";

export type DataTableSortableHeadProps = React.ComponentProps<typeof TableHead> & {
  canSort?: boolean
  isSorted?: false | SortDirection
};

export function DataTableSortableHead(props: DataTableSortableHeadProps) {
  const { canSort, isSorted, children, ...tableProps } = props;
  return (
    <TableHead {...tableProps}>
      {canSort ? (
        <Button
          variant='link'
          className="p-0"
        >
          {children}
          {
            isSorted === 'desc' ? <TriangleDownIcon className="ml-2"/> :
            isSorted === 'asc' ? <TriangleUpIcon className="ml-2"/> :  
            <TriangleUpIcon className="ml-2 opacity-0" />
          }
        </Button>
      ) : children}
    </TableHead>
  );
}