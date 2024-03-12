"use client";
import React from "react";
import { Center, Text } from "@mantine/core";
function NoticeText({ text }: { text: string }) {
  return (
    <Center h={"200px"}>
      <Text c="dimmed" fs="italic">
        {text}
      </Text>
    </Center>
  );
}

export default NoticeText;
