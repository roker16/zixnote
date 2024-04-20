

import NestedIndex from "../component";
import IndexTitle from "../component/IndexTitle";
import { getIndex } from "./getIndex";
import { getUserAndRole } from "@/utils/getUserAndRole";
import {
  ReturnTypeOfCheckIfModerator,
  checkIfModerator,
} from "../@moderator/checkIfModerator";
import NoticeText from "@/components/NoticeText";
import { transformFlatToNested } from "../transformFlatToNested";

export default async function Index({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const indexId = Number(searchParams?.id);
  const index = indexId ? await getIndex(indexId) : null;
  const { role, user } = await getUserAndRole();
  const data =
    user && indexId ? await checkIfModerator(indexId, user?.id) : null;
  return (
    <div className="w-full flex flex-col items-center">
      <div className="p-2 min-h-dvh w-full rounded-r-md bg-gray-100">
        {indexId && searchParams?.name ? (
          <IndexTitle
            id={indexId}
            name={searchParams.name as string}
            canModerate={canModerateIndex(role, data) || false}
          />
        ) : null}
        {index && (
          <NestedIndex
            data={transformFlatToNested(index)}
            canModerate={canModerateIndex(role, data) || false}
          />
        )}

        {index === null ? (
          <NoticeText text={"Select Syllabus from filter"} />
        ) : (
          (index === null || index?.length === 0) &&
          (canModerateIndex(role, data) || false) && (
            <NoticeText
              text={
                "Index is empty, click on Add Chapter and start creating index..."
              }
            />
          )
        )}
      </div>
    </div>
  );
}

function canModerateIndex(
  role: string[] | null,
  data: ReturnTypeOfCheckIfModerator | null
) {
  // Customize this logic based on your conditions
  // For example, render NestedIndex if user has the "admin" role or data.status is "enabled"
  return (
    role?.includes("admin") ||
    (data && data.status === "enabled") ||
    data?.personal
  );
}
