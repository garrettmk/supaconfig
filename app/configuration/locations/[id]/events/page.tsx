import { EventsTable } from "@/components/events-table";
import { EventDetailsDrawer } from "@/components/events-table/event-details-drawer";
import { SsrPagination } from "@/components/ssr-pagination";
import { getEventStream } from "@/lib/events/actions";
import { pickPaginationResult, usePaginationSearchParams, usePaginationUrls } from "@/lib/pagination";
import { pickSortingResult, useSortingSearchParams, useSortingUrls } from "@/lib/sorting";
import { getFromSearchParams } from "@/lib/utils/url";

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

  const detailsId = getFromSearchParams(searchParams, 'details');

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