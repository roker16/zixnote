import GoogleSignin from "@/components/GoogleSignin";
import { getUserAndRole } from "@/utils/getUserAndRole";
import { Center } from "@mantine/core";
import CreateNotesForm from "../component/CreateNotesForm";
import { createClient } from "@/utils/supabase/server";
import { MyAlert } from "../@notes/MyAlert";
import ShareButton from "../@notes/ShareButton";

import { getSubscriptionServer } from "@/app/pricing/getSubscriptionServer";
import Link from "next/link";
import { PDFTextUploader } from "./PDFTextUploader ";
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

  // Check test mode status
  const supabase = await createClient();
  const { data: testModeData, error: testModeError } = await supabase
    .from("settings")
    .select("setting_status")
    .eq("setting_name", "test_mode")
    .single();

  const isTestMode =
    testModeData && !testModeError && testModeData.setting_status === "enabled";

  // Check subscription only if test mode is disabled
  if (!isTestMode) {
    const subscription = await getSubscriptionServer(user.id);
    if (subscription && subscription.length === 0) {
      return (
        <Center>
          <MyAlert
            title={"Subscribe to access all the features"}
            detail={
              <div>
                <span>
                  <Link href="/pricing">Subscribe</Link>
                </span>
              </div>
            }
          />
        </Center>
      );
    }
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
    <div className="mx-0">
      <Center>
        <div className="flex items-center gap-1">
          <ShareButton userId={user.id} />
          <div className="text-center">
            <div>{selectedName}</div>
          </div>
        </div>
      </Center>
      <PDFTextUploader indexId={Number(selectedTopicId)} profileId={user.id} />

      <AiNotesAccordion
        topicId={selectedTopicId as string}
        topicText={selectedName}
        userId={user.id}
      />
      {/* <Center h={"100px"}>
        <CreateNotesForm />
      </Center> */}
    </div>
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
