import NestedIndex from "@/app/manage-index/component";
import SunEditorTest from "@/components/Editor/Suneditor";
import IndexForm from "@/app/manage-index/component/IndexForm";
import { createClient } from "@/utils/supabase/server";
import { transformFlatToNested } from "@/utils/transformFlatToNested";
import { cookies } from "next/headers";
import MyCombobox from "./create-notes/component/SearchBox";

export default async function Index() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  let { data: syll_index, error } = await supabase
    .from("syll_index")
    .select("*");

  // const isSupabaseConnected = canInitSupabaseClient();

  return (
    <div className="w-full flex flex-col gap-20 items-center">
      hello
      <MyCombobox />
      <SunEditorTest />
      <div className=" overflow-y-auto">
        {/* <NestedIndex data={transformFlatToNested(syll_index!)} /> */}
      </div>
    </div>
  );
}
