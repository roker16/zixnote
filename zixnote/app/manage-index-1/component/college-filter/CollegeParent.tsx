"use client";
import { useBoundStore } from "@/store/zustand";
import { Group } from "@mantine/core";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Course } from "./Course";
import { Department } from "./Department";
import { College } from "./College";

export default function CollegeParent({
  canModerate,
}: {
  canModerate: boolean;
}) {
  const router = useRouter();
  let [isPending, startTransition] = useTransition();
  const [selectedCollege, setSelectedCollege] = useState<number | undefined>(
    undefined
  );
  const [selectedDepartment, setSelectedDepartment] = useState<
    number | undefined
  >(undefined);

  const handleSelectedCollege = (id: number) => {
    setSelectedCollege(id);
  };
  const handleSelectedDepartment = (id: number) => {
    setSelectedDepartment(id);
  };

  const handleSelectedCourse = (id: number, name: string) => {
    const url = new URL(window.location.href);
    url.searchParams.set("id", id.toString());
    url.searchParams.set("name", name);

    startTransition(() => {
      router.replace(url.toString());
    });
  };
  return (
    <div>
      {/* {isPending && "Loading......"} */}
      <Group justify="center" grow>
        <College action={handleSelectedCollege} canModerate={canModerate} />
        <Department
          action={handleSelectedDepartment}
          schoolId={selectedCollege}
          canModerate={canModerate}
        />
        <Course
          action={handleSelectedCourse}
          classId={selectedDepartment}
          canModerate={canModerate}
        />
      </Group>
    </div>
  );
}
