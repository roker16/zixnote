"use client";

import { useState } from "react";
import { School } from "./School";
import { Class } from "./Class";
import { Books } from "./Books";

export default function SchoolParent({
  canModerate,
}: {
  canModerate: boolean;
}) {
  const [school, setSchool] = useState<{ id?: number; name?: string }>({});
  const [selectedClass, setSelectedClass] = useState<{
    id?: number;
    name?: string;
  }>({});

  const handleSchoolChange = (id: number, name: string) => {
    setSchool({ id, name });
    setSelectedClass({}); // clear class if school changes
  };

  const handleClassChange = (id: number, name: string) => {
    setSelectedClass({ id, name });
  };

  return (
    <div className="flex flex-col gap-1 p-1">
      <School action={handleSchoolChange} canModerate={canModerate} />
      <Class
        schoolId={school.id}
        action={handleClassChange}
        canModerate={canModerate}
      />
      <Books
        schoolId={school.id}
        schoolName={school.name}
        classId={selectedClass.id}
        className={selectedClass.name}
        canModerate={canModerate}
      />
    </div>
  );
}
