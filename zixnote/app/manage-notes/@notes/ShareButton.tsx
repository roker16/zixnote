"use client";
import { ActionIcon, Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconShare } from "@tabler/icons-react";
import ManageSharing from "./ManageSharing";

function ShareButton({userId}:{userId:string}) {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Modal
        opened={opened}
        onClose={close}
        title={<div className="font-semibold">Share</div>}
      >
        <ManageSharing userId={userId}/>
        {/* Modal content */}
      </Modal>

      <ActionIcon
        onClick={open}
        variant="subtle"
        radius="xl"
        aria-label="Settings"
      >
        <IconShare style={{ width: "70%", height: "70%" }} stroke={1.5} />
      </ActionIcon>
    </>
  );
}

export default ShareButton;
