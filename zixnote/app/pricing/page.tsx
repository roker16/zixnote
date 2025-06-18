import { FooterCentered } from "@/components/landing/FooterCentered";
import { HeaderMegaMenu } from "@/components/landing/HeaderMegaMenu";
import { HeroBullets } from "@/components/landing/HeroBullets";
import { createClient } from "@/utils/supabase/server";
import { Container } from "@mantine/core";
import { cookies } from "next/headers";
import Pricing from "./pricing";

// import Landing from "./Landing";

export default async function Index() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let { data: syll_index, error } = await supabase
    .from("syll_index")
    .select("*");

  // const isSupabaseConnected = canInitSupabaseClient();

  return (
    <div>
      <HeaderMegaMenu user={user} />
      <Container size={"xl"}>
        <Pricing />
      </Container>
      <FooterCentered />
    </div>
  );
}
