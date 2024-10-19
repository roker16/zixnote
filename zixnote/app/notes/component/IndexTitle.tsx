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
      <p className=" font-semibold text-sm opacity-80 ">{name}</p>
    </Group>
  );
}

export default IndexTitle;
