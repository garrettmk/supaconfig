"use client";

import { CopyToClipboardButton } from "@/app/(components)/copy-button";
import { Button } from "@/app/(components)/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/(components)/card";
import { Table, TableBody, TableCell, TableHead, TableRow } from "@/app/(components)/table";
import { type Location } from "@/app/configuration/locations/(lib)/types";
import { useState } from "react";
import { EditLocationDrawer } from "../../(components)/edit-location-drawer";

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