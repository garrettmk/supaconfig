"use client";

import { Spinner } from "@/components/spinner";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { createLocation } from "@/lib/actions/locations";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusIcon } from "@radix-ui/react-icons";
import clsx from "clsx";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters long",
  })
});


export function CreateLocationDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
    }
  });
  
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await createLocation(values);
    } catch (e) {
      console.error(e);
      toast({
        title: 'Error creating location',
        description: (e as Error).message,
        variant: 'destructive',
      });
      return;
    }
    toast({
      title: 'Location created',
      description: `Location "${values.name}" has been created.`,
    });
    setIsOpen(false);
  };

  return (
      <Drawer open={isOpen} onOpenChange={setIsOpen}>
        <DrawerTrigger asChild>
          <Button variant="default">
            <PlusIcon className="w-4 h-4 mr-2" />
            Create location
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <div className="mx-auto w-full max-w-sm">
            <DrawerHeader>
              <DrawerTitle>Create Location</DrawerTitle>
              <DrawerDescription>Create a new location</DrawerDescription>
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