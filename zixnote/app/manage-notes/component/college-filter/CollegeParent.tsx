"use client";

import { useState } from "react";
import { College } from "./College";
import { Department } from "./Department";
import { Course } from "./Course";

export default function CollegeParent({
  canModerate,
}: {
  canModerate: boolean;
}) {
  const [college, setCollege] = useState<{ id?: number; name?: string }>({});
  const [department, setDepartment] = useState<{ id?: number; name?: string }>(
    {}
  );

  const handleCollegeChange = (id: number, name: string) => {
    setCollege({ id, name });
    setDepartment({}); // clear department if college changes
  };

  const handleDepartmentChange = (id: number, name: string) => {
    setDepartment({ id, name });
  };

  return (
    <div className="flex flex-col gap-1 p-1">
      <College action={handleCollegeChange} canModerate={canModerate} />
      <Department
        collegeId={college.id}
        action={handleDepartmentChange}
        canModerate={canModerate}
      />
      <Course
        collegeName={college.name}
        departmentName={department.name}
        departmentId={department.id}
        canModerate={canModerate}
        collegeId={college.id}
      />
    </div>
  );
}
