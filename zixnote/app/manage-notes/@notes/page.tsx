import { Box, Center, Flex, Text } from "@mantine/core";
import { getUserAndRole } from "../../../utils/getUserAndRole";

import GoogleSignin from "@/components/GoogleSignin";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import SunEditorTest from "@/components/Editor/Suneditor";
import Notes from "./notes";
import { Suspense } from "react";
import { MyAlert } from "./MyAlert";

export default async function Index({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const { user, role } = await getUserAndRole();
  if (!user) {
    return (
      <Center>
        <GoogleSignin />
      </Center>
    );
  }
  const selectedSyllabus = searchParams?.id;
  if (!selectedSyllabus) {
    return (
      <Center>
        <MyAlert
          title={"Select Syllabus"}
          detail={"Select syllabus from left panel."}
        />
      </Center>
    );
  }
  const selectedTopicId = searchParams?.headingid;
  const selectedName = searchParams?.headingname;

  if (!selectedTopicId) {
    return (
      <Center>
        <MyAlert
          title={"Select Topic"}
          detail={"Select topic from index to view or create notes."}
        />
      </Center>
    );
  }

  const data = await getNotes(Number(selectedTopicId), user.id);

  return (
    // <Box>
    <div className="mx-0">
      <Suspense fallback={<div>loading...</div>}>
        <Center>
          <Text fw={500}>{selectedName}</Text>
        </Center>

        {/* {selectedName}
        {user.id} */}
      </Suspense>
      
      <Notes topicId={selectedTopicId as string} userId={user.id} />
    </div>
    // </Box>
  );
}
async function getNotes(indexId: number, userId: string) {
  const supabase = createClient(cookies());
  const { data, error } = await supabase
    .from("notes")
    .select(`*`)
    .eq("index_id_fk", indexId)
    .eq("owner_fk", userId);

  return data;
}
