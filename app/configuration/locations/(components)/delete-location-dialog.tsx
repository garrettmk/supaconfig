"use client";

import { Spinner } from "@/app/(components)/spinner";
import { Button } from "@/app/(components)/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/app/(components)/dialog";
import { useToast } from "@/app/(components)/use-toast";
import { useLocationDeleteMutation } from "@/app/configuration/locations/(lib)/queries";
import { type Location } from "@/app/configuration/locations/(lib)/types";

export type DeleteLocationDialogProps = {
  isOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
  location?: Location;
};

export function DeleteLocationDialog(props: DeleteLocationDialogProps) {
  const { isOpen, onOpenChange, location } = props;
  const { toast } = useToast();

  const { mutate, isPending } = useLocationDeleteMutation({
    onSuccess: () => toast({
      title: 'Location deleted',
      description: `"${location?.name}" has been deleted.`,
    }),
    onError: error => toast({
      title: 'Error deleting location',
      description: error.message,
      variant: 'destructive',
    }),
    onSettled: () => {
      onOpenChange?.(false);
    }
  });

  const handleDelete = () => {
    if (location)
      mutate(location);
  };

  const handleCancel = () => {
    onOpenChange?.(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete {location?.name ?? 'Location'}?</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this location?
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end space-x-2">
          <Button disabled={isPending} variant="ghost" onClick={handleCancel}>Cancel</Button>
          <Button disabled={isPending} variant="destructive" onClick={handleDelete}>
            {isPending && <Spinner className="mr-2"/>}
            Delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}