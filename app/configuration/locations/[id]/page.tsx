import { getLocation } from "@/app/configuration/locations/(lib)/actions";
import { LocationDefaultHoursCard } from "./(components)/location-default-hours-card";
import { LocationDetailsCard } from "./(components)/location-details-card";
import { LocationSpecialtyHoursCard } from "./(components)/location-specialty-hours-card";

export default async function LocationIndex({
  params: {
    id
  }
}: {
  params: {
    id: string
  }
}) {
  const location = await getLocation(id);

  return (
    <section> 
      <LocationDetailsCard
        location={location}
      />
      
      <LocationDefaultHoursCard
        className="mt-12"
        location={location}
      />

      <LocationSpecialtyHoursCard
        className="mt-12"
        location={location}
      />
    </section>
  );
}