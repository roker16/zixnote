"use client";
import { createClient } from "@/utils/supabase/client";
import { Autocomplete, Combobox, TextInput } from "@mantine/core";
import { useQuery } from "@supabase-cache-helpers/postgrest-swr";
import { useSearchParams } from "next/navigation";
import React, { useState } from "react";

function SharedUsersCombobox({ userId }: { userId: string }) {
  const supabase = createClient();
  const searchParams = useSearchParams();
  const headingId = searchParams.get("headingid");
  const { data, count } = useQuery(
    supabase
      .from("notes_sharing")
      .select(`*,profiles!notes_sharing_shared_by_fkey(id,email)`)
      .eq("shared_with", userId)
      .eq("heading_id", Number(headingId)),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      revalidateIfStale: true,
    }
  );
  const [value, setValue] = useState("");

  return (
    <>
    {data && data.length !==0 && data.map((s)=>{return <div key={s.profiles?.email}>{s.profiles?.email}</div>})}
      <Autocomplete
        label="Pick user to view shared notes:"
        placeholder="Pick value or enter anything"
        data={["React", "Angular", "Vue", "Svelte"]}
      />
    </>
  );
}

export default SharedUsersCombobox;
