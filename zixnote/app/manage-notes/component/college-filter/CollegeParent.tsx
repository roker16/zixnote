"use client";
import { Group } from "@mantine/core";
import { useState } from "react";
import { College } from "./College";
import { Course } from "./Course";
import { Department } from "./Department";

export default function CollegeParent({
  canModerate,
}: {
  canModerate: boolean;
}) {

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

  return (
    <div className="flex flex-col p-1 gap-1"  >
      {/* {isPending && "Loading......"} */}
     
        <College action={handleSelectedCollege} canModerate={canModerate} />
        <Department
          action={handleSelectedDepartment}
          schoolId={selectedCollege}
          canModerate={canModerate}
        />
        <Course
          // action={handleSelectedCourse}
          classId={selectedDepartment}
          canModerate={canModerate}
          // isPending={isPending}
        />
      
    </div>
  );
}
