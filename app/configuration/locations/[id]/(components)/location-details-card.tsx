"use client";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Location } from "@/types/models";
import { useState } from "react";
import { EditLocationDrawer } from "../../(components)/edit-location-drawer";
import { CopyToClipboardButton } from "@/components/copy-button";

export type LocationDetailsCardProps = {
  className?: string;
  location: Location;
};

export function LocationDetailsCard(props: LocationDetailsCardProps) {
  const { className, location } = props;
  const [isEditingLocation, setIsEditingLocation] = useState(false);

  return (
    <>
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex flex-row justify-between">
            Location Details
            <Button onClick={() => setIsEditingLocation(true)}>
              Edit
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableBody>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableCell className="group">
                  {location.name}
                  <CopyToClipboardButton
                    className="ml-3"
                    valueToCopy={location.name}
                  />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableCell className="group">
                  {location.id}
                  <CopyToClipboardButton
                    className="ml-3"
                    valueToCopy={location.id}
                  />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableHead>Version</TableHead>
                <TableCell>
                  {location.version}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <EditLocationDrawer
        isOpen={isEditingLocation}
        location={location}
        onOpenChange={setIsEditingLocation}
      />
    </>
  );
}