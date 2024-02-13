import { createClient } from "@/utils/supabase/server";

import { cookies } from "next/headers";

import { ExtractArrayElementType, wait } from "@/utils/helper";
import { transformFlatToNested } from "@/utils/transformFlatToNested";
import NestedIndex from "../component";
import IndexTitle from "../component/IndexTitle";

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
  let syll_index: any;
  if (searchParams?.id) {
    syll_index = await getIndex(Number(searchParams?.id));
  } else {
    syll_index = [];
  }

 
  

  return (
    <div className="w-full flex flex-col items-center">
      <div className="p-2 min-h-dvh w-full rounded-r-md bg-gray-100">
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
  );
}

const getIndex = async (indexId: number) => {
  const supabase = createClient(cookies());
  wait(10000);
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
    throw error;
    // return error.message;
  }
  return syll_index;
};
type ReturnTypeOfGetIndex = Awaited<ReturnType<typeof getIndex>>;
export type ElementTypeOfGetIndex =
  ExtractArrayElementType<ReturnTypeOfGetIndex>;
