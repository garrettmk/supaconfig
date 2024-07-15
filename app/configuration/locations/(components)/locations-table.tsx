import { CopyToClipboardButton } from "@/components/copy-button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { type Location } from "@/lib/locations/types";
import Link from "next/link";

export type LocationsTableProps = React.ComponentProps<typeof Table> & {
  locations?: Location[];
  sortByNameUrl?: string;
  sortByIdUrl?: string;
  sortByVersionUrl?: string;
};

export function LocationsTable(props: LocationsTableProps) {
  const {
    locations = [], 
    sortByNameUrl, 
    sortByIdUrl, 
    sortByVersionUrl, 
    ...tableProps
  } = props;

  return (
    <Table {...tableProps}>
      <TableHeader>
        <TableRow>
          <TableHead>
            {sortByNameUrl ? (
              <Link className="hover:underline" href={sortByNameUrl}>
                Name
              </Link>
            ) : (
              "Name"
            )}
          </TableHead>
          <TableHead>
            {sortByIdUrl ? (
              <Link className="hover:underline" href={sortByIdUrl}>
                ID
              </Link>
            ) : (
              "ID"
            )}
          </TableHead>
          <TableHead>
            {sortByVersionUrl ? (
              <Link className="hover:underline" href={sortByVersionUrl}>
                Version
              </Link>
            ) : (
              "Version"
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
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}