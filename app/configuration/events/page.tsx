import { getEvents } from "@/app/configuration/events/(lib)/actions";
import { pickPaginationResult, usePaginationSearchParams, usePaginationUrls } from "@/app/(lib)/pagination";
import { useSortingSearchParams, useSortingUrls, pickSortingResult } from "@/app/(lib)/sorting";
import { EventsTable } from "./(components)/events-table";
import { SsrPagination } from "@/app/(components)/ssr-pagination";

export default async function ConfigurationEventsPage({
  searchParams
}: {
  searchParams: Record<string, string>;
}) {
  const paginationInput = usePaginationSearchParams(searchParams);
  const sortingInput = useSortingSearchParams(searchParams);

  const getEventsResult = await getEvents({ ...paginationInput, ...sortingInput });
  const events = getEventsResult.data;
  const paginationResult = pickPaginationResult(getEventsResult);
  const sortingResult = pickSortingResult(getEventsResult);
  
  const sortingUrls = useSortingUrls({
    keys: ['event_id', 'aggregate_type', 'aggregate_id', 'version_number', 'created_at', 'created_by', 'event_type'],
    searchParams,
    sortingResult
  });

  const paginationUrls = usePaginationUrls({
    searchParams,
    paginationResult
  });

  return (
    <section className="basis-full p-12">
      <div className="mb-12">
        <h1 className="text-4xl font-extrabold">
          Events
        </h1>
      </div>
      <EventsTable
        events={events}
        sortingUrls={sortingUrls}
      />
      <SsrPagination
        className="mt-4"
        {...paginationUrls}
      />
    </section>
  );
}