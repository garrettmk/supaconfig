"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { deleteLocation } from "@/lib/actions/locations";
import { type Location } from "@/types/locations";

export type DeleteLocationDialogProps = {
  isOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
  location?: Location;
};

export function DeleteLocationDialog(props: DeleteLocationDialogProps) {
  const { isOpen, onOpenChange, location } = props;
  const { toast } = useToast();
  
  const handleDelete = async () => {
    try {
      await deleteLocation({ id: location?.id! });
    } catch (e) {
      console.error(e);
      toast({
        title: 'Error deleting location',
        description: (e as Error).message,
        variant: 'destructive',
      });
      onOpenChange?.(false);
      return;
    }
    toast({
      title: 'Location deleted',
      description: `Location "${location?.name}" has been deleted.`,
    });
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
          <Button variant="ghost" onClick={() => onOpenChange?.(false)}>Cancel</Button>
          <Button variant="destructive" onClick={handleDelete}>Delete</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}