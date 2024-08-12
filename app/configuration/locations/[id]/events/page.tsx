import { EventsTable } from "@/app/configuration/locations/[id]/events/(components)/events-table";
import { EventDetailsDrawer } from "@/app/configuration/locations/[id]/events/(components)/events-table/event-details-drawer";
import { SsrPagination } from "@/app/(components)/ssr-pagination";
import { getEventStream } from "@/app/configuration/events/(lib)/actions";
import { pickPaginationResult, usePaginationSearchParams, usePaginationUrls } from "@/app/(lib)/pagination";
import { pickSortingResult, useSortingSearchParams, useSortingUrls } from "@/app/(lib)/sorting";
import { getFromSearchParams, parseAsString } from "@/app/(lib)/utils/search-params";

export default async function LocationEvents({
  params: {
    id,
  },
  searchParams
}: {
  params: {
    id: string
  },
  searchParams: Record<string, string>;
}) {
  const paginationInput = usePaginationSearchParams(searchParams);
  const sortingInput = useSortingSearchParams(searchParams);

  const getEventStreamResult = await getEventStream({
    aggregateId: id, 
    ...paginationInput, 
    ...sortingInput
  });

  const events = getEventStreamResult.data ?? [];
  const paginationResult = pickPaginationResult(getEventStreamResult);
  const sortingResult = pickSortingResult(getEventStreamResult);

  const ssrPagination = usePaginationUrls({
    baseUrl: `/configuration/locations/${id}/events`,
    searchParams,
    paginationResult,
    maxPages: 3
  });

  const sortingUrls = useSortingUrls({
    keys: ['event_id', 'version_number', 'created_at', 'created_by', 'event_type'],
    baseUrl: `/configuration/locations/${id}/events`,
    searchParams,
    sortingResult
  });

  const { details: detailsId } = getFromSearchParams(searchParams, {
    details: parseAsString
  });

  return (
    <section>
      <EventsTable
        events={events} 
        sortingUrls={sortingUrls}
      />
      <SsrPagination
        className="mt-4"
        {...ssrPagination}
      />
      <EventDetailsDrawer
        eventId={detailsId}
      />
    </section>
  );
}