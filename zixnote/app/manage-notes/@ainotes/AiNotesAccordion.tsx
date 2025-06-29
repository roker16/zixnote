"use client";

import { createClient } from "@/utils/supabase/client";
import { Accordion, ActionIcon, Center, Group, Menu, rem } from "@mantine/core";
import {
  useDeleteMutation,
  useQuery,
} from "@supabase-cache-helpers/postgrest-swr";
import {
  IconDotsVertical,
  IconEditCircle,
  IconTrash,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";
import NoteContent from "./NoteContent";
import CreateNotesForm from "../component/CreateNotesForm";

function AiNotesAccordion({
  topicId,
  userId,
  topicText,
}: {
  topicId: string;
  userId: string;
  topicText: string | undefined;
}) {
  const [value, setValue] = useState<string[] | undefined>(undefined);
  const [isGenerating, setIsGenerating] = useState(false);
  const supabase = createClient();

  const { trigger: deleteNote } = useDeleteMutation(
    supabase.from("notes"),
    ["id"],
    null,
    {
      onSuccess: () => console.log("Note deleted successfully"),
    }
  );

  const handleDelete = async (id: number) => {
    await deleteNote({ id });
  };

  const { data, count, mutate } = useQuery(
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

  useEffect(() => {
    const generateAndSaveSubtopics = async () => {
      if (!topicText || !topicId || !userId || data === undefined) return;
      if (data!.length > 0 || isGenerating) return;

      setIsGenerating(true);

      try {
        const res = await fetch("/api/deepseek/generatesubtopic", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            topic: topicText,
            userId,
            count: 6,
            style: "academic",
          }),
        });

        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(`API Error ${res.status}: ${errorText}`);
        }

        const json = await res.json();
        const { subtopics } = json;

        if (!Array.isArray(subtopics)) throw new Error("Invalid subtopics");

        const { error } = await supabase.from("notes").insert(
          subtopics.map((title: string, index: number) => ({
            index_id_fk: Number(topicId),
            owner_fk: userId,
            title,
            order: index + 1,
            type: "notes",
          }))
        );

        if (error) throw error;

        await mutate();
      } catch (err) {
        console.error("Failed to auto-generate subtopics", err);
      } finally {
        setIsGenerating(false);
      }
    };

    generateAndSaveSubtopics();
  }, [data, topicId, userId, topicText, supabase, mutate, isGenerating]);

  const items = data
    ?.sort((a, b) => a.id - b.id)
    .map((item) => (
      <>
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
                    <IconEditCircle
                      style={{ width: rem(14), height: rem(14) }}
                    />
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
          </Group>
          <Accordion.Panel>
            {value?.includes(item.id.toString()) && (
              <NoteContent noteId={item.id} noteTitle={item.title} />
            )}
          </Accordion.Panel>
        </Accordion.Item>
      </>
    ));

  return (
    <div>
      {isGenerating && (
        <div className="flex items-center justify-center my-12 gap-2 py-4 px-3 text-sm text-gray-700 bg-blue-50 border border-blue-200 rounded-md shadow-sm">
          <div className="flex gap-1">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:0s]"></div>
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
          </div>
          <span className="italic">
            Generating note titles for this topic...
          </span>
        </div>
      )}
      <Accordion
        variant="filled"
        multiple
        radius="xs"
        value={value}
        onChange={setValue}
      >
        {items}
      </Accordion>
      {!isGenerating && (
        <Center h={"100px"}>
          <CreateNotesForm />
        </Center>
      )}
    </div>
  );
}

export default AiNotesAccordion;
