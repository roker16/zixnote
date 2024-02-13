import GoogleSignin from "@/components/GoogleSignin";
import { Center } from "@mantine/core";
import Link from "next/link";
import AskToBeModerator from "../component/AskToBeModerator";
import ModeratorForm from "../component/ModeratorForm";
import Moderators from "../component/Moderators";
import Refresh from "./Refresh";
import { getUserAndRole } from "../../../utils/getUserAndRole";
import { getModerator } from "./getModerator";

export default async function Index({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const { user, role } = await getUserAndRole();

  const moderator = searchParams?.id
    ? await getModerator(Number(searchParams?.id))
    : [];
  const centerGrid = () => {
    if (!user) {
      // Block 1: User is not logged in
      return (
        <Center h="200px">
          <GoogleSignin />
        </Center>
      );
    }

    if (!searchParams?.id) {
      // Block 2: User is logged in, but no syllabus selected
      return <Center h="200px">Select syllabus from above filter!</Center>;
    }

    if (searchParams?.id && role?.includes("admin")) {
      // Block 3: User is logged in, syllabus selected, and has admin role
      return (
        <>
          <ModeratorForm syllabusId={Number(searchParams?.id)} />
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
          {userIsModerator.status === "enabled"
            ? "You are a moderator!"
            : "You are a moderator, but currently disabled."}
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
    <div className="w-full flex flex-col items-center">
      <div className="col-span-5">{centerGrid()}</div>
      <Link href={"/manage-index-1/total"}>total</Link>
      <Refresh />
    </div>
  );
}
