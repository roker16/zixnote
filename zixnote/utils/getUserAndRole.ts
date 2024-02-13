import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

export async function getUserAndRole() {
  const supabase = createClient(cookies());
  const { user } = (await supabase.auth.getUser()).data;

  if (!user) {
    return { user: null, role: null };
  }

  const { data: roles } = await supabase
    .from("profiles_roles")
    .select("roles(role)")
    .eq("profile_id", user.id);

  const role =
    roles && roles.length > 0 ? roles.map((item) => item.roles?.role!) : null;

  return { user, role };
}
