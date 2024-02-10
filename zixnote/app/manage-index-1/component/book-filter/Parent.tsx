"use client";
import { useBoundStore } from "@/store/zustand";
import { Group } from "@mantine/core";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Books } from "./Books";
import { Class } from "./Class";
import { School } from "./School";

export default function Parent() {
  const router = useRouter();
  let [isPending, startTransition] = useTransition()
  const [selectedSchool, setSelectedSchool] = useState<number | undefined>(
    undefined
  );
  const [selectedClass, setSelectedClass] = useState<number | undefined>(
    undefined
  );
  const [selectedBook, setSelectedBook] = useState<number | undefined>(
    undefined
  );

  const syllabus = useBoundStore().syllabus;
  const updateSyllabus = useBoundStore().updateSyllabus;

  const handleSelectedSchool = (id: number) => {
    setSelectedSchool(id);
  };
  const handleSelectedClass = (id: number) => {
    setSelectedClass(id);
  };

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
        <School action={handleSelectedSchool} />
        <Class action={handleSelectedClass} schoolId={selectedSchool} />
        <Books action={handleSelectedBook} classId={selectedClass} />
      </Group>
    </div>
  );
}
