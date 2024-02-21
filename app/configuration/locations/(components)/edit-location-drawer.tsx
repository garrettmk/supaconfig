"use client";

import { CancelButton } from "@/components/cancel-button";
import { Spinner } from "@/components/spinner";
import { SubmitButton } from "@/components/submit-button";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useLocationEditMutation } from "@/lib/queries/locations";
import { type Location } from "@/types/models";
import { zodResolver } from "@hookform/resolvers/zod";
import clsx from "clsx";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  id: z.string(),
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
      id: location?.id ?? '',
      name: location?.name ?? '',
    }
  });

  useEffect(() => {
    form.reset({ 
      id: location?.id ?? '',
      name: location?.name ?? ''
    });
  }, [location]);

  const { mutate, isPending } = useLocationEditMutation({
    onSuccess: (result, variables) => toast({
      title: 'Location updated',
      description: `${variables?.name} has been updated.`,
    }),
    onError: error => toast({
      title: 'Error updating location',
      description: error.message,
      variant: 'destructive',
    }),
    onSettled: () => {
      onOpenChange?.(false);
      form.reset();
    },
  });

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
                  'opacity-50 pointer-events-none': isPending,
                })}
                onSubmit={form.handleSubmit(mutate)}
              >
                <FormField
                  control={form.control}
                  name="id"
                  render={({ field}) => (
                    <FormItem>
                      <FormControl>
                        <Input type="hidden" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
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
                  <SubmitButton/>
                  <DrawerClose asChild>
                    <CancelButton/>
                  </DrawerClose>
                </DrawerFooter>
              </form>
            </Form>
          </div>
        </DrawerContent>
      </Drawer>
  );
}