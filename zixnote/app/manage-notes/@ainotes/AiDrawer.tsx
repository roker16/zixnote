"use client";

import { logKPIEvent } from "@/app/kpitracker/logKPIEvent";
import DeepSeekChat from "@/components/ai/DeepSeekChat";
import { Button, Drawer } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useSearchParams } from "next/navigation";
import { MdUpdate } from "react-icons/md";

interface AiDrawerProps {
  topicId: string;
  initialNoteContent: string;
  notesTitle: string;
}

function AiDrawer({ topicId, initialNoteContent, notesTitle }: AiDrawerProps) {
  const [opened, { open, close }] = useDisclosure(false);
  const searchParams = useSearchParams();
  const bookName = searchParams.get("name");
  const handleOpen = () => {
    open();
    logKPIEvent("ai_drawer_opened", { book_name: bookName });
  };
  return (
    <>
      <Drawer
        offset={0}
        radius="md"
        opened={opened}
        onClose={close}
        title={
          <div className="font-bold text-blue-900 underline">
            Update Notes with AI
          </div>
        }
        position="right"
        size="xl"
      >
        <DeepSeekChat
          noteId={Number(topicId)}
          initialContent={initialNoteContent}
          notesTitle={notesTitle}
        />
      </Drawer>
      <Button
        variant="gradient"
        color="indigo"
        size="xs"
        radius="sm"
        onClick={handleOpen}
        leftSection={<MdUpdate size={12} />}
      >
        Update Notes
      </Button>
    </>
  );
}

export default AiDrawer;
