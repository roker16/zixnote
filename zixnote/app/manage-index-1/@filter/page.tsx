import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import SyllabusFilter from "../component/SyllabusFilter";

export default async function Index() {
  const school = await getSchool();
  return (
    <div className="w-full flex flex-col items-center">
      {typeof school !== "string" && <SyllabusFilter />}
    </div>
  );
}

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
