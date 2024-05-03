import { createClient } from "@/utils/supabase/client";

export const getSubscriptionClient = async (userId: string) => {
  const supabase = createClient();
  var currentTimestamp = new Date().toISOString();
  const { data, error } = await supabase
    .from("subscription")
    .select()
    .eq("user_id", userId)
    .gte("end_date", currentTimestamp);
  if (error) {
    throw error;
  }
  return data;
};
