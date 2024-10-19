import { FooterCentered } from "@/components/landing/FooterCentered";
import { HeaderMegaMenu } from "@/components/landing/HeaderMegaMenu";
import { HeroBullets } from "@/components/landing/HeroBullets";
import { createClient } from "@/utils/supabase/server";
import { Container } from "@mantine/core";
import { cookies } from "next/headers";
import Paynow from "./pricing/paynow";
// import Landing from "./Landing";

export default async function Index() {
  const supabase = createClient(cookies());
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div>
      <HeaderMegaMenu user={user} />
      <Container size={"xl"} >
        hello1
        <HeroBullets />
      </Container>
      
      <FooterCentered />
    </div>
  );
}
