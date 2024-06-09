import { Center, Text } from "@mantine/core";
import { getUserAndRole } from "../../../utils/getUserAndRole";

import { getSubscriptionServer } from "@/app/pricing/getSubscriptionServer";
import GoogleSignin from "@/components/GoogleSignin";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import Link from "next/link";
import CreateNotesForm from "../component/CreateNotesForm";
import { MyAlert } from "./MyAlert";
import Notes from "./notes";
import ShareButton from "./ShareButton";
import SharedUsersCombobox from "./SharedUsersCombobox";
import { User } from "@supabase/supabase-js";
import NotesContainer from "./NotesContainer";

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
  const subscription = await getSubscriptionServer(user.id);
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

 

  return (
    // <Box>
    <div className="mx-0">
      <Center>
        <div className=" flex items-center gap-1">
          <div className="text-center">
            {" "}
            <Text fw={500}>{selectedName}</Text>
          </div>
        </div>
      </Center>
    {/* without using key it will not rerender when topic is changed and give old user data */}
      <NotesContainer key={selectedTopicId} user={user} selectedTopicId={selectedTopicId}/>
    </div>
    // </Box>
  );
}



