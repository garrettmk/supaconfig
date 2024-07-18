import { EventsTable } from "@/components/events-table";
import { SsrPagination } from "@/components/ssr-pagination";
import { getEventStream } from "@/lib/events/actions";
import { pickPaginationResult, usePaginationSearchParams, usePaginationUrls } from "@/lib/pagination";

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
  const { offset, limit } = usePaginationSearchParams(searchParams);
  const getEventStreamResult = await getEventStream({ aggregateId: id, offset, limit });
  const events = getEventStreamResult.data ?? [];
  const paginationResult = pickPaginationResult(getEventStreamResult);

  const ssrPagination = usePaginationUrls({
    baseUrl: `/configuration/locations/${id}/events`,
    searchParams,
    paginationResult,
    maxPages: 3
  });

  return (
    <section>
      <EventsTable
        events={events}
      />
      <SsrPagination
        className="mt-4"
        {...ssrPagination}
      />
    </section>
  );
}