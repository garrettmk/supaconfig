import { getFromSearchParams, parseAsInteger, parseAsStringEnum } from "@/app/(lib)/utils/search-params";
import { getLocations, GetLocationsInput } from "@/app/configuration/locations/(lib)/actions";
import { CreateLocationDrawer } from "./(components)/create-location-drawer";
import { LocationsTable } from "./(components)/locations-table";
import { Location } from "./(lib)/types";

const sortableFields: (keyof Location)[] = [
  'name',
  'id',
  'version',
  'created_at',
  'updated_at'
];

export default async function LocationsPage({
  searchParams
}: {
  searchParams: Record<string, string>;
}) {
  const getLocationsInput: GetLocationsInput = getFromSearchParams(searchParams, {
    offset: parseAsInteger.withDefault(0),
    limit: parseAsInteger.withDefault(10),
    sortKey: parseAsStringEnum(sortableFields).withDefault('name'),
    sortDirection: parseAsStringEnum(['asc', 'desc']).withDefault('desc')
  });
  
  const getLocationsResult = await getLocations(getLocationsInput);
  
  return (
    <section className="basis-full p-12">
      <div className="flex justify-between items-center mb-12">
        <h1 className="text-4xl font-extrabold">
          Locations
        </h1>
        <CreateLocationDrawer />
      </div>
      <LocationsTable getLocationsResult={getLocationsResult}/>
    </section>
  );
}