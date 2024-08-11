import { LinkButton } from "@/app/(components)/link-button";
import { Table, TableBody, TableCell, TableHead, TableRow } from "@/app/(components)/table";
import { makeUrl } from "@/app/(lib)/utils/url";
import { formatDateString } from "@/app/(lib)/utils/utils";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@radix-ui/react-collapsible";
import { CaretSortIcon, ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import clsx from "clsx";
import { getAggregate } from "../(lib)/actions";
import { AggregateWithUsers } from "../(lib)/types";

export type AggregateDetailsProps = React.ComponentProps<'div'> & {
  aggregateId: AggregateWithUsers['id'];
  version?: number
};

export async function AggregateDetails(props: AggregateDetailsProps) {
  const { aggregateId, version, className, ...divProps } = props;
  const aggregate = await getAggregate({ aggregateId, version });
  const latestAggregate = await getAggregate({ aggregateId });

  const previousVersionUrl = aggregate.version_number > 0 ? makeUrl({
    set: { version: aggregate.version_number - 1 },
  }) : undefined;

  const nextVersionUrl = aggregate.version_number < latestAggregate.version_number ? makeUrl({
    set: { version: aggregate.version_number + 1 }
  }) : undefined;

  return (
    <div className={clsx('rounded-md border', className)} {...divProps}>
      <Table>
        <TableBody>
          <TableRow>
            <TableHead>
              Status
            </TableHead>
            <TableCell>
              {aggregate.status}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableHead>
              Aggregate ID
            </TableHead>
            <TableCell>
              {aggregate.id}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableHead>
              Aggregate Type
            </TableHead>
            <TableCell>
              {aggregate.type}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableHead>
              Version Number
            </TableHead>
            <TableCell className="flex flex-row gap-2 items-center">
              <LinkButton 
                href={previousVersionUrl}
                variant="secondary"
                size="icon"
                className="w-6 h-6"
              >
                <ChevronLeftIcon/>
              </LinkButton>
              {aggregate.version_number} of {latestAggregate.version_number}
              <LinkButton
                href={nextVersionUrl}
                variant="secondary"
                size="icon"
                className="w-6 h-6"
              >
                <ChevronRightIcon/>
              </LinkButton>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableHead>
              Created
            </TableHead>
            <TableCell>
              {aggregate.created_by ? (
                `${formatDateString(aggregate.created_at)} by ${aggregate.created_by.name}`
              ) : (
                formatDateString(aggregate.created_at)
              )}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableHead>
              Updated
            </TableHead>
            <TableCell>
              {aggregate.updated_by ? (
                `${formatDateString(aggregate.updated_at)} by ${aggregate.updated_by.name}`
              ) : (
                formatDateString(aggregate.updated_at)
              )}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <Collapsible>
        <CollapsibleTrigger 
          className="block w-full px-2 py-2 text-left text-sm text-muted-foreground font-medium border-t transition-colors hover:bg-muted/50"
        >
          View Data
          <CaretSortIcon className="ml-3 mb-1 inline-block"/>
        </CollapsibleTrigger>
        <CollapsibleContent className="text-sm px-2 py-2">
          <pre>
            {JSON.stringify(aggregate.data, null, 2)}
          </pre>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}