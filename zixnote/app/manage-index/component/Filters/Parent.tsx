"use client";
import { useState } from "react";
import { Tab } from "@headlessui/react";
import { Group, Button } from "@mantine/core";
import { School } from "./School";
import { Books } from "./Books";
import { Class } from "./Class";
import { notifications } from "@mantine/notifications";
import { useBoundStore } from "@/store/zustand";
import { useRouter } from "next/navigation";

export default function Parent() {
  const router = useRouter();
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
    router.replace(url.toString());
    
    updateSyllabus({ id: id, name: name });
  };
  return (
    <div>
      <Group justify="center" grow>
        <School action={handleSelectedSchool} />
        <Class action={handleSelectedClass} schoolId={selectedSchool} />
        <Books action={handleSelectedBook} classId={selectedClass} />
      </Group>
    </div>
  );
}
