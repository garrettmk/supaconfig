'use client';

import { Tabs, TabsList, TabsTrigger } from "@/app/(components)/tabs";
import Link from "next/link";
import { usePathname } from "next/navigation";

export type LocationTabsProps = {
  className?: string;
}

export function LocationTabs(props: LocationTabsProps) {
  const { className } = props;
  const pathname = usePathname();
  const [root, configuration, locations, id, tab = 'details', ...rest] = pathname.split('/');

  return (
    <Tabs className={className} value={tab}>
      <TabsList>
        <Link href={`/configuration/locations/${id}/`}>
          <TabsTrigger value="details">Details</TabsTrigger>
        </Link>
        <Link href={`/configuration/locations/${id}/events`}>
          <TabsTrigger value="events">Events</TabsTrigger>
        </Link>
      </TabsList>
    </Tabs>
  );
}