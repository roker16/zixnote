import { Box } from "@mantine/core";
import Link from "next/link";
import { getUserAndRole } from "../../../utils/getUserAndRole";

import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { wait } from "@/utils/helper";

export default async function Index({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const { user, role } = await getUserAndRole();

  const selectedTopicId = searchParams?.headingid;
  const selectedName = searchParams?.headingname;

  return (
    <Box>
      <div className="w-full flex flex-col items-center">
        {selectedTopicId}
        {selectedName}
      
      </div>
    </Box>
  );
}
async function checkIfPersonal(id: number) {
  const supabase = createClient(cookies());
  const userId = (await supabase.auth.getUser()).data.user?.id;
  const { data, error } = await supabase
    .from("syll_syllabus_entity")
    .select(`id,type_id, owner_id`)
    .eq("id", id)
    .eq("owner_id", userId!);

  if (data && data.length === 0) {
    return false;
  }
  return true;
}
