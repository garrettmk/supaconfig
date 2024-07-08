import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { WeeklyHoursForm } from "./(components)/weekly-hours-form";
import { SpecialtyHoursForm } from "./(components)/specialty-hours-form";
import { getLocationDefaultHours } from "@/lib/actions/locations";

export default async function LocationSchedule({
  params: {
    id
  }
}: {
  params: {
    id: string;
  };
}) {
  const defaultHours = await getLocationDefaultHours({ id });
  
  return (
    <section>
      <Card className="inline-block">
        <CardHeader>
          <CardTitle>Default Hours</CardTitle>
          <CardDescription>Set the default hours for this location.</CardDescription>
        </CardHeader>
        <CardContent>
          <WeeklyHoursForm
            locationId={id}
            defaultValues={defaultHours}
          />
        </CardContent>
      </Card>

      <Card className="inline-block mt-12">
        <CardHeader>
          <CardTitle>Specialty Hours</CardTitle>
          <CardDescription>Set hours for a specific date.</CardDescription>
        </CardHeader>
        <CardContent>
          <SpecialtyHoursForm locationId={id}/>
        </CardContent>
      </Card>
    </section>
  )
}