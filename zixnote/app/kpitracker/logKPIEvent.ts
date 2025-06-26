import { createClient } from "@/utils/supabase/client";
const supabase = createClient();

export async function logKPIEvent(
  eventType: string,
  metadata: Record<string, any>
) {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) return;

  await supabase.from("kpi_events").insert([
    {
      user_id: user.id,
      event_type: eventType,
      metadata,
    },
  ]);
}
