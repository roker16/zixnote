import { createClient } from "@/utils/supabase/client";
import useSWR from "swr";

export function useIndex(id: number | undefined) {
  const { data, error, isLoading, mutate } = useSWR(
    id ? `index/${id}` : null,
    () => getIndex(id!)
  );

  return {
    user: data,
    isLoading,
    isError: error,
    mutate,
  };
}
const getIndex = async (indexId: number) => {
  const supabase = createClient();

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
  }
  return syll_index;
};
