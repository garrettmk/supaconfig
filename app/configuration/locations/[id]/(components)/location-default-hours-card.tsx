'use client';

import { SubmitButton } from "@/components/submit-button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { TimeInput } from "@/components/ui/time-input";
import { useToast } from "@/components/ui/use-toast";
import { DailyHours, WeeklyHours, setLocationDefaultHours } from "@/lib/actions/locations";
import { capitalize } from "@/lib/utils";
import { Location } from "@/types/models";
import { zodResolver } from "@hookform/resolvers/zod";
import { Time } from '@internationalized/date';
import { Fragment } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

const dailyHoursFormSchema = z.object({
  isOpen: z.boolean(),
  open: z.instanceof(Time),
  close: z.instanceof(Time),
  break: z.instanceof(Time),
  breakDuration: z.number()
});

const formSchema = z.object({
  sunday: dailyHoursFormSchema,
  monday: dailyHoursFormSchema,
  tuesday: dailyHoursFormSchema,
  wednesday: dailyHoursFormSchema,
  thursday: dailyHoursFormSchema,
  friday: dailyHoursFormSchema,
  saturday: dailyHoursFormSchema
});

export type HoursFormValues = z.infer<typeof formSchema>;

export const daysInWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'] as const;

export type LocationDefaultHoursCardProps = {
  className?: string;
  defaultValues?: WeeklyHours;
  location: Location;
}

export function LocationDefaultHoursCard(props: LocationDefaultHoursCardProps) {
  const { location, className } = props;
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
      } = (location.default_hours as WeeklyHours)?.[day] ?? {};

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
      id: location.id,
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
        <Card className={className}>
          <CardHeader>
            <div className="flex flex-row justify-between">
              <div>
                <CardTitle>
                  Default Hours
                </CardTitle>
                <CardDescription className="mt-2">
                  Set the default hours for this location.
                </CardDescription>
              </div>
              <SubmitButton
                defaultText="Save"
                submittingText="Saving..."
                disabled={!form.formState.isDirty}
              />
            </div>
          </CardHeader>
          <CardContent className="grid grid-cols-6 gap-y-2 gap-x-12 items-center">
            <span className="text-muted-foreground">Weekday</span>
            <span className="text-muted-foreground justify-self-end">Is Open?</span>
            <span className="text-muted-foreground justify-self-end">Open</span>
            <span className="text-muted-foreground justify-self-end">Close</span>
            <span className="text-muted-foreground justify-self-end">Break</span>
            <span className="text-muted-foreground justify-self-end">Duration (min)</span>

            {daysInWeek.map((day) => (
              <Fragment key={day}>
                <div>
                  {capitalize(day)}
                </div>
                <FormField control={form.control} name={`${day}.isOpen`} render={({ field }) => (
                  <FormItem className="justify-self-end space-y-0">
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )} />
                <FormField control={form.control} name={`${day}.open`} render={({ field }) => (
                  <FormItem className="justify-self-end space-y-0">
                    <FormLabel className="sr-only">{capitalize(day)} Open</FormLabel>
                    <FormControl>
                      <TimeInput isDisabled={!isEnabled[day]} {...field} />
                    </FormControl>
                  </FormItem>
                )} />
                <FormField control={form.control} name={`${day}.close`} render={({ field }) => (
                  <FormItem className="justify-self-end space-y-0">
                    <FormLabel className="sr-only">{capitalize(day)} Close</FormLabel>
                    <FormControl>
                      <TimeInput isDisabled={!isEnabled[day]} {...field} />
                    </FormControl>
                  </FormItem>
                )} />
                <FormField control={form.control} name={`${day}.break`} render={({ field }) => (
                  <FormItem className="justify-self-end space-y-0">
                    <FormLabel className="sr-only">{capitalize(day)} Break</FormLabel>
                    <FormControl>
                      <TimeInput isDisabled={!isEnabled[day]} {...field} />
                    </FormControl>
                  </FormItem>
                )} />
                <FormField control={form.control} name={`${day}.breakDuration`} render={({ field }) => (
                  <FormItem className="justify-self-end space-y-0">
                    <FormLabel className="sr-only">{capitalize(day)} Break Duration</FormLabel>
                    <FormControl>
                      <Input
                        className="text-right max-w-24"
                        disabled={!isEnabled[day]}
                        type="number" 
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )} />
              </Fragment>
            ))}
          </CardContent>
        </Card>
      </form>
    </Form>
  );
}