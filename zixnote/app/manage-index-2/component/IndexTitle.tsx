"use client";
import { Group } from "@mantine/core";
import CreateForm from "./CreateForm";
import { useTransition } from "react";

function IndexTitle({
  id,
  name,
  canModerate,
}: {
  id: number;
  name: string;
  canModerate: boolean;
}) {
  return (
    <Group>
      <p className=" font-semibold opacity-90 ">{name}</p>
      {canModerate && <CreateForm parentId={undefined} syllabusId={id} label="Add Chapter" />}
    </Group>
  );
}

export default IndexTitle;
