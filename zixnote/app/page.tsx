import LastSignedInUsers from "@/components/kpi/LastSignedInUsers";
import { FooterCentered } from "@/components/landing/FooterCentered";
import { HeaderMegaMenu } from "@/components/landing/HeaderMegaMenu";
import { HeroBullets } from "@/components/landing/HeroBullets";
import { createClient } from "@/utils/supabase/server";
import { Container } from "@mantine/core";

// import Landing from "./Landing";

export default async function Index() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div>
      <HeaderMegaMenu user={user} />
      <Container size={"xl"}>
        <HeroBullets />
        {/* <LastSignedInUsers /> */}
      </Container>
      <FooterCentered />
    </div>
  );
}
