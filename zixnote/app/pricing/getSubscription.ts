import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';



export const getSubscription = async (userId: string) => {
  const supabase = createClient(cookies());
  const { data, error } = await supabase
    .from("subscription")
    .select()
    .eq("user_id", userId);
  if (error) {
    throw error;
  }
  return data;
};
