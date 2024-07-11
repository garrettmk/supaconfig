import { Button } from "@/components/ui/button";
import { Drawer, DrawerClose, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { type Event } from "@/types/models";

export type EventDrawerProps = {
  event?: Event;
  isOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
}

export function EventDrawer(props: EventDrawerProps) {
  const { event, isOpen, onOpenChange } = props;

  return (
    <Drawer open={isOpen} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>
            Event Details
          </DrawerTitle>
        </DrawerHeader>
        <pre className="p-4 max-h-[80vh] overflow-auto">
          {JSON.stringify(event, null, 2)}
        </pre>
        <DrawerFooter>
          <Button 
            type="button"
            variant="outline"
            onClick={() => onOpenChange?.(false)}
          >
            Close
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}