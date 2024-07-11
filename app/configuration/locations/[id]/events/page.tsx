import { EventsTable } from "@/components/events-table";
import { UrlPaginator } from "@/components/url-paginator";
import { getEventStream } from "@/lib/actions/events";

export default async function LocationEvents({
  params: {
    id,
  },
  searchParams: {
    offset = '0',
    limit = '10'
  }
}: {
  params: {
    id: string
  },
  searchParams: {
    offset?: string;
    limit?: string;
  }
}) {
  const { data = [], error, count } = await getEventStream({
    aggregateId: id,
    offset: Number(offset),
    limit: Number(limit)
  });

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