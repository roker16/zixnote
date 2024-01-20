import NestedIndex from "@/app/manage-index/component";
import { createClient } from "@/utils/supabase/server";

import { transformFlatToNested } from "@/utils/transformFlatToNested";
import { cookies } from "next/headers";

export default async function Index() {
  const syll_index = await getIndex(cookies, 1);
  return (
    <div className="w-full flex flex-col items-center">
      {typeof syll_index === "string" ? (
        <p>Error: {syll_index}</p>
      ) : syll_index === null || syll_index?.length === 0 ? (
        <p className="opacity-50 italic">Relevant data does not exist!</p>
      ) : (
        <div>
          <p className="menu-title text-lg">{syll_index[0].syll_syllabus_entity?.syllabus_name}</p>
          <NestedIndex data={transformFlatToNested(syll_index)} />
        </div>
      )}
    </div>
  );
}
const getIndex = async (cookies: any, indexId: number) => {
  const supabase = createClient(cookies());

  let { data: syll_index, error } = await supabase
    .from("syll_index")
    .select(
      `index_id,
    syllabus_id,
    syll_syllabus_entity(id,syllabus_name),
      parent_index_id,
      index_name,
      category_id,
      sequence`
    )
    .eq("syllabus_id", indexId);
  if (error) {
    return error.message;
  }
  return syll_index;
};
type ReturnTypeOfGetIndex = Awaited<ReturnType<typeof getIndex>>;

type ExtractArrayElementType<T> = T extends (infer U)[] ? U : never;

type ElementTypeOfGetIndex = ExtractArrayElementType<ReturnTypeOfGetIndex>;
