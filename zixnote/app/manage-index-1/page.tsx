import NestedIndex from "@/app/manage-index/component";
import { createClient } from "@/utils/supabase/server";

import { transformFlatToNested } from "@/utils/transformFlatToNested";
import { cookies } from "next/headers";

import GoogleSignin from "@/components/GoogleSignin";
import { wait } from "@/utils/helper";
import { Center, Space } from "@mantine/core";
import AskToBeModerator from "./component/AskToBeModerator";
import IndexTitle from "./component/IndexTitle";
import ModeratorForm from "./component/ModeratorForm";
import Moderators from "./component/Moderators";
import SyllabusFilter from "./component/SyllabusFilter";

type roleType = {
  profile_id: string;
  roles: {
    role: string;
  } | null;
};

export default async function Index({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  let syll_index: any;
  if (searchParams?.id) {
    syll_index = await getIndex(Number(searchParams?.id));
  } else {
    syll_index = [];
  }
  const supabase = createClient(cookies());
  const user = (await supabase.auth.getUser()).data.user;

  let role: string[] | null = null;

  if (user) {
    const { data: roles } = await supabase
      .from("profiles_roles")
      .select(`roles(role)`)
      .eq("profile_id", user.id);
    if (roles) {
      const rolesArray = roles
        .filter((item) => item.roles?.role) // Filter out null or undefined roles
        .map((item) => item.roles!.role);
      role = rolesArray;
    }
  }

  const school = await getSchool();
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
      (mod) => mod.profiles?.email === user.email
    );

    if (userIsModerator) {
      if (userIsModerator.status === "enabled") {
        // Block 4a: User is a moderator and status is enabled
        return <Center h="200px">You are a moderator!</Center>;
      } else {
        // Block 4b: User is a moderator but status is disabled
        return (
          <Center h="200px">
            You are a moderator, but currently disabled.
          </Center>
        );
      }
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
      {typeof school !== "string" && <SyllabusFilter />}
      <Space h="md" />
      <div className="grid grid-cols-9 w-full min-h-lvh">
        {/* 3 parts */}
        <div className="col-span-3 ">
          <div className="p-2 min-h-dvh rounded-r-md bg-gray-100">
            {searchParams?.id && searchParams?.name && (
              <IndexTitle
                id={Number(searchParams?.id)}
                name={searchParams?.name as string}
              />
            )}
            {typeof syll_index === "string" ? (
              <p>Error: {syll_index}</p>
            ) : syll_index === null || syll_index?.length === 0 ? (
              <p className="opacity-50 italic">Relevant data does not exist!</p>
            ) : (
              <div>
                <NestedIndex data={transformFlatToNested(syll_index)} />
              </div>
            )}
          </div>
        </div>

        {/* 7 parts */}
        <div className="col-span-5">{centerGrid()}</div>

        {/* 2 parts */}
        <div className="col-span-1">{/* Your content here */}</div>
      </div>
    </div>
  );
}

const getIndex = async (indexId: number) => {
  const supabase = createClient(cookies());
  wait(10000);
  const { data: syll_index, error } = await supabase
    .from("syll_index")
    .select(
      `index_id,
    syllabus_id,
    syll_syllabus_entity(id,syllabus_name),
      parent_index_id,
      index_name,
      category_id,
      sequence`
    )
    .eq("syllabus_id", indexId);
  if (error) {
    throw error;
    // return error.message;
  }
  return syll_index;
};
type ReturnTypeOfGetIndex = Awaited<ReturnType<typeof getIndex>>;

type ExtractArrayElementType<T> = T extends (infer U)[] ? U : never;

export type ElementTypeOfGetIndex =
  ExtractArrayElementType<ReturnTypeOfGetIndex>;

const getSchool = async () => {
  const supabase = createClient(cookies());

  const { data: school, error } = await supabase
    .from("syll_school")
    .select(`*`);
  if (error) {
    return error.message;
  }
  return school;
};
const getModerator = async (syllabusId: number) => {
  const supabase = createClient(cookies());

  const { data: moderator, error } = await supabase
    .from("syll_moderator")
    .select(`id,profiles(email),status`)
    .eq("syllabus_id", syllabusId);
  if (error) {
    throw error;
  }
  return moderator;
};
type ReturnTypeOfGetModerator = Awaited<ReturnType<typeof getModerator>>;

// type ExtractArrayElementType<T> = T extends (infer U)[] ? U : never;

export type ElementTypeOfGetModerator =
  ExtractArrayElementType<ReturnTypeOfGetModerator>;
