import NestedIndex from "../component";
import IndexTitle from "../component/IndexTitle";
import { getIndex } from "./getIndex";
import { getUserAndRole } from "@/utils/getUserAndRole";

import { transformFlatToNested } from "../transformFlatToNested";

export default async function Index({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const indexId = Number(searchParams?.id);
  const index = indexId ? await getIndex(indexId) : null;
  const { role, user } = await getUserAndRole();

  return (
    <div className="w-full flex flex-col items-center">
      <div className="p-2 min-h-dvh w-full rounded-r-md bg-gray-100">
        {indexId && searchParams?.name ? (
          <IndexTitle id={indexId} name={searchParams.name as string} />
        ) : null}
        {index && <NestedIndex data={transformFlatToNested(index)} />}
      </div>
    </div>
  );
}
