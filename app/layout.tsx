import { ThemeProvider } from '@/components/theme-provider';
import { createClient } from '@/lib/supabase/server';
import { GeistSans } from "geist/font/sans";
import "./globals.css";
import NextTopLoader from 'nextjs-toploader';

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Supaconfig",
  description: "An app configuration tool built with Supabase",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <html lang="en" className={GeistSans.className} suppressHydrationWarning>
      <body className="min-h-screen flex flex-col">
        <NextTopLoader
          showSpinner={false}
        />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
