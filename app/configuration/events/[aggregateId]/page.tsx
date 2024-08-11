import { getFromSearchParams, parseAsInteger } from "@/app/(lib)/utils/url";
import Link from "next/link";
import { Suspense } from "react";
import { AggregateDetails } from "./(components)/aggregate-details";


export default async function AggregateIdPage({
  searchParams,
  params: {
    aggregateId
  }
}: {
  searchParams: Record<string, string>,
  params: {
    aggregateId: string
  }
}) {
  const version = getFromSearchParams(searchParams, 'version', parseAsInteger);
  
  return (
    <section className="basis-full p-12">
      <header className="mb-12">
        <Link
          className="mb-4 hover:underline text-muted-foreground"
          href="/configuration/events"
        >
          Events /
        </Link>
        <h1 className="text-4xl font-extrabold">
          {aggregateId}
        </h1>
      </header>
      <Suspense fallback={<div>loading...</div>}>
        <AggregateDetails 
          aggregateId={aggregateId}
          version={version}
        />
      </Suspense>
    </section>
  );
}