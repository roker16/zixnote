"use client";
import { createClient } from "@/utils/supabase/client";
import { Autocomplete, Center, Combobox, TextInput, Text } from "@mantine/core";
import { useQuery } from "@supabase-cache-helpers/postgrest-swr";
import { useSearchParams } from "next/navigation";
import React, { Dispatch, SetStateAction, useState } from "react";

function SharedUsersCombobox({
  userId,
  onUserSelected,
}: {
  userId: string;
  onUserSelected: Dispatch<SetStateAction<string | undefined>>;
}) {
  const supabase = createClient();
  const searchParams = useSearchParams();
  const headingId = searchParams.get("headingid");
  const { data, count } = useQuery(
    supabase
      .from("notes_sharing")
      .select(
        `id,can_copy,can_edit,shared_by,shared_with,profiles!notes_sharing_shared_by_fkey(id,email)`
      )
      .eq("shared_with", userId)
      .eq("heading_id", Number(headingId)),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      revalidateIfStale: true,
    }
  );
  const names =
    data && data?.length !== 0
      ? data.map((person) => person.profiles?.email!)
      : [];
  const [value, setValue] = useState("");
  const handleChange = (email: string) => {
    if (!data) {
      return null; // Return null if data is null or undefined
    }
    for (const item of data) {
      if (item.profiles && item.profiles.email === email) {
        onUserSelected(item.shared_by);
        return;
      }
    }
    return null; // Return null if no match is found
  };
  return (
    <>
      {value}

      {names && names.length !== 0 && (
        // eslint-disable-next-line react/no-unescaped-entities
        <Center>
          <Autocomplete
            variant="filled"
            size="xs"
            w={320}
            label={
              <Text fs={"oblique"} ff={"monospace"}>Pick user to view shared notes:</Text>
            }
            placeholder="Pick value or enter anything"
            data={names}
            onChange={handleChange}
          />
        </Center>
      )}
    </>
  );
}

export default SharedUsersCombobox;
