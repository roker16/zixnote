import LastSignedInUsers from "@/components/kpi/LastSignedInUsers";
import { FooterCentered } from "@/components/landing/FooterCentered";
import { HeaderMegaMenu } from "@/components/landing/HeaderMegaMenu";
import { HeroBullets } from "@/components/landing/HeroBullets";
import { createClient } from "@/utils/supabase/server";
import { Container } from "@mantine/core";
import PublicDashboard from "./PublicDashboard";
import Flow from "./manage-notes/@ainotes/Flow";
import Testimonial from "@/components/landing/Testimonial";
import { DeviceOSDetector } from "./devicedetector/DeviceOSDetector";
import { getDeviceAndOS } from "./devicedetector/getDeviceAndOS";
import PDFUploader from "./manage-notes/@ainotes/Test";

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

  return (
    <div>
      <HeaderMegaMenu user={user} />
      <Container size="xl">
        <PublicDashboard />
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
