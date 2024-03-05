import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
export const checkIfModerator = async (syllabusId: number, userId: string) => {
  const supabase = createClient(cookies());

  const { data: moderator, error } = await supabase
    .from("syll_moderator")
    .select(`id,profiles(email),status,syllabus_id`)
    .eq("syllabus_id", syllabusId)
    .eq("moderator_id", userId);
  if (error) {
    throw error;
  }
  if (moderator.length === 0) {
    return { exist: false, status: null };
  }
  return { exist: true, status: moderator[0].status };
};
export type ReturnTypeOfCheckIfModerator = Awaited<ReturnType<typeof checkIfModerator>>;

