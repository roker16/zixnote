import { createClient } from "@/utils/supabase/client";
import { ActionIcon, Center, Checkbox, Table, Text } from "@mantine/core";
import {
  useDeleteMutation,
  useQuery,
} from "@supabase-cache-helpers/postgrest-swr";
import { IconXboxX } from "@tabler/icons-react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
function SharedList() {
  const supabase = createClient();
  const searchParams = useSearchParams();
  const headingId = searchParams.get("headingid");
  const { data, count } = useQuery(
    supabase
      .from("notes_sharing")
      .select(
        `id,profiles1:profiles!shared_by(email), profiles2:profiles!shared_with(email),can_copy,can_edit`
      )
      .eq("heading_id", Number(headingId)),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      revalidateIfStale: true,
    }
  );
  const { trigger: deleteNote } = useDeleteMutation(
    supabase.from("notes_sharing"),
    ["id"],
    null,
    {
      onSuccess: () => console.log("Success!"),
    }
  );
  const handleDelete = async (id: number) => {
    await deleteNote({ id: id });
  };

  const [loading, setLoading] = useState(false);
  const rows = data?.map((p) => (
    <Table.Tr key={(p?.profiles2 as any).email}>
      <Table.Td>
        <Checkbox defaultChecked={p.can_copy!} size="xs" />
      </Table.Td>
      <Table.Td>
        <Checkbox defaultChecked={p.can_edit!} size="xs" />
      </Table.Td>
      <Table.Td>
        <ActionIcon
          variant="subtle"
          size={"sm"}
          onClick={() => handleDelete(p.id)}
        >
          <IconXboxX style={{ width: "70%", height: "70%" }} stroke={1.5} />
        </ActionIcon>
      </Table.Td>
      <Table.Td>
        <Text c="dimmed" size="sm">
          {(p?.profiles2 as any).email}
        </Text>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <Table>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Copy</Table.Th>
          <Table.Th>Edit</Table.Th>
          <Table.Th>Delete</Table.Th>
          <Table.Th>Email</Table.Th>
        </Table.Tr>
      </Table.Thead>
      {loading ? (
        <Center h={60} w={240}>
          {"loading...."}
        </Center>
      ) : (
        <Table.Tbody>{rows}</Table.Tbody>
      )}
    </Table>
  );
}

export default SharedList;
