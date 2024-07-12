import { EventsTable } from "@/components/events-table";
import { UrlPaginator } from "@/components/url-paginator";
import { getEventStream } from "@/lib/events/actions";
import { usePaginationSearchParams } from "@/lib/pagination";

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
  const { data = [], error, count } = await getEventStream({ aggregateId: id, offset, limit });

  return (
    <section>
      <EventsTable
        events={data}
      />
      {data?.length ? (
        <UrlPaginator
          className="mt-4"
          count={count ?? 0}
        />
      ) : (
        <div className="text-center text-gray-500 mb-4">
          No events found
        </div>
      )}
    </section>
  );
}