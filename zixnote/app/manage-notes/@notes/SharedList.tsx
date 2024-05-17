import { createClient } from "@/utils/supabase/client";
import { ActionIcon, Checkbox, Table, Text } from "@mantine/core";
import { QueryData } from "@supabase/supabase-js";
import { IconXboxX } from "@tabler/icons-react";
import { useEffect, useState } from "react";
function SharedList() {
  const supabase = createClient();
//   const countriesWithCitiesQuery = supabase
//     .from("notes_sharing")
//     .select(
//       `id,profiles1:profiles!shared_by(email), profiles2:profiles!shared_with(email),can_copy,can_edit`
//     );

//   type CountriesWithCities = QueryData<typeof countriesWithCitiesQuery>;
  const [sharedList, setSharedList] = useState<any>();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const getSharedList = async () => {
      const { data, error } = await supabase
      .from("notes_sharing")
      .select(
        `id,profiles1:profiles!shared_by(email), profiles2:profiles!shared_with(email),can_copy,can_edit`
      );;
      setSharedList(data);
    };
    getSharedList();
    console.log("rerendering....")
  }, [supabase]);

  const handleDelete = async (id: Number) => {
    const { error } = await supabase
      .from("notes_sharing")
      .delete()
      .eq("id", id);
  };
  const rows = sharedList?.map((p:any) => (
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
      <Table.Tbody>{rows}</Table.Tbody>
    </Table>
  );
}

export default SharedList;
