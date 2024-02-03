"use client";
import { useBoundStore } from "@/store/zustand";
import React from "react";
import CreateForm from "./CreateForm";

function IndexTitle() {
  const index = useBoundStore().syllabus;
  return (
    <div>
      {" "}
      <div className="flex flex-nowrap items-center justify-start gap-2 ">
        <p className=" font-semibold opacity-90 ">{index?.name}</p>
        <CreateForm
          parentId={undefined}
          syllabusId={index?.id}
          label="Add chapter"
        />
      </div>
    </div>
  );
}

export default IndexTitle;
