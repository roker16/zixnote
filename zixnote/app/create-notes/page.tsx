import React from "react";
import NestedIndex from "./component";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { transformFlatToNested } from "@/app/manage-index/transformFlatToNested";

async function page() {
  const supabase = createClient(cookies());

  const query = `index_id,
    syllabus_id,
    syll_syllabus_entity(id,syllabus_name),
      parent_index_id,
      index_name,
      category_id,
      sequence`;
  let { data: syll_index, error } = await supabase
    .from("syll_index")
    .select(query);
  return (
    <div>
      <NestedIndex data={transformFlatToNested(syll_index!)} />
    </div>
  );
}

export default page;
