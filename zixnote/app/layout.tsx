import { createClient } from "@/utils/supabase/server";
import { ColorSchemeScript, MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import { Notifications } from "@mantine/notifications";
import "@mantine/notifications/styles.css";
import "./globals.css"; //this should be always below mantine styles.css
import { theme } from "./theme";
import { DeviceOSDetector } from "./devicedetector/DeviceOSDetector";
import { getDeviceAndOS } from "./devicedetector/getDeviceAndOS";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Dizinote",
  description: "A Digital notes making platform for all",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const userAgentData = await getDeviceAndOS();
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
            {/* <DeviceOSDetector userAgentData={userAgentData} /> */}
          </div>
        </MantineProvider>
      </body>
    </html>
  );
}
