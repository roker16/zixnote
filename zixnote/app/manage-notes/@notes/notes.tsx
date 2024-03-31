"use client";
import React, { useState } from "react";
import { useQuery } from "@supabase-cache-helpers/postgrest-swr";
import { createClient } from "@/utils/supabase/client";
import { Accordion, rem } from "@mantine/core";
import { IconNotebook, IconPhoto } from "@tabler/icons-react";
import NotesTab from "./NotesTab";

function Notes({ topicId, userId }: { topicId: string; userId: string }) {
  const [value, setValue] = useState<string[] | undefined>(undefined);
  const supabase = createClient();
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
    ?.sort((a, b) => a.id - b.id)
    .map((item) => (
      <Accordion.Item key={item.id} value={item.id.toString()} bg={"var(--mantine-color-gray-0)"} my={"xs"}>
        <Accordion.Control
          icon={
            <IconNotebook
              style={{
                color: "var(--mantine-color-red-6",
                width: rem(20),
                height: rem(20),
              }}
            />
          }
        >
          {item.title + item.id}
        </Accordion.Control>
        <Accordion.Panel>
          {value?.includes(item.id.toString()) && (
            <NotesTab notesId={item.id!} />
          )}
        </Accordion.Panel>
      </Accordion.Item>
    ));

  return (
    <div>
      {"value is " + value}
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
      {count}
    </div>
  );
}

export default Notes;
