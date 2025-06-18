import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
export const checkIfModerator = async (syllabusId: number, userId: string) => {
  const supabase = await createClient();

  const { data: owner, error: ownerError } = await supabase
    .from("syll_syllabus_entity")
    .select(`id,type_id,owner_id`)
    .eq("id", syllabusId)
    .eq("owner_id", userId);

  if (owner && owner.length !== 0) {
    return { exist: true, status: null, personal: true };
  }

  const { data: moderator, error } = await supabase
    .from("syll_moderator")
    .select(`id,profiles(email),status,syllabus_id`)
    .eq("syllabus_id", syllabusId)
    .eq("moderator_id", userId);
  if (error) {
    throw error;
  }

  if (moderator.length === 0) {
    return { exist: false, status: null, personal: false };
  }
  return { exist: true, status: moderator[0].status, personal: false };
};
export type ReturnTypeOfCheckIfModerator = Awaited<
  ReturnType<typeof checkIfModerator>
>;
