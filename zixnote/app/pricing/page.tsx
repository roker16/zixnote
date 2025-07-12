import { FooterCentered } from "@/components/landing/FooterCentered";
import { HeaderMegaMenu } from "@/components/landing/HeaderMegaMenu";
import { createClient } from "@/utils/supabase/server";
import { Card, Container, Text } from "@mantine/core";
import Pricing from "./pricing";

export default async function Index() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Fetch show_pricing setting
  const { data: settingsData } = await supabase
    .from("settings")
    .select("setting_status")
    .eq("setting_name", "show_pricing")
    .single();

  const showPricing = settingsData?.setting_status === "enabled";

  return (
    <div>
      <HeaderMegaMenu user={user} />
      <Container size="xl" mt="xl">
        {showPricing ? (
          <Pricing />
        ) : (
          <div className="flex justify-center items-center h-72">
            <Card
              withBorder
              radius="md"
              p="lg"
              className="w-full max-w-md text-center"
            >
              <Text size="lg" fw={500}>
                Pricing information is currently unavailable.
              </Text>
              <Text c="dimmed" mt="sm">
                Please check back later.
              </Text>
            </Card>
          </div>
        )}
      </Container>
      <FooterCentered />
    </div>
  );
}
