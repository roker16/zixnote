"use client";
import { useBoundStore } from "@/store/zustand";
import { Group } from "@mantine/core";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Subject } from "./Subject";
import { Paper } from "./Paper";
import { Exam } from "./Exam";
import { FirstCommonFilter } from "../school-filter/FirstCommonFilter";

export default function ExamParent({ canModerate }: { canModerate: boolean }) {
  const router = useRouter();
  let [isPending, startTransition] = useTransition();
  const [selectedSchool, setSelectedSchool] = useState<number | undefined>(
    undefined
  );
  const [selectedClass, setSelectedClass] = useState<number | undefined>(
    undefined
  );

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
        <FirstCommonFilter
          action={handleSelectedSchool}
          canModerate={canModerate}
          tableName={"syll_exam"}
        />

        <Paper
          action={handleSelectedClass}
          schoolId={selectedSchool}
          canModerate={canModerate}
        />
        <Subject
          action={handleSelectedBook}
          paperId={selectedClass}
          canModerate={canModerate}
        />
      </Group>
    </div>
  );
}
