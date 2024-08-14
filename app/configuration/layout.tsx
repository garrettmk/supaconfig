import { Toaster } from "@/app/(components)/toaster";
import { getUser } from "@/app/auth/(lib)/actions";
import { Sidebar } from "@/app/configuration/(components)/sidebar";
import { UserMenuButton } from "@/app/configuration/(components)/user-menu-button";
import { GearIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function ConfigurationLayout({ children }: { children: React.ReactNode }) {
  const user = await getUser();

  if (!user)
    return redirect('/login');
  
  return (
    <>
      <div vaul-drawer-wrapper="">
        <nav className="w-full h-16 px-16 flex items-center justify-between border-b border-b-foreground/10">
          <Link href="/" className='font-extrabold text-2xl'>
            <GearIcon className="w-8 h-8 inline-block mr-2" />
            Supaconfig
          </Link>
          <UserMenuButton user={user!} />
        </nav>
        <main className="min-h-screen flex">
          <Sidebar/>
          {children}
        </main>
      </div>
      <Toaster/>
    </>
  );
}