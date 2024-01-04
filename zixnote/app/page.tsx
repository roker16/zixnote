import NestedIndex from "@/components";
import SunEditorTest from "@/components/Editor/Suneditor";

import { createClient } from "@/utils/supabase/server";
import { transformFlatToNested } from "@/utils/transformFlatToNested";
import { cookies } from "next/headers";

export default async function Index() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  // const canInitSupabaseClient = () => {
  //   // This function is just for the interactive tutorial.
  //   // Feel free to remove it once you have Supabase connected.
  //   try {
  //     createClient(cookieStore);
  //     return true;
  //   } catch (e) {
  //     return false;
  //   }
  // };

  let { data: syll_index, error } = await supabase
    .from("syll_index")
    .select("*");

  // const isSupabaseConnected = canInitSupabaseClient();

  return (
    <div className="flex-1 w-full flex flex-col gap-20 items-center">
      <SunEditorTest/>
      <NestedIndex data={transformFlatToNested(syll_index!)} />
    </div>
  );
}
