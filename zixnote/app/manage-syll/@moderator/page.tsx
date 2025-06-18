import GoogleSignin from "@/components/GoogleSignin";
import { Box, Center, Space } from "@mantine/core";
import Link from "next/link";
import { getUserAndRole } from "../../../utils/getUserAndRole";
import AskToBeModerator from "../component/AskToBeModerator";
import ModeratorForm from "../component/ModeratorForm";
import Moderators from "../component/Moderators";
import { getModerator } from "./getModerator";

import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import NoticeText from "@/components/NoticeText";
import { Demo } from "../Test";

export default async function Index({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const { user, role } = await getUserAndRole();

  const moderator =
    searchParams?.id && !isNaN(Number(searchParams.id)) //when we clear selectbox, id sets to NaN in URL
      ? await getModerator(Number(searchParams?.id))
      : [];

  const centerGrid = async () => {
    if (!user) {
      // Block 1: User is not logged in
      return (
        <Center w={"full"}>
          <GoogleSignin />
        </Center>
      );
    }

    if (!searchParams?.id || isNaN(Number(searchParams.id))) {
      // Block 2: User is logged in, but no syllabus selected
      return (
        <Center h="200px">
          <NoticeText
            text={"No syllabus selected, Select syllabus from above filters!"}
          />
        </Center>
      );
    }
    const isSyllabusPersonal = await checkIfPersonal(Number(searchParams?.id));
    if (isSyllabusPersonal) {
      return (
        <NoticeText
          text={
            "This is your Personal Index, you can edit it without any permission!"
          }
        />
      );
    }
    if (searchParams?.id && role?.includes("admin")) {
      // Block 3: User is logged in, syllabus selected, and has admin role
      return (
        <>
          <ModeratorForm syllabusId={Number(searchParams?.id)} />
          <Space h="xl" />
          <Moderators data={moderator} />
        </>
      );
    }

    const userIsModerator = moderator.find(
      (mod) => mod.profiles?.email === user?.email
    );

    if (userIsModerator) {
      // Block 4
      return (
        <Center h="200px">
          <div className="italic opacity-60">
            {userIsModerator.status === "enabled" ? (
              <NoticeText
                text={"You are a moderator. You can Modify this Index!"}
              />
            ) : (
              <NoticeText
                text={
                  "You can not modify this Index, You are a moderator, but currently disabled. Wait for permission!!"
                }
              />
            )}
          </div>
        </Center>
      );
    }

    // Block 5: User is neither an admin nor a moderator
    return (
      <Center h="200px">
        <AskToBeModerator
          userId={user.id}
          syllabusId={Number(searchParams?.id)}
        />
      </Center>
    );
  };

  return (
    <Box>
      <div className="w-full flex flex-col items-center">
        <div className="col-span-5">{centerGrid()}</div>
        {/* <Link href={"/manage-syll/total"}>total</Link> */}
        {/* <Link href={"/manage-syll/total/inside-total"}>insdie total</Link> */}
        {/* <Refresh /> */}
      </div>
    </Box>
  );
}
async function checkIfPersonal(id: number) {
  const supabase = await createClient();
  const userId = (await supabase.auth.getUser()).data.user?.id;
  const { data, error } = await supabase
    .from("syll_syllabus_entity")
    .select(`id,type_id, owner_id`)
    .eq("id", id)
    .eq("owner_id", userId!);

  if (data && data.length === 0) {
    return false;
  }
  return true;
}
