"use client";
import { Group } from "@mantine/core";
import { useState } from "react";
import { Exam } from "./Exam";
import { Paper } from "./Paper";
import { Subject } from "./Subject";

export default function ExamParent({ canModerate }: { canModerate: boolean }) {
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
    <div className="flex flex-col md:flex-row p-1 gap-1"  >
      {/* {isPending && "Loading......"} */}
    
        <Exam action={handleSelectedSchool} canModerate={canModerate} />
        <Paper
          action={handleSelectedClass}
          schoolId={selectedSchool}
          canModerate={canModerate}
        />
        <Subject
          paperId={selectedClass}
          canModerate={canModerate}
        />
   
    </div>
  );
}
