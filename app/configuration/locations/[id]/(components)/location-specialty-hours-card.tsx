'use client';

import { SubmitButton } from "@/components/submit-button";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { TimeInput } from "@/components/ui/time-input";
import { useToast } from "@/components/ui/use-toast";
import { type SetLocationHoursInput, setLocationHours } from "@/lib/locations/actions";
import { type DailyHours, type Location } from "@/lib/locations/types";
import { Json } from "@/lib/supabase/types";
import { isEmpty } from "@/lib/utils/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Time } from '@internationalized/date';
import { Cross2Icon } from "@radix-ui/react-icons";
import { Fragment } from "react";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { daysInWeek } from "../(utils)/hours";


export const dailyHoursFormSchema = z.object({
  isOpen: z.boolean(),
  open: z.instanceof(Time),
  close: z.instanceof(Time),
  break: z.instanceof(Time),
  breakDuration: z.number()
});

export type DailyHoursFormValues = z.infer<typeof dailyHoursFormSchema>;

export const datedHoursFormSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  hours: dailyHoursFormSchema
});

export type DatedHoursFormValues = z.infer<typeof dailyHoursFormSchema>;

const formSchema = z.object({
  specialtyHours: z.array(datedHoursFormSchema)
})

export type LocationSpecialtyHoursFormValues = z.infer<typeof formSchema>;

export function dailyHoursToFormValues(dailyHours: DailyHours): DailyHoursFormValues {
  const { isOpen, open, close, break: breakTime, breakDuration } = dailyHours;

  return {
    isOpen,
    open: new Time(open.hour, open.minute),
    close: new Time(close.hour, close.minute),
    break: new Time(breakTime.hour, breakTime.minute),
    breakDuration
  };
}

export function formValuesToDailyHours(formValues: DailyHoursFormValues): DailyHours {
  const { isOpen, open, close, break: breakTime, breakDuration } = formValues;

  return {
    isOpen,
    open: { hour: open.hour, minute: open.minute },
    close: { hour: close.hour, minute: close.minute },
    break: { hour: breakTime.hour, minute: breakTime.minute },
    breakDuration
  };
}

export function specialtyHoursToFormValues(specialtyHours: object = {}): LocationSpecialtyHoursFormValues {
  return {
    specialtyHours: Object.entries(specialtyHours).map(([date, dailyHours]) => ({
      date,
      hours: dailyHoursToFormValues(dailyHours)
    }))
  };
}

export function formValuesToSpecialtyHours(formValues: LocationSpecialtyHoursFormValues['specialtyHours']): NonNullable<Json> {
  return Object.fromEntries(formValues.map(({ date, hours }) => [
    date,
    formValuesToDailyHours(hours)
  ]));
}

export function nextAvailableDate(location: Location): Date {
  const lastSpecialtyDate = (location.specialty_hours && !isEmpty(location.specialty_hours as object))
    ? new Date(Object.keys(location.specialty_hours).slice(-1)[0] + 'T00:00:00')
    : null;

  const nextDate = lastSpecialtyDate
    ? new Date(lastSpecialtyDate)
    : new Date();

  if (lastSpecialtyDate)
    nextDate.setDate(lastSpecialtyDate.getDate() + 1);

  return nextDate;

}

export function getDefaultHours(location: Location, date: Date): DailyHours | undefined {
  const dayOfWeek = daysInWeek[date.getDay()];
  const defaultHours = (location.default_hours as any)?.[dayOfWeek] as DailyHours | undefined;

  return defaultHours;
}



export type LocationSpecialtyHoursCardProps = {
  className?: string;
  location: Location;
}

