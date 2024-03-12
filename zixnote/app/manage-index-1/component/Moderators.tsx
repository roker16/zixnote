"use client";
import { createClient } from "@/utils/supabase/client";
import { ActionIcon, Badge, Button, Center, Table, Text } from "@mantine/core";
import { IconTrashX } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { ElementTypeOfGetModerator } from "../@moderator/getModerator";

function Moderators({ data }: { data: ElementTypeOfGetModerator[] }) {
  const moderatorsList = data
    .sort((a, b) => a.id - b.id)
    .map((x) => <ModeratorItem key={x.id} data={x} />);

  return (
    <Table striped captionSide="top" withRowBorders={true}>
      <Table.Caption>Current moderators</Table.Caption>
      <Table.Tbody>{moderatorsList}</Table.Tbody>
    </Table>
  );
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
    <Table.Tr key={data.id} px={"xs"}>
      <Table.Td>
        <Text c={"dimmed"} size="sm">
          {" "}
          {data.profiles?.email}
        </Text>
      </Table.Td>
      <Table.Td>
        <Badge
          size="xs"
          variant="light"
          color={data.status === "enabled" ? "green" : "red"}
        >
          {data.status}
        </Badge>
      </Table.Td>
      <Table.Td>
        <Button
          loading={isPending || loading}
          variant="light"
          size="compact-sm"
          onClick={() => toggleStatus(data.id, data.status!)}
        >
          {data.status === "disabled" ? "Enable" : "Disable"}
        </Button>
      </Table.Td>
      <Table.Td>
        <ActionIcon
          variant="subtle"
          color="red"
          loading={isPending || loading}
          onClick={() => handleDelete(data.id)}
        >
          <IconTrashX size={"16px"} />
        </ActionIcon>
      </Table.Td>
    </Table.Tr>
  );
}
