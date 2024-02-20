"use client"

import { ColumnDef } from "@tanstack/react-table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { CopyIcon, DotsHorizontalIcon } from "@radix-ui/react-icons";
import { useMemo } from "react";
import { type Location } from "@/types/models";

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
        accessorKey: "id",
        header: "ID",
        cell: ({ getValue }) => (
          <div className="relative group flex items-center space-x-1">
            <span className="inline-block max-w-24 overflow-hidden text-ellipsis text-nowrap">
              {getValue<string>()}
            </span>
              <Button
                variant="secondary"
                size="icon"
                className="opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => navigator.clipboard.writeText(getValue<string>())}
              >
                <CopyIcon className="w-4 h-4" />
              </Button>
          </div>
        )
      },
      {
        accessorKey: "version",
        header: "Version",
      },
      {
        accessorKey: "name",
        header: "Name",
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
                  onClick={() => navigator.clipboard.writeText(location.id!)}
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
