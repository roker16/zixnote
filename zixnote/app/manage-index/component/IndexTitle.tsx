"use client";
import { Group } from "@mantine/core";
import CreateForm from "./CreateForm";

function IndexTitle({ id, name }: { id: number; name: string }) {
  return (
    <Group>
      <p className=" font-semibold opacity-90 ">{name}</p>
      <CreateForm parentId={undefined} syllabusId={id} label="Add chapter" />
    </Group>
  );
}

export default IndexTitle;
