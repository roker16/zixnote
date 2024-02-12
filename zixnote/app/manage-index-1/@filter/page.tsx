import { createClient } from "@/utils/supabase/server";

import { cookies } from "next/headers";

import SyllabusFilter from "../component/SyllabusFilter";

type roleType = {
  profile_id: string;
  roles: {
    role: string;
  } | null;
};

export default async function Index({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const supabase = createClient(cookies());
  const user = (await supabase.auth.getUser()).data.user;
  let role;
  if (user) {
    const { data: roles } = await supabase
      .from("profiles_roles")
      .select(`roles(role)`)
      .eq("profile_id", user.id);
    if (roles) {
      const rolesArray = roles
        .filter((item) => item.roles?.role) // Filter out null or undefined roles
        .map((item) => item.roles!.role);
      role = rolesArray;
    }
  }

  const school = await getSchool();

  return (
    <div className="w-full flex flex-col items-center">
      {typeof school !== "string" && <SyllabusFilter /> }
    </div>
  );
}

type ExtractArrayElementType<T> = T extends (infer U)[] ? U : never;

const getSchool = async () => {
  const supabase = createClient(cookies());

  const { data: school, error } = await supabase
    .from("syll_school")
    .select(`*`);
  if (error) {
    return error.message;
  }
  return school;
};
