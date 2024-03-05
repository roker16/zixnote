"use client";
import { useBoundStore } from "@/store/zustand";
import { Group } from "@mantine/core";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { PersonalBook } from "./PersonalBook";

export default function PersonalParent({ canModerate }: { canModerate: boolean }) {
  const router = useRouter();
  let [isPending, startTransition] = useTransition();

  const updateSyllabus = useBoundStore().updateSyllabus;


  const handleSelectedBook = (id: number, name: string) => {
    const url = new URL(window.location.href);
    url.searchParams.set("id", id.toString());
    url.searchParams.set("name", name);

    startTransition(() => {
      router.replace(url.toString());
    });

    updateSyllabus({ id: id, name: name });
  };
  return (
    <div>
      {/* {isPending && "Loading......"} */}
      <Group justify="center" grow>
        <PersonalBook
          action={handleSelectedBook}
          canModerate={canModerate}
        />
      </Group>
    </div>
  );
}
