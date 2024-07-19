import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { type Event } from "@/lib/events/types";
import { formatDateString, truncate } from "@/lib/utils/utils";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "../ui/button";

export function useEventsTableColumns({
  viewEvent
}: {
  viewEvent: (event: Event) => void
}): ColumnDef<Event>[] {
  return [
    {
      accessorKey: 'event_id',
      header: 'Event ID',
    },
    {
      accessorKey: 'version_number',
      header: 'Sequence Number'
    },
    {
      accessorKey: 'created_at',
      header: 'Created At',
      cell: ({ getValue }) => (
        formatDateString(getValue() as string)
      )
    },
    {
      accessorKey: 'event_type',
      header: 'Event Type',
      cell: ({ getValue }) => (
        <pre>{getValue() as string}</pre>
      )
    },
    {
      accessorKey: 'event_data',
      header: 'Data',
      cell: ({ getValue }) => (
        <pre>{truncate(JSON.stringify(getValue()), 50)}</pre>
      )
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const event = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="w-8 h-8 p-0">
                <span className="sr-only">Actions</span>
                <DotsHorizontalIcon className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent sideOffset={5}>
              <DropdownMenuItem onClick={() => viewEvent(event)}>View</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      }
    }
  ];
}