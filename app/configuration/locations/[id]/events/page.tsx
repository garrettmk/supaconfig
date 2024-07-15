import { EventsTable } from "@/components/events-table";
import { SsrPagination } from "@/components/ssr-pagination";
import { UrlPaginator } from "@/components/url-paginator";
import { getEventStream } from "@/lib/events/actions";
import { PaginationResult, usePaginationSearchParams, usePaginationUrls } from "@/lib/pagination";
import { pick } from "@/lib/utils/utils";

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
  const paginationResult = pick(getEventStreamResult, ['count', 'limit', 'offset']) as PaginationResult;

  const ssrPagination = usePaginationUrls({
    baseUrl: `/configuration/locations/${id}/events`,
    searchParams,
    paginationResult
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