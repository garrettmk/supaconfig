import { EventsTable } from "@/app/configuration/events/(components)/events-table";


export default async function ConfigurationEventsPage({
  searchParams
}: {
  searchParams: Record<string, string>;
}) {

  return (
    <section className="basis-full p-12">
      <div className="mb-12">
        <h1 className="text-4xl font-extrabold">
          Events
        </h1>
      </div>
      <EventsTable searchParams={searchParams}/>
    </section>
  );
}