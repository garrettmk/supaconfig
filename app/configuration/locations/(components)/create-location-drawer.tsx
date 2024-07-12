"use client";

import { CancelButton } from "@/components/cancel-button";
import { SubmitButton } from "@/components/submit-button";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { createLocation } from "@/lib/locations/actions";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusIcon } from "@radix-ui/react-icons";
import { useMutation } from "@tanstack/react-query";
import clsx from "clsx";
import { useEffect, useState } from "react";
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
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: createLocation,
    onSuccess: () => toast({
      title: 'Location created',
      description: 'Location has been created.',
    }),
    onError: error => toast({
      title: 'Error creating location',
      description: error.message,
      variant: 'destructive',
    }),
    onSettled: () => {
      setIsOpen(false);
    },
  });

  useEffect(() => {
    if (!isOpen)
      form.reset();
  }, [isOpen]);

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
                'opacity-50 pointer-events-none': isPending,
              })}
              onSubmit={form.handleSubmit(input => mutate(input))}
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
                    <FormMessage />
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