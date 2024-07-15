import { SsrPagination } from "@/components/ssr-pagination";
import { getLocations } from "@/lib/locations/actions";
import { PaginationResult, usePaginationSearchParams, usePaginationUrls } from "@/lib/pagination";
import { SortingResult, useSortingSearchParams, useSortingUrl } from "@/lib/sorting";
import { pick } from "@/lib/utils/utils";
import { CreateLocationDrawer } from "./(components)/create-location-drawer";
import { LocationsTable } from "./(components)/locations-table";

export default async function ConfigurationLocations({
  params,
  searchParams
}: {
  params: any
  searchParams: Record<string, string>;
}) {
  const paginationInput = usePaginationSearchParams(searchParams);
  const sortingInput = useSortingSearchParams(searchParams);
  
  const getLocationsResult = await getLocations({ ...paginationInput, ...sortingInput });
  const locations = getLocationsResult.data;
  const paginationResult = pick(getLocationsResult, ['count', 'limit', 'offset']) as PaginationResult;
  const sortingResult = pick(getLocationsResult, ['sortKey', 'sortDirection']) as SortingResult;

  const sortingUrl = useSortingUrl({
    baseUrl: '/configuration/locations',
    searchParams,
    sortingResult,
  });

  const ssrPagination = usePaginationUrls({
    baseUrl: '/configuration/locations',
    searchParams,
    paginationResult,
  });


  return (
    <section className="basis-full p-12">
      <div className="flex justify-between items-center mb-12">
        <h1 className="text-4xl font-extrabold">
          Locations
        </h1>
        <CreateLocationDrawer />
      </div>
      <LocationsTable 
        locations={locations}
        sortByNameUrl={sortingUrl('name')}
        sortByIdUrl={sortingUrl('id')}
        sortByVersionUrl={sortingUrl('version')}
      />
      <SsrPagination
        className="mt-4"
        {...ssrPagination }
      />
    </section>
  );
}