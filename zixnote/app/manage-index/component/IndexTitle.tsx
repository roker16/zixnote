"use client";
import { useBoundStore } from "@/store/zustand";
import React from "react";
import CreateForm from "./CreateForm";

function IndexTitle({ id, name }: { id: number; name: string }) {
//   const index = useBoundStore().syllabus;
  return (
    <div>
      {" "}
      <div className="flex flex-nowrap items-center justify-start gap-2 ">
        <p className=" font-semibold opacity-90 ">{name}</p>
        <CreateForm
          parentId={undefined}
          syllabusId={id}
          label="Add chapter"
        />
      </div>
    </div>
  );
}

export default IndexTitle;
