import { FooterCentered } from "@/components/landing/FooterCentered";
import { HeaderMegaMenu } from "@/components/landing/HeaderMegaMenu";
import { createClient } from "@/utils/supabase/server";
import { ColorSchemeScript, MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import { cookies } from "next/headers";
import "./globals.css"; //this should be always below mantine styles.css
import { theme } from "./theme";
import { User } from "@supabase/supabase-js";

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

      <body>
        <MantineProvider theme={theme} defaultColorScheme="light">
          <Notifications position="top-center" />
          <div>
            <div>{children}</div>
          </div>
        </MantineProvider>
      </body>
    </html>
  );
}
