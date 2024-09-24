import { getFromSearchParams, parseAsInteger, parseAsString, parseAsStringEnum } from "@/app/(lib)/utils/search-params";
import { EventsTable } from "@/app/configuration/events/(components)/events-table";
import { getEvents } from "./(lib)/actions";
import { type Event } from "./(lib)/types";
import { create } from "domain";

const sortableFields: (keyof Event)[] = [
  'event_id',
  'event_type',
  'aggregate_type',
  'aggregate_id',
  'version_number',
  'created_at',
  'created_by'
];

export default async function ConfigurationEventsPage({
  searchParams
}: {
  searchParams: Record<string, string>;
}) {
  const sorting = getFromSearchParams(searchParams, {
    sortKey: parseAsStringEnum(sortableFields).withDefault('event_id'),
    sortDirection: parseAsStringEnum(['asc', 'desc']).withDefault('desc')
  });

  const pagination = getFromSearchParams(searchParams, {
    offset: parseAsInteger.withDefault(0),
    limit: parseAsInteger.withDefault(10)
  });

  const filter = getFromSearchParams(searchParams, {
    event_type: parseAsString,
    aggregate_type: parseAsString,
    aggregate_id: parseAsString,
    created_by: parseAsString
  });

  const result = await getEvents({ 
    sorting,
    pagination,
    filter
  });


  return (
    <section className="basis-full p-12">
      <div className="mb-12">
        <h1 className="text-4xl font-extrabold">
          Events
        </h1>
      </div>
      <EventsTable getEventsResult={result}/>
    </section>
  );
}