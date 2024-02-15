import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { ExtractArrayElementType } from "@/utils/helper";

export const getIndex = async (indexId: number) => {
  const supabase = createClient(cookies());

  const { data: syll_index } = await supabase
    .from("syll_index")
    .select(
      `
        index_id,
        syllabus_id,
        syll_syllabus_entity(id, syllabus_name),
        parent_index_id,
        index_name,
        category_id,
        sequence
      `
    )
    .eq("syllabus_id", indexId);

  return syll_index;
};

type ReturnTypeOfGetIndex = Awaited<ReturnType<typeof getIndex>>;
export type ElementTypeOfGetIndex =
  ExtractArrayElementType<ReturnTypeOfGetIndex>;
