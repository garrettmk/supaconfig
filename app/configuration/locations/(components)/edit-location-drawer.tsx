"use client";

import { Spinner } from "@/components/spinner";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { updateLocation } from "@/lib/actions/locations";
import { type Location } from "@/types/models";
import { zodResolver } from "@hookform/resolvers/zod";
import clsx from "clsx";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters long",
  })
});

export type EditLocationDrawerProps = {
  location?: Location;
  isOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
};

export function EditLocationDrawer(props: EditLocationDrawerProps) {
  const { location, isOpen , onOpenChange } = props;
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: location?.name ?? '',
    }
  });

  useEffect(() => {
    form.reset({ name: location?.name ?? '' });
  }, [location]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await updateLocation({
        id: location?.id!,
        name: values.name,
      });
    } catch (e) {
      console.error(e);
      toast({
        title: 'Error updating location',
        description: (e as Error).message,
        variant: 'destructive',
      });
      form.reset();
      onOpenChange?.(false);
      return;
    }

    toast({
      title: 'Location updated',
      description: `Location "${values.name}" has been updated.`,
    });
    form.reset();
    onOpenChange?.(false);
  };

  return (
      <Drawer open={isOpen} onOpenChange={onOpenChange}>
        <DrawerContent>
          <div className="mx-auto w-full max-w-sm">
            <DrawerHeader>
              <DrawerTitle>{location?.name}</DrawerTitle>
              <DrawerDescription>Change location attributes</DrawerDescription>
            </DrawerHeader>
            <Form {...form}>
              <form 
                className={clsx("p-4 space-y-4", {
                  'opacity-50 pointer-events-none': form.formState.isSubmitting,
                })}
                onSubmit={form.handleSubmit(onSubmit)}
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Name" {...field} />
                      </FormControl>
                      <FormMessage/>
                    </FormItem>
                  )}
                />
                <DrawerFooter className="px-0">
                  <Button type="submit">
                    {form.formState.isSubmitting ? (
                      <>
                        <Spinner className="w-4 h-4 mr-2" />
                        Submitting...
                      </>
                    ) : (
                      "Submit"
                    )}
                  </Button>
                  <DrawerClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DrawerClose>
                </DrawerFooter>
              </form>
            </Form>
          </div>
        </DrawerContent>
      </Drawer>
  );
}