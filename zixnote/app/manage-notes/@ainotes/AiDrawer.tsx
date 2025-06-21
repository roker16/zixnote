"use client";

import DeepSeekChat from "@/components/ai/DeepSeekChat";
import { Button, Drawer } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { MdUpdate } from "react-icons/md";

interface AiDrawerProps {
  topicId: string;
  initialNoteContent: string;
}

function AiDrawer({ topicId, initialNoteContent }: AiDrawerProps) {
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
        <DeepSeekChat
          noteId={Number(topicId)}
          initialContent={initialNoteContent}
        />
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
