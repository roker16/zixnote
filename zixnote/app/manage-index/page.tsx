"use client"
import NestedIndex from "@/app/manage-index/component";
import SunEditorTest from "@/components/Editor/Suneditor";
import { createClient } from "@/utils/supabase/client";
import { Database } from "@/utils/supabase/supatype";

import { transformFlatToNested } from "@/utils/transformFlatToNested";
import { cookies } from "next/headers";
import { useState } from "react";

export type ActionProps = {
  mode: "edit" | "create" | "delete";
  data: Database["public"]["Tables"]["syll_index"]["Row"];
};
export default async function Index() {
  const [mode, setMode] = useState<ActionProps>();

  const supabase = createClient();

  let { data: syll_index, error } = await supabase
    .from("syll_index")
    .select("*");

  // const isSupabaseConnected = canInitSupabaseClient();

  return (
    <div className="w-full flex flex-col gap-20 items-center">
      Index
      <NestedIndex data={transformFlatToNested(syll_index!)} />
    </div>
  );
}
