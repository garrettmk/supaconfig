import { CopyToClipboardButton } from "@/components/copy-button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { type Location } from "@/lib/locations/types";
import { formatDateString } from "@/lib/utils/utils";
import Link from "next/link";

export type LocationsTableProps = React.ComponentProps<typeof Table> & {
  locations?: Location[];
  sortingUrls?: Partial<Record<keyof Location, string>>;
};

export function LocationsTable(props: LocationsTableProps) {
  const {
    locations = [], 
    sortingUrls = {},
    ...tableProps
  } = props;

  return (
    <Table {...tableProps}>
      <TableHeader>
        <TableRow>
          <TableHead>
            {sortingUrls['name'] ? (
              <Link className="hover:underline" href={sortingUrls['name']}>
                Name
              </Link>
            ) : (
              "Name"
            )}
          </TableHead>
          <TableHead>
            {sortingUrls['id'] ? (
              <Link className="hover:underline" href={sortingUrls['id']}>
                ID
              </Link>
            ) : (
              "ID"
            )}
          </TableHead>
          <TableHead>
            {sortingUrls['version'] ? (
              <Link className="hover:underline" href={sortingUrls['version']}>
                Version
              </Link>
            ) : (
              "Version"
            )}
          </TableHead>
          <TableHead>
            {sortingUrls['updated_by'] ? (
              <Link className="hover:underline" href={sortingUrls['updated_by']}>
                Updated By
              </Link>
            ): (
              "Updated By"
            )}
          </TableHead>
          <TableHead>
            {sortingUrls['updated_at'] ? (
              <Link className="hover:underline" href={sortingUrls['updated_at']}>
                Updated At
              </Link>
            ) : (
              "Updated At"
            )}
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {locations.map(location => (
          <TableRow key={location.id}>
            <TableCell>
              <Link className="hover:underline" href={`/configuration/locations/${location.id}`}>
                {location.name}
              </Link>
            </TableCell>
            <TableCell className="group">
              {location.id}
              <CopyToClipboardButton
                className="ml-3 opacity-0 group-hover:opacity-100 transition-opacity"
                valueToCopy={location.id}
              />
            </TableCell>
            <TableCell>
              <Link className="hover:underline" href={`/configuration/locations/${location.id}/events`}>
                {location.version}
              </Link>
            </TableCell>
            <TableCell>
              {(location.updated_by_user as any)?.name}
            </TableCell>
            <TableCell>
              {formatDateString(location.updated_at)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}