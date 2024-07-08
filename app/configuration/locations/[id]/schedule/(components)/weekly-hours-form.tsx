'use client';

import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { TimeInput } from "@/components/ui/time-input";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { Time } from '@internationalized/date';
import { SubmitButton } from "@/components/submit-button";
import { Checkbox } from "@/components/ui/checkbox";
import { capitalize } from "@/lib/utils";
import { Fragment } from "react";
import { Input } from "@/components/ui/input";
import { DailyHours, WeeklyHours, setLocationDefaultHours, setLocationHours } from "@/lib/actions/locations";
import { useToast } from "@/components/ui/use-toast";

const dailyHoursSchema = z.object({
  isOpen: z.boolean(),
  open: z.instanceof(Time),
  close: z.instanceof(Time),
  break: z.instanceof(Time),
  breakDuration: z.number()
});

const formSchema = z.object({
  sunday: dailyHoursSchema,
  monday: dailyHoursSchema,
  tuesday: dailyHoursSchema,
  wednesday: dailyHoursSchema,
  thursday: dailyHoursSchema,
  friday: dailyHoursSchema,
  saturday: dailyHoursSchema
});

export type HoursFormValues = z.infer<typeof formSchema>;

export const daysInWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'] as const;

export type WeeklyHoursFormProps = {
  defaultValues?: HoursFormValues;
  locationId: string;
}

export function WeeklyHoursForm(props: WeeklyHoursFormProps) {
  const { locationId, defaultValues } = props;
  const { toast } = useToast();
  
  const form = useForm<HoursFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: Object.fromEntries(daysInWeek.map(day => {
      const { 
        isOpen = false, 
        open = { hour: 9, minute: 0 }, 
        close = { hour: 17, minute: 0 }, 
        break: breakTime = { hour: 12, minute: 0 }, 
        breakDuration = 60 
      } = defaultValues?.[day] ?? {};

      return [day, {
        isOpen: isOpen,
        open: new Time(open.hour, open.minute),
        close: new Time(close.hour, close?.minute),
        break: new Time(breakTime.hour, breakTime?.minute),
        breakDuration: breakDuration
      }] as const
    })),
  });

  const isEnabled = Object.fromEntries(daysInWeek.map(day => [day, form.watch(`${day}.isOpen`)]));

  const onSubmit: SubmitHandler<HoursFormValues> = async (values) => {
    const timeToJson = (time: Time) => ({
      hour: time.hour,
      minute: time.minute
    });

    const hours = Object.fromEntries(daysInWeek.map(day => [day, {
      isOpen: values[day].isOpen,
      open: timeToJson(values[day].open),
      close: timeToJson(values[day].close),
      break: timeToJson(values[day].break),
      breakDuration: values[day].breakDuration
    } satisfies DailyHours])) as WeeklyHours;

    await setLocationDefaultHours({
      id: props.locationId,
      defaultHours: hours
    });

    toast({
      title: 'Hours updated',
      description: 'Hours have been updated.'
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid grid-cols-5 gap-y-2 gap-x-12 items-center">
          <span className="text-muted-foreground">Weekday</span>
          <span className="text-muted-foreground justify-self-end">Open</span>
          <span className="text-muted-foreground justify-self-end">Close</span>
          <span className="text-muted-foreground justify-self-end">Break</span>
          <span className="text-muted-foreground justify-self-end">Duration</span>

          {daysInWeek.map((day) => (
            <Fragment key={day}>
              <FormField control={form.control} name={`${day}.isOpen`} render={({ field }) => (
                <FormItem className="flex items-center space-y-0 space-x-3 basis-full">
                  <FormControl>
                    <Checkbox 
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel>{capitalize(day)}</FormLabel>
                </FormItem>
              )}/>
              <FormField control={form.control} name={`${day}.open`} render={({ field }) => (
                <FormItem className="justify-self-end space-y-0">
                  <FormLabel className="sr-only">{capitalize(day)} Open</FormLabel>
                  <FormControl>
                    <TimeInput isDisabled={!isEnabled[day]} {...field}/>
                  </FormControl>
                </FormItem>
              )}/>
              <FormField control={form.control} name={`${day}.close`} render={({ field }) => (
                <FormItem className="justify-self-end space-y-0">
                  <FormLabel className="sr-only">{capitalize(day)} Close</FormLabel>
                  <FormControl>
                    <TimeInput isDisabled={!isEnabled[day]} {...field}/>
                  </FormControl>
                </FormItem>
              )}/>
              <FormField control={form.control} name={`${day}.break`} render={({ field }) => (
                <FormItem className="justify-self-end space-y-0">
                  <FormLabel className="sr-only">{capitalize(day)} Break</FormLabel>
                  <FormControl>
                    <TimeInput isDisabled={!isEnabled[day]} {...field}/>
                  </FormControl>
                </FormItem>
              )}/>
              <FormField control={form.control} name={`${day}.breakDuration`} render={({ field }) => (
                <FormItem className="justify-self-end space-y-0">
                  <FormLabel className="sr-only">{capitalize(day)} Break Duration</FormLabel>
                  <FormControl>
                    <Input disabled={!isEnabled[day]} type="number" {...field}/>
                  </FormControl>
                </FormItem>
              )}/>
            </Fragment>
          ))}
       </div>
        <SubmitButton 
          className="mt-6"
          defaultText="Save"
          submittingText="Saving..."
        />
      </form>
    </Form>
  );
}