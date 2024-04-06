"use client";
import { Box, Group } from "@mantine/core";
import { useState } from "react";
import { Books } from "./Books";
import { Class } from "./Class";
import { School } from "./School";

export default function SchoolParent({
  canModerate,
}: {
  canModerate: boolean;
}) {
  const [selectedSchool, setSelectedSchool] = useState<number | undefined>(
    undefined
  );
  const [selectedClass, setSelectedClass] = useState<number | undefined>(
    undefined
  );

  const handleSelectedSchool = (id: number) => {
    setSelectedSchool(id);
  };
  const handleSelectedClass = (id: number) => {
    setSelectedClass(id);
  };

  return (
   
    <div className="flex flex-col p-1 gap-1"  >
        <School action={handleSelectedSchool} canModerate={canModerate} />
        <Class
          action={handleSelectedClass}
          schoolId={selectedSchool}
          canModerate={canModerate}
        />
        <Books
          classId={selectedClass}
          canModerate={canModerate}
        />
      </div>
   
  );
}
