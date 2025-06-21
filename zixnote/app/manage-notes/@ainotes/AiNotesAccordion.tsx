"use client";
import { createClient } from "@/utils/supabase/client";
import { Accordion, ActionIcon, Group, Menu, rem } from "@mantine/core";
import {
  useDeleteMutation,
  useQuery,
} from "@supabase-cache-helpers/postgrest-swr";
import {
  IconDotsVertical,
  IconEditCircle,
  IconTrash,
} from "@tabler/icons-react";
import { useState } from "react";
import AiDrawer from "./AiDrawer";
import NoteContent from "./NoteContent";

interface Note {
  id: number;
  title: string;
  order: number;
  type: string;
  ainotes_english: string;
}

function AiNotesAccordion({
  topicId,
  userId,
}: {
  topicId: string;
  userId: string;
}) {
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
    await deleteNote({ id });
  };

  const { data, count } = useQuery(
    supabase
      .from("notes")
      .select("id,title,order,type,ainotes_english", { count: "exact" })
      .eq("index_id_fk", Number(topicId))
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
      <Accordion.Item
        key={item.id}
        value={item.id.toString()}
        bg={"var(--mantine-color-gray-1)"}
        my={"xs"}
      >
        <Group gap="sm" align="center" wrap="nowrap" px="sm">
          <Menu shadow="md" width={200} position="bottom-start">
            <Menu.Target>
              <ActionIcon size="lg" variant="subtle" color="gray">
                <IconDotsVertical size="1rem" />
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item
                leftSection={
                  <IconEditCircle style={{ width: rem(14), height: rem(14) }} />
                }
              >
                Edit
              </Menu.Item>
              <Menu.Item
                onClick={() => handleDelete(item.id)}
                leftSection={
                  <IconTrash style={{ width: rem(14), height: rem(14) }} />
                }
              >
                Delete
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
          <Accordion.Control style={{ flex: 1 }}>
            {item.title}
          </Accordion.Control>
          {/* <AiDrawer topicId={item.id.toString()} userId={userId} /> */}
        </Group>
        <Accordion.Panel>
          {value?.includes(item.id.toString()) && (
            <NoteContent noteId={item.id} />
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
    </div>
  );
}

export default AiNotesAccordion;
