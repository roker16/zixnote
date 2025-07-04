import { Center, Text } from "@mantine/core";
import { getUserAndRole } from "../../../utils/getUserAndRole";

import GoogleSignin from "@/components/GoogleSignin";
import { createClient } from "@/utils/supabase/server";
import CreateNotesForm from "../component/CreateNotesForm";
import { MyAlert } from "./MyAlert";
import Notes from "./notes";
import ShareButton from "./ShareButton";

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
  //Deactivate subscription for now
  // const subscription = await getSubscriptionServer(user.id);
  // if (subscription && subscription.length === 0) {
  //   return (
  //     <Center>
  //       <MyAlert
  //         title={"Subscribe to access all the features"}
  //         detail={
  //           <div>
  //             {/* Subscribe to access all the features{" "} */}
  //             <span>
  //               <Link href="/pricing">Subscribe</Link>
  //             </span>
  //           </div>
  //         }
  //       />
  //     </Center>
  //   );
  // }
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
  const selectedTopicId = searchParams?.headingid as string;
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
      <Center>
        <div className=" flex items-center gap-1">
          <ShareButton userId={user.id} />
          <div className="text-center">
            {" "}
            <Text fw={500}>{selectedName}</Text>
          </div>
        </div>
      </Center>

      <Notes topicId={selectedTopicId as string} userId={user.id} />
      <Center h={"100px"}>
        <CreateNotesForm />
      </Center>
    </div>
    // </Box>
  );
}
async function getNotes(indexId: number, userId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("notes")
    .select(`*`)
    .eq("index_id_fk", indexId)
    .eq("owner_fk", userId);

  return data;
}
