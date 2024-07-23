import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { type Event } from "@/lib/events/types";
import { formatDateString } from "@/lib/utils/utils";
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
      accessorKey: 'created_by',
      header: 'Created By',
      cell: ({ getValue }) => (
        (getValue() as any)?.name
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
      id: 'event_data',
      header: 'Data',
      cell: ({ row }) => (
        <Button variant="secondary" onClick={() => viewEvent(row.original)}>
          View Data
        </Button>
      )
    },
  ];
}