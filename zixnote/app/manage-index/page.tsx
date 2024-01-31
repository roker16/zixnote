
import NestedIndex from "@/app/manage-index/component";
import { createClient } from "@/utils/supabase/server";

import { transformFlatToNested } from "@/utils/transformFlatToNested";
import { cookies } from "next/headers";
import CreateForm from "./component/CreateForm";
import { Level } from "./component/Filters/Level";

export default async function Index() {
  const syll_index = await getIndex(1);
  const school = await getSchool();
  return (
    <div className="w-full flex flex-col items-center">
     
      {/* <Parent/> */}
      {typeof syll_index === "string" ? (
        <p>Error: {syll_index}</p>
      ) : syll_index === null || syll_index?.length === 0 ? (
        <p className="opacity-50 italic">Relevant data does not exist!</p>
      ) : (
        <div>
          {typeof school === "string" ? (
            <p>Error: {school}</p>
          ) : (
            <Level data={school!} />
          )}
          <div className="flex flex-row flex-nowrap items-center gap-2 m-2">
            <p className=" text-md font-semibold opacity-70 uppercase">
              {syll_index[0].syll_syllabus_entity?.syllabus_name}
            </p>
            <CreateForm
              parentId={undefined}
              syllabusId={1}
              label="Add chapter"
            />
          </div>
          <NestedIndex data={transformFlatToNested(syll_index)} />
        </div>
      )}
    </div>
  );
}

const getIndex = async (indexId: number) => {
  const supabase = createClient(cookies());

  const { data: syll_index, error } = await supabase
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

export type ElementTypeOfGetIndex =
  ExtractArrayElementType<ReturnTypeOfGetIndex>;
const getSchool = async () => {
  const supabase = createClient(cookies());

  const { data: school, error } = await supabase.from("syll_school").select(`*`);
  if (error) {
    return error.message;
  }
  return school;
};
