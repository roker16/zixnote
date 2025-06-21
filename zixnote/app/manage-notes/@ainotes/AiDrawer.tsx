"use client";

import DeepSeekChat from "@/components/ai/DeepSeekChat";
import { Drawer, Button } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconChevronDown } from "@tabler/icons-react";
import React from "react";
import {
  MdOpenInBrowser,
  MdOpenInFull,
  MdOpenInNew,
  MdOpenWith,
  MdUpdate,
} from "react-icons/md";

interface AiDrawerProps {
  topicId: string;
  userId: string;
}

function AiDrawer({ topicId, userId }: AiDrawerProps) {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Drawer
        offset={8}
        radius="md"
        opened={opened}
        onClose={close}
        title="Update Notes with AI"
        position="right"
        size="xl"
      >
        <DeepSeekChat noteId={Number(topicId)} />
      </Drawer>
      <Button
        variant="gradient"
        color="indigo"
        size="xs"
        radius="sm"
        onClick={open}
        leftSection={<MdUpdate size={12} />}
      >
        Update Notes
      </Button>
    </>
  );
}

export default AiDrawer;
