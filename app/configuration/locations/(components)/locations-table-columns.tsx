"use client"

import { CopyToClipboardButton } from "@/components/copy-button";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { type Location } from "@/lib/locations/types";
import { copyToClipboard } from "@/lib/utils/utils";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { useMemo } from "react";

export function useLocationTableColumns({
  openStream, 
  editLocation,
  deleteLocation
}: {
  openStream: (location: Location) => void, 
  editLocation: (location: Location) => void,
  deleteLocation: (location: Location) => void
}): ColumnDef<Location>[] {
  return useMemo(
    () => ([
      {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => (
          <Link className="hover:underline" href={`/configuration/locations/${row.original.id}`}>
            {row.original.name}
          </Link>
        )
      },
      {
        accessorKey: "id",
        header: "ID",
        cell: ({ getValue }) => (
          <div className="relative group flex items-center space-x-1">
            <span className="inline-block max-w-24 overflow-hidden text-ellipsis text-nowrap">
              {getValue<string>()}
            </span>
            <CopyToClipboardButton valueToCopy={getValue<string>()} />
          </div>
        )
      },
      {
        accessorKey: "version",
        header: "Version",
      },
      {
        id: 'actions',
        cell: ({ row }) => {
          const location = row.original; 
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="w-8 h-8 p-0">
                  <span className="sr-only">Open actions</span>
                  <DotsHorizontalIcon className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem
                  onClick={() => copyToClipboard(location.id)}
                >
                  Copy ID
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => editLocation(location)}>Edit</DropdownMenuItem>
                <DropdownMenuItem onClick={() => openStream(location)}>
                  View Stream
                </DropdownMenuItem>
                <DropdownMenuSeparator/>
                <DropdownMenuItem onClick={() => deleteLocation(location)}>
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        }
      }
    ]),
    [openStream, editLocation, deleteLocation]
  );
}
