import GoogleSignin from "@/components/GoogleSignin";
import { getUserAndRole } from "@/utils/getUserAndRole";
import { Center } from "@mantine/core";
import CreateNotesForm from "../component/CreateNotesForm";

import { createClient } from "@/utils/supabase/server";
import { MyAlert } from "../@notes/MyAlert";
import ShareButton from "../@notes/ShareButton";
import AiNotesAccordion from "./AiNotesAccordion";

export default async function page({
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

  const selectedName = await getHeadingNameFromId(Number(selectedTopicId));

  return (
    // <Box>
    <div className="mx-0">
      <Center>
        <div className=" flex items-center gap-1">
          <ShareButton userId={user.id} />
          <div className="text-center">
            {" "}
            <div>{selectedName} </div>
          </div>
        </div>
      </Center>

      <AiNotesAccordion topicId={selectedTopicId as string} userId={user.id} />
      <Center h={"100px"}>
        <CreateNotesForm />
      </Center>
    </div>
    // </Box>
  );
}
async function getHeadingNameFromId(indexId: number) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("syll_index")
    .select(`*`)
    .eq("index_id", indexId)
    .single();

  return data?.index_name;
}
