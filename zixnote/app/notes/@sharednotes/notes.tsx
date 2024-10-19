"use client";
import { createClient } from "@/utils/supabase/client";
import { Accordion, ActionIcon, Center, Menu, rem } from "@mantine/core";
import {
  useDeleteMutation,
  useQuery,
} from "@supabase-cache-helpers/postgrest-swr";
import {
  IconDotsVertical,
  IconEditCircle,
  IconPhoto,
  IconTrash
} from "@tabler/icons-react";
import { useState } from "react";
import NotesTab from "./NotesTab";

function Notes({ topicId, userId }: { topicId: string; userId: string }) {
  const [value, setValue] = useState<string[] | undefined>(undefined);
  const supabase = createClient();

  const { trigger: deleteNote } = useDeleteMutation(
    supabase.from("notes"),
    ["id"],
    null,
    {
      onSuccess: () => console.log("Success!"),
    }
  );
  const handleDelete = async (id: number) => {
    alert("Confirm to delete!")
    await deleteNote({ id: id });
  };
  const { data, count } = useQuery(
    supabase
      .from("notes")
      .select("id,title,notes_english,order,type", { count: "exact" })
      .eq("index_id_fk", topicId)
      .eq("owner_fk", userId)
      .order("order", { ascending: true }),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      revalidateIfStale: true,
    }
  );

  const items = data
    ?.sort((a, b) => a.order - b.order)
    .map((item) => (
      <Accordion.Item
        key={item.id}
        value={item.id.toString()}
        bg={"var(--mantine-color-gray-1)"}
        my={"xs"}
        
      >
        <Center>
       

          <Accordion.Control>{item.title}</Accordion.Control>
        </Center>
        <Accordion.Panel >
          {value?.includes(item.id.toString()) && (
            <NotesTab notesId={item.id!} />
          )}
        </Accordion.Panel>
      </Accordion.Item>
    ));

  return (
    <div>
      <Accordion
        variant="filled"
        multiple
        radius="xs"
        value={value}
        onChange={setValue}
      >
        {items}
      </Accordion>
      {/* {JSON.stringify(data)} */}
    </div>
  );
}

export default Notes;
