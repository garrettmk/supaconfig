import { Pagination } from "@/app/(components)/pagination";
import { PaginationPages } from "@/app/(components)/pagination-pages";
import { type Table as ReactTable } from "@tanstack/react-table";

export type DataTablePaginationPagesProps = Omit<React.ComponentProps<typeof Pagination>, 'children'> & {
  table: ReactTable<any>;
};


export function DataTablePaginationPages(props: DataTablePaginationPagesProps) {
  const { table, ...paginationProps } = props;

  const {
    pagination: { pageIndex, pageSize },
  } = table.getState();

  const currentPage = pageIndex + 1;
  const totalPages = table.getPageCount();

  return (
    <PaginationPages
      currentPage={currentPage}
      totalPages={totalPages}
      hasPreviousPage={currentPage > 1}
      hasNextPage={currentPage < totalPages}
      onPreviousPage={table.previousPage}
      onNextPage={table.nextPage}
      onGotoPage={table.setPageIndex}
      {...paginationProps}
    />
  );
}