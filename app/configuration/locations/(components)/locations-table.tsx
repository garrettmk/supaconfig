"use client";

import { useState } from "react";
import { DataTable } from "@/components/data-table";
import { useLocationTableColumns } from "./locations-table-columns";
import { DeleteLocationDialog } from "./delete-location-dialog";
import { EditLocationDrawer } from "./edit-location-drawer";
import { LocationEventsDrawer } from "./location-events-drawer";
import { type Location } from "@/types/models";

export type LocationsTableProps = {
  locations?: Location[];
};

export function LocationsTable(props: LocationsTableProps) {
  const { locations = [] } = props;
  const [selectedLocation, setSelectedLocation] = useState<Location | undefined>();

  const [isViewingStream, setisViewingStream] = useState(false);
  const openStream = (location: Location) => {
    setSelectedLocation(location);
    setisViewingStream(true);
  };

  const [isEditingLocation, setisEditingLocation] = useState(false);
  const editLocation = (location: Location) => {
    setSelectedLocation(location);
    setisEditingLocation(true);
  };

  const [isDeletingLocation, setisDeletingLocation] = useState(false);
  const deleteLocation = (location: Location) => {
    setSelectedLocation(location);
    setisDeletingLocation(true);
  };

  const columns = useLocationTableColumns({ openStream, editLocation, deleteLocation });

  return (
    <div>
      <DataTable
        columns={columns}
        data={locations}
      />
      <LocationEventsDrawer
        isOpen={isViewingStream}
        location={selectedLocation}
        onOpenChange={setisViewingStream}
      />
      <EditLocationDrawer
        isOpen={isEditingLocation}
        location={selectedLocation}
        onOpenChange={setisEditingLocation}
      />
      <DeleteLocationDialog
        isOpen={isDeletingLocation}
        location={selectedLocation}
        onOpenChange={setisDeletingLocation}
      />
    </div>
  );
}