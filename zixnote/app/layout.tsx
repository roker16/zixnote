import { FooterCentered } from "@/components/FooterCentered";
import { HeaderMegaMenu } from "@/components/HeaderMegaMenu";
import { createClient } from "@/utils/supabase/server";
import { ColorSchemeScript, MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import "@mantine/core/styles.css";
import { cookies } from "next/headers";
import "./globals.css";
import { theme } from "./theme";
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
  // const theme = ["light", "luxury", "dark", "valentine", "wireframe"];
  return (
    <html lang="en">
      <head>
        <ColorSchemeScript />
      </head>
      <body >
        <MantineProvider theme={theme} defaultColorScheme="light">
          <Notifications  />
          <div>
            {/* <TopNavBar user={user} /> */}
            <HeaderMegaMenu user={user} />
            {/* Other content goes here */}
            <div className="h-full bg-red-300">{children}</div>
            <FooterCentered />
          </div>
          {/* <main className="min-h-screen flex flex-col items-center">

        </main> */}
        </MantineProvider>
      </body>
    </html>
  );
}
