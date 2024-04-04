import { FooterCentered } from "@/components/landing/FooterCentered";
import { HeaderMegaMenu } from "@/components/landing/HeaderMegaMenu";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import MyCombobox from "./create-notes/component/SearchBox";
import { Container } from "@mantine/core";
import { HeroBullets } from "@/components/landing/HeroBullets";
// import Landing from "./Landing";

export default async function Index() {
  const supabase = createClient(cookies());
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
      <Container size={"xl"} >
        <HeroBullets />
      </Container>
      <FooterCentered />
    </div>
  );
}
