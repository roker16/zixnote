import NestedIndex from "@/app/manage-index/component";
import { createClient } from "@/utils/supabase/server";

import { Database } from "@/utils/supabase/supatype";
import { transformFlatToNested } from "@/utils/transformFlatToNested";
import { cookies } from "next/headers";

export type ActionProps = {
  mode: "edit" | "create" | "delete";
  data: Database["public"]["Tables"]["syll_index"]["Row"];
};
export default async function Index() {
  const supabase = createClient(cookies());

  let { data: syll_index, error } = await supabase.from("syll_index").select(
    `index_id,
    syllabus_id,
    syll_syllabus_entity(id,syllabus_name),
      parent_index_id,
      index_name,
      category_id,
      sequence`
  );

  // const isSupabaseConnected = canInitSupabaseClient();

  return (
    <div className="w-full flex flex-col  items-center">
      <NestedIndex data={transformFlatToNested(syll_index!)} />
    </div>
  );
}
