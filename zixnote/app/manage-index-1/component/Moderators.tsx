"use client";
import { createClient } from "@/utils/supabase/client";
import { ActionIcon, Badge, Button, Center, Group } from "@mantine/core";
import { IconTrashX } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import React, { useState, useTransition } from "react";
import { ElementTypeOfGetModerator } from "../@moderator/getModerator";


function Moderators({ data }: { data: ElementTypeOfGetModerator[] }) {
  const moderatorsList = data
    .sort((a, b) => a.id - b.id)
    .map((x) => (
      <Center key={x.id}>
        <ModeratorItem data={x} />
      </Center>
    ));

  return <div>{moderatorsList}</div>;
}

export default Moderators;

function ModeratorItem({ data }: { data: ElementTypeOfGetModerator }) {
  const [loading, setLoading] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const supabase = createClient();
  const handleDelete = async (id: number) => {
    setLoading(true);
    const { error } = await supabase
      .from("syll_moderator")
      .delete()
      .eq("id", id);
    if (error) {
      console.log(error.message);
      setLoading(false);
      return;
    }
    startTransition(() => {
      router.refresh();
    });
    setLoading(false);
  };
  const toggleStatus = async (id: number, currentStatus: string) => {
    setLoading(true);
    const { error } = await supabase
      .from("syll_moderator")
      .update({ status: currentStatus === "disabled" ? "enabled" : "disabled" })
      .eq("id", id);
    if (error) {
      console.log(error.message);
      setLoading(false);
      return;
    }
    startTransition(() => {
      router.refresh();
    });
    setLoading(false);
  };

  return (
    <Group key={data.id} px={"xs"}>
      <p> {data.profiles?.email}</p>
      <Badge
        size="xs"
        variant="light"
        color={data.status === "enabled" ? "green" : "red"}
      >
        {data.status}
      </Badge>
      <Button
        loading={isPending}
        variant="light"
        onClick={() => toggleStatus(data.id, data.status!)}
      >
        {data.status === "disabled" ? "Enable" : "Disable"}
      </Button>
      <ActionIcon
        variant="subtle"
        color="red"
        loading={isPending}
        onClick={() => handleDelete(data.id)}
      >
        <IconTrashX size={"16px"} />
      </ActionIcon>
    </Group>
  );
}
