import Footer from "@/components/Footer";
import TopNavBar from "@/components/TopNavBar";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import "./globals.css";
import { Providers } from "./providers";
import "@mantine/core/styles.css";
import { ColorSchemeScript, MantineProvider } from '@mantine/core';

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Next.js and Supabase Starter Kit",
  description: "The fastest way to build apps with Next.js and Supabase",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient(cookies());
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const theme = ["light", "luxury", "dark", "valentine", "wireframe"];
  return (
    <html data-theme={theme[0]} lang="en">
      <head>
        <ColorSchemeScript />
      </head>
      <body>
      <MantineProvider>
          <div>
            <TopNavBar user={user} />
            {/* Other content goes here */}
            <div className=" container mx-auto p-4">{children}</div>
            <Footer />
          </div>
          {/* <main className="min-h-screen flex flex-col items-center">

        </main> */}
       </MantineProvider>
      </body>
    </html>
  );
}
