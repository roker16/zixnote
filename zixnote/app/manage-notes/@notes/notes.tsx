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
  IconTrash,
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
    await deleteNote({ id: id });
  };
  const { data, count } = useQuery(
    supabase
      .from("notes")
      .select("id,title,notes_english,order,type", { count: "exact" })
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
        <Center>
          <Menu shadow="md" width={200} position="bottom-start">
            <Menu.Target>
              <ActionIcon size="lg" variant="subtle" color="gray">
                <IconDotsVertical size="1rem" />
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
              {/* <Menu.Label>Application</Menu.Label> */}
              <Menu.Item
                leftSection={
                  <IconEditCircle style={{ width: rem(14), height: rem(14) }} />
                }
              >
                Edit
              </Menu.Item>
              <Menu.Item
                onClick={() => {
                  handleDelete(item.id);
                }}
                leftSection={
                  <IconTrash style={{ width: rem(14), height: rem(14) }} />
                }
              >
                Delete
              </Menu.Item>
              {/* <Menu.Item
                leftSection={
                  <IconPhoto style={{ width: rem(14), height: rem(14) }} />
                }
              >
                Gallery
              </Menu.Item> */}
            </Menu.Dropdown>
          </Menu>

          <Accordion.Control>{item.title}</Accordion.Control>
        </Center>
        <Accordion.Panel>
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
