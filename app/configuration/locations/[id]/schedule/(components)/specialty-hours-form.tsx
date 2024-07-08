'use client';

import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { TimeInput } from "@/components/ui/time-input";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { Time } from '@internationalized/date';
import { SubmitButton } from "@/components/submit-button";
import { Checkbox } from "@/components/ui/checkbox";
import { capitalize } from "@/lib/utils";
import { Fragment } from "react";
import { Input } from "@/components/ui/input";
import { DailyHours, SetLocationHoursInput, WeeklyHours, setLocationDefaultHours, setLocationHours } from "@/lib/actions/locations";
import { Button } from "@/components/ui/button";

const dailyHoursSchema = z.object({
  isOpen: z.boolean(),
  open: z.instanceof(Time),
  close: z.instanceof(Time),
  break: z.instanceof(Time),
  breakDuration: z.number()
});

const formSchema = z.object({
  specialtyHours: z.array(z.object({
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    hours: dailyHoursSchema
  }))
})

export type SpecialtyHoursFormValues = z.infer<typeof formSchema>;

export type SpecialtyHoursFormProps = {
  defaultValues?: SpecialtyHoursFormValues;
  locationId: string;
}

export function SpecialtyHoursForm(props: SpecialtyHoursFormProps) {
  const form = useForm<SpecialtyHoursFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      specialtyHours: [
        {
          date: (new Date()).toISOString().split('T')[0],
          hours: {
            isOpen: true,
            open: new Time(9, 0),
            close: new Time(17, 0),
            break: new Time(12, 0),
            breakDuration: 60
          }
        }
      ]
    }
  });

  const dateFields = useFieldArray({ control: form.control, name: 'specialtyHours' });
  const addNewDateField = () => dateFields.append({ 
    date: (new Date()).toISOString().split('T')[0], 
    hours: {
      isOpen: true,
      open: new Time(9, 0),
      close: new Time(17, 0),
      break: new Time(12, 0),
      breakDuration: 60
    }
  });

  const onSubmit: SubmitHandler<SpecialtyHoursFormValues> = async (values) => {
    const timeToJson = (time: Time) => ({
      hour: time.hour,
      minute: time.minute
    });

    const data: SetLocationHoursInput = {
      id: props.locationId,
      specialtyHours: Object.fromEntries(values.specialtyHours.map(({ date, hours }) => [
        date,
        {
          isOpen: hours.isOpen,
          open: timeToJson(hours.open),
          close: timeToJson(hours.close),
          break: timeToJson(hours.break),
          breakDuration: hours.breakDuration
        }
      ]))
    }
    
    await setLocationHours(data);
  }


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid grid-cols-5 gap-y-2 gap-x-12 items-center">
          <span className="text-muted-foreground">Date</span>
          <span className="text-muted-foreground justify-self-end">Open</span>
          <span className="text-muted-foreground justify-self-end">Close</span>
          <span className="text-muted-foreground justify-self-end">Break</span>
          <span className="text-muted-foreground justify-self-end">Duration</span>

          {dateFields.fields.map((field, index) => {
            const isRowEnabled = form.getValues(`specialtyHours.${index}.hours.isOpen`);

            return (
            <Fragment key={index}>
              <div className="flex items-center space-x-3">
                <FormField control={form.control} name={`specialtyHours.${index}.hours.isOpen`} render={({ field }) => (
                  <FormItem className="flex items-center space-y-0 space-x-3 basis-full">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange}/>
                    </FormControl>
                  </FormItem>
                )}/>
                <FormField control={form.control} name={`specialtyHours.${index}.date`} render={({ field }) => (
                  <FormItem className="space-y-0">
                    <FormLabel className="sr-only">Date</FormLabel>
                    <FormControl>
                      <Input 
                        type="date" 
                        disabled={!isRowEnabled}
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}/>
              </div>
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
              )}/>
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
              )}/>
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
              )}/>
              <FormField control={form.control} name={`specialtyHours.${index}.hours.breakDuration`} render={({ field }) => (
                <FormItem className="justify-self-end space-y-0">
                  <FormLabel className="sr-only">Duration</FormLabel>
                  <FormControl>
                    <Input type="number" {...field}/>
                  </FormControl>
                </FormItem>
              )}/>
            </Fragment>
          )})}
        </div>
        <div className="flex space-x-4 mt-6">
          <Button onClick={addNewDateField}>
            Add Date
          </Button>
          <SubmitButton 
            defaultText="Save"
            submittingText="Saving..."
          />
        </div>
      </form>
    </Form>
  );
}