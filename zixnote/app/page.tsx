import SunEditorTest from "@/components/Editor/Suneditor";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import MyCombobox from "./create-notes/component/SearchBox";
import Signup from "./signup";


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
      <Signup/>
      <MyCombobox />
      <SunEditorTest />
      
    </div>
  );
}
