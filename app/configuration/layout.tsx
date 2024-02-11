import { UserMenuButton } from "@/components/user-menu-button";
import { createClient } from "@/utils/supabase/server";
import { GearIcon } from "@radix-ui/react-icons";
import Link from "next/link";

export default async function ConfigurationLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  return (
    <>
      <nav className="w-full h-16 px-16 flex items-center justify-between border-b border-b-foreground/10">
        <Link href="/" className='font-extrabold text-2xl'>
          <GearIcon className="w-8 h-8 inline-block mr-2" />
          Supaconfig
        </Link>
        <UserMenuButton user={user!} />
      </nav>
      <main className="min-h-screen flex flex-col items-center">
        {children}
      </main>
    </>
  );
}