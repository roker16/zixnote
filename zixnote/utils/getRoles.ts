// "use server";
import { User } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { createClient } from "./supabase/server";

export async function getRoles(user: User | null) {
  const supabase = createClient(cookies());
  let role;
  if (user) {
    const { data } = await supabase
      .from("profiles_roles")
      .select(`role_id,roles(role)`)
      .eq("profile_id", user?.id);
    role = data;
  }
  return role;
}
export type Roles = ReturnType<typeof getRoles>;
