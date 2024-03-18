"use client";
import { Group } from "@mantine/core";

import { useTransition } from "react";

function IndexTitle({
  id,
  name,
}: {
  id: number;
  name: string;
}) {
  return (
    <Group>
      <p className=" font-semibold opacity-90 ">{name}</p>
    </Group>
  );
}

export default IndexTitle;
