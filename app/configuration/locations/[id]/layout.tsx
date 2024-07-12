import { getLocation } from "@/lib/locations/actions";
import Link from "next/link";
import { LocationTabs } from "./(components)/location-tabs";

export default async function LocationLayout({
  children,
  params: {
    id,
    tab = 'details'
  }
}: {
  children: React.ReactNode;
  params: {
    id: string;
    tab: string;
  };
}) {
  const location = await getLocation(id);

  return (
    <section className="basis-full p-12">
      <header className="mb-12">
        <Link 
          className="mb-4 hover:underline text-muted-foreground"
          href="/configuration/locations"
        >
          Locations /
        </Link>
        <h1 className="text-4xl font-extrabold">
          {location.name}
        </h1>
        <LocationTabs className="mt-4" />
      </header>
      {children}
    </section>      
  );
}