export function LocationSpecialtyHoursCard(props: LocationSpecialtyHoursCardProps) {
  const { className, location } = props;
  const { toast } = useToast();

  const form = useForm<LocationSpecialtyHoursFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: specialtyHoursToFormValues(location.specialty_hours as object ?? {})
  });

  const dateFields = useFieldArray({ control: form.control, name: 'specialtyHours' });
  const addNewDateField = () => {
    const date = nextAvailableDate({
      ...location,
      specialty_hours: formValuesToSpecialtyHours(form.getValues('specialtyHours') as any)
    });
    const defaultHours = getDefaultHours(location, date);

    dateFields.append({
      date: date.toISOString().split('T')[0],
      hours: dailyHoursToFormValues(defaultHours ?? {
        isOpen: true,
        open: { hour: 9, minute: 0 },
        close: { hour: 5, minute: 0 },
        break: { hour: 12, minute: 0 },
        breakDuration: 60
      })
    });
  }
  const removeDateField = (index: number) => dateFields.remove([index]);

  const onSubmit: SubmitHandler<LocationSpecialtyHoursFormValues> = async (values) => {
    const data: SetLocationHoursInput = {
      id: location.id,
      specialtyHours: Object.fromEntries(values.specialtyHours.map(({ date, hours }) => [
        date,
        formValuesToDailyHours(hours)
      ]))
    }

    await setLocationHours(data);

    toast({
      title: 'Hours updated',
      description: 'Hours have been updated.'
    });

    form.reset(values);
  }


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card className={className}>
          <CardHeader>
            <div className="flex flex-row justify-between">
              <div>
                <CardTitle>
                  Specialty Hours
                </CardTitle>
                <CardDescription className="mt-2">
                  Set hours for a specific date.
                </CardDescription>
              </div>
              <SubmitButton
                defaultText="Save"
                submittingText="Saving..."
                disabled={!form.formState.isDirty}
              />
            </div>
          </CardHeader>
          <CardContent className="grid grid-cols-6 gap-y-2 gap-x-6 items-center">
            {dateFields.fields.length > 0 && (
              <>
                <span className="text-muted-foreground">Date</span>
                <span className="text-muted-foreground justify-self-end">Is Open?</span>
                <span className="text-muted-foreground justify-self-end">Open</span>
                <span className="text-muted-foreground justify-self-end">Close</span>
                <span className="text-muted-foreground justify-self-end">Break</span>
                <span className="text-muted-foreground justify-self-end">Duration (min)</span>

                {dateFields.fields.map((field, index) => {
                  const isRowEnabled = form.getValues(`specialtyHours.${index}.hours.isOpen`);
                  const date = form.getValues(`specialtyHours.${index}.date`);

                  return (
                    <Fragment key={date}>
                      <div className="flex items-center space-x-3">
                        <FormField control={form.control} name={`specialtyHours.${index}.date`} render={({ field }) => (
                          <FormItem className="space-y-0">
                            <FormLabel className="sr-only">Date</FormLabel>
                            <FormControl>
                              <Input
                                type="date"
                                {...field}
                              />
                            </FormControl>
                          </FormItem>
                        )} />
                        <Button
                          type="button"
                          variant="secondary"
                          size="icon"
                          className="w-6 h-6 p-0"
                          onClick={() => removeDateField(index)}
                        >
                          <Cross2Icon className="w-4 h-4" />
                        </Button>
                      </div>
                      <FormField control={form.control} name={`specialtyHours.${index}.hours.isOpen`} render={({ field }) => (
                        <FormItem className="justify-self-end flex items-center space-y-0 space-x-3 basis-full">
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )} />
                      <FormField control={form.control} name={`specialtyHours.${index}.hours.open`} render={({ field }) => (
                        <FormItem className="justify-self-end space-y-0">
                          <FormLabel className="sr-only">Open</FormLabel>
                          <FormControl>
                            <TimeInput
                              isDisabled={!isRowEnabled}
                              {...field}
                            />
                          </FormControl>
                        </FormItem>
                      )} />
                      <FormField control={form.control} name={`specialtyHours.${index}.hours.close`} render={({ field }) => (
                        <FormItem className="justify-self-end space-y-0">
                          <FormLabel className="sr-only">Close</FormLabel>
                          <FormControl>
                            <TimeInput
                              isDisabled={!isRowEnabled}
                              {...field}
                            />
                          </FormControl>
                        </FormItem>
                      )} />
                      <FormField control={form.control} name={`specialtyHours.${index}.hours.break`} render={({ field }) => (
                        <FormItem className="justify-self-end space-y-0">
                          <FormLabel className="sr-only">Break</FormLabel>
                          <FormControl>
                            <TimeInput
                              isDisabled={!isRowEnabled}
                              {...field}
                            />
                          </FormControl>
                        </FormItem>
                      )} />
                      <FormField control={form.control} name={`specialtyHours.${index}.hours.breakDuration`} render={({ field }) => (
                        <FormItem className="justify-self-end space-y-0">
                          <FormLabel className="sr-only">Duration</FormLabel>
                          <FormControl>
                            <Input
                              className="text-right max-w-24"
                              type="number"
                              disabled={!isRowEnabled}
                              {...field}
                            />
                          </FormControl>
                        </FormItem>
                      )} />
                    </Fragment>
                  )
                })}
              </>
            )}
            <Button
              className="mt-6"
              variant="secondary"
              type="button"
              onClick={addNewDateField}
            >
              Add Date
            </Button>
          </CardContent>
        </Card>
      </form>
    </Form>
  );
}