import { FooterCentered } from "@/components/landing/FooterCentered";
import { HeaderMegaMenu } from "@/components/landing/HeaderMegaMenu";
import Testimonial from "@/components/landing/Testimonial";
import { createClient } from "@/utils/supabase/server";
import { Container } from "@mantine/core";
import { headers } from "next/headers";
import NEETDashboard from "./NEETDashboard";
import { getDeviceAndOS } from "./devicedetector/getDeviceAndOS";
import PublicDashboard from "./PublicDashboard";

export default async function Index() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const userAgentData = await getDeviceAndOS();
  const { data: setting } = await supabase
    .from("settings")
    .select("setting_status")
    .eq("setting_name", "medical_testimonial")
    .single();

  const isTestimonialEnabled = setting?.setting_status === "enabled";
  const hostname = headers().get("host") || "";
  return (
    <div>
      <HeaderMegaMenu user={user} />
      <Container size="xl">
        <div>
          {hostname.includes("neetdigital.com") ? (
            <>
              <NEETDashboard />
            </>
          ) : (
            <PublicDashboard />
          )}
        </div>
        {/* <NEETDashboard /> */}
        {/* <HeroBullets /> */}
        {/* <LastSignedInUsers /> */}
      </Container>
      {/* <PDFUploader /> */}
      {isTestimonialEnabled && <Testimonial />}
      <div>
        {/* <h1>My Next.js App</h1> */}
        {/* <DeviceOSDetector userAgentData={userAgentData} /> */}
      </div>
      <FooterCentered />
    </div>
  );
}
