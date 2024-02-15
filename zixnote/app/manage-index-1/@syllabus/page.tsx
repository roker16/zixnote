import { transformFlatToNested } from "@/app/manage-index-1/transformFlatToNested";

import NestedIndex from "../component";
import IndexTitle from "../component/IndexTitle";
import { getIndex } from "./getIndex";

export default async function Index({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const indexId = Number(searchParams?.id);
  const index = indexId ? await getIndex(indexId) : null;
  return (
    <div className="w-full flex flex-col items-center">
      <div className="p-2 min-h-dvh w-full rounded-r-md bg-gray-100">
        {indexId && searchParams?.name && (
          <IndexTitle id={indexId} name={searchParams.name as string} />
        )}
        {index && index.length > 0 ? (
          <NestedIndex data={transformFlatToNested(index)} />
        ) : (
          <div className="opacity-60 italic">
            Data does not exist, click on add Chapter and start adding data...
          </div>
        )}
      </div>
    </div>
  );
}
