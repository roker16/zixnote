import { createClient } from "@/utils/supabase/server";

export const getSubscriptionServer = async (userId: string) => {
  const supabase = await createClient();
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
