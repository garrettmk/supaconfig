import { EventsTable } from "@/app/configuration/events/(components)/events-table";
import { getEvents, GetEventsInput } from "./(lib)/actions";
import { getFromSearchParams, parseAsInteger, parseAsStringEnum } from "@/app/(lib)/utils/search-params";
import { type Event } from "./(lib)/types";

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
  const getEventsInput: GetEventsInput = getFromSearchParams(searchParams, {
    offset: parseAsInteger.withDefault(0),
    limit: parseAsInteger.withDefault(2),
    sortKey: parseAsStringEnum(sortableFields).withDefault('event_id'),
    sortDirection: parseAsStringEnum(['asc', 'desc']).withDefault('desc')
  });

  const result = await getEvents(getEventsInput);


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