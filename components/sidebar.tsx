import { HomeIcon, PersonIcon } from "@radix-ui/react-icons";
import Link from "next/link";

export function Sidebar() {
  return (
    <nav className="w-80 min-h-screen border-r border-foreground/10 p-8">
      <ul className="flex flex-col space-y-2">
        <SidebarItem
          Icon={PersonIcon}
          label="Users"
          href="/configuration/users"
        />
        <SidebarItem
          Icon={HomeIcon}
          label="Locations"
          href="/configuration/locations"
        />
      </ul>
    </nav>
  );
}

type SidebarItemProps = {
  Icon: React.ComponentType<{ className?: string }>;
  label: React.ReactNode;
  href: string;
};

function SidebarItem({ Icon, label, href }: SidebarItemProps) {
  return (
    <li>
      <Link href={href} className="flex items-center hover:underline">
        <Icon className="w-4 h-4 inline-block mr-2" />
        {label}
      </Link>
    </li>
  );
}