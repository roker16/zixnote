import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { ExtractArrayElementType } from "@/utils/helper";

export const getModerator = async (syllabusId: number) => {
  const supabase = await createClient();

  const { data: moderator, error } = await supabase
    .from("syll_moderator")
    .select(`id,profiles(email),status,syllabus_id`)
    .eq("syllabus_id", syllabusId);
  if (error) {
    throw error;
  }
  return moderator;
};
type ReturnTypeOfGetModerator = Awaited<ReturnType<typeof getModerator>>;
export type ElementTypeOfGetModerator =
  ExtractArrayElementType<ReturnTypeOfGetModerator>;
