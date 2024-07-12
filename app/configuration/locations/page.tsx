import { UrlPaginator } from "@/components/url-paginator";
import { getLocations } from "@/lib/locations/actions";
import { usePaginationSearchParams } from "@/lib/pagination";
import { CreateLocationDrawer } from "./(components)/create-location-drawer";
import { LocationsTable } from "./(components)/locations-table";

export default async function ConfigurationLocations({
  searchParams
}: {
  searchParams: Record<string, string>;
}) {
  const { offset, limit } = usePaginationSearchParams(searchParams);
  const { data: locations, count } = await getLocations({ offset, limit });

  return (
    <section className="basis-full p-12">
      <div className="flex justify-between items-center mb-12">
        <h1 className="text-4xl font-extrabold">
          Locations
        </h1>
        <CreateLocationDrawer />
      </div>
      <LocationsTable locations={locations}/>
      <UrlPaginator className='mt-4' count={count} maxPages={5}/>
    </section>
  );
}