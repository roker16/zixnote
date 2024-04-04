"use client";
import Suneditor from "@/components/Editor/Suneditor";
import { createClient } from "@/utils/supabase/client";
import { Tabs, Skeleton } from "@mantine/core";
import { useQuery } from "@supabase-cache-helpers/postgrest-swr";
import { useSearchParams } from "next/navigation";

function NotesTab({ notesId }: { notesId: number }) {
  const supabase = createClient();

  
  const { data, count } = useQuery(
    notesId
      ? supabase
          .from("notes")
          .select("id,notes_english")
          .eq("id", notesId)
          .single()
      : null,

    {
      revalidateOnFocus: true,
      revalidateOnReconnect: false,
      revalidateIfStale:true,
    }
  );
  return (
    <div>
      <Tabs defaultValue="english" >
        <Tabs.List >
          <Tabs.Tab value="english">English</Tabs.Tab>
          <Tabs.Tab value="hindi">Hindi</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="english">
          {data ? (
            <Suneditor notesId={notesId} notesContent={data?.notes_english} />
          ) : (
            <Skeletons/>
          )}
        </Tabs.Panel>
        <Tabs.Panel value="hindi">
          {data && (
            <Suneditor notesId={notesId} notesContent={data?.notes_english} />
          )}
        </Tabs.Panel>
      </Tabs>
    </div>
  );
}

export default NotesTab;

function Skeletons() {
  return (
    <>
      <Skeleton height={50} circle mb="xl" />
      <Skeleton height={8} radius="xl" />
      <Skeleton height={8} mt={6} radius="xl" />
      <Skeleton height={8} mt={6} width="70%" radius="xl" />
    </>
  );
}
