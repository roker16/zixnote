import { createClient } from "@/utils/supabase/client";

export const getSubscription = async (userId: string) => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("subscription")
    .select()
    .eq("user_id", userId);
  if (error) {
    throw error;
  }
  return data;
};
