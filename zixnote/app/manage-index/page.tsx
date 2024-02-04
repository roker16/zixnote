import NestedIndex from "@/app/manage-index/component";
import { createClient } from "@/utils/supabase/server";

import { transformFlatToNested } from "@/utils/transformFlatToNested";
import { cookies } from "next/headers";

import SyllabusFilter from "./component/SyllabusFilter";
import IndexTitle from "./component/IndexTitle";
import { Space } from "@mantine/core";

export default async function Index({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  let syll_index: any;
  if (searchParams?.id) {
    syll_index = await getIndex(Number(searchParams?.id));
  } else {
    syll_index = [];
  }
  // const syll_index = await getIndex(searchParams?.id);
  const school = await getSchool();
  return (
    <div className="w-full flex flex-col items-center">
      {typeof school !== "string" && <SyllabusFilter />}
      <Space h="md" />
      <Space h="md" />
      <div className="grid grid-cols-9 w-full min-h-lvh">
        {/* 3 parts */}
        <div className="col-span-2 ">
          <div className="p-2 min-h-dvh rounded-r-md bg-gray-100">
            {searchParams?.id && searchParams?.name && (
              <IndexTitle
                id={Number(searchParams?.id)}
                name={searchParams?.name as string}
              />
            )}
            {typeof syll_index === "string" ? (
              <p>Error: {syll_index}</p>
            ) : syll_index === null || syll_index?.length === 0 ? (
              <p className="opacity-50 italic">Relevant data does not exist!</p>
            ) : (
              <div>
                <NestedIndex data={transformFlatToNested(syll_index)} />
              </div>
            )}
          </div>
        </div>

        {/* 7 parts */}
        <div className="col-span-6">{/* Your content here */}</div>

        {/* 2 parts */}
        <div className="col-span-1 bg-blue-200">{/* Your content here */}</div>
      </div>
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

  const { data: school, error } = await supabase
    .from("syll_school")
    .select(`*`);
  if (error) {
    return error.message;
  }
  return school;
};
