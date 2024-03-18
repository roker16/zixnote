import React from "react";
import { Paper, Button, ActionIcon, Group } from "@mantine/core";
import {
  IconAdjustments,
  IconDeviceTabletOff,
  IconFolderOpen,
  IconHome,
  IconListDetails,
  IconRestore,
  IconShare,
} from "@tabler/icons-react";
import { IconContext } from "react-icons/lib";

function BottomNavigation() {
  return (
    <Paper
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        width: "100%",
        zIndex: 1000, // Ensure it stays on top of other content
      }}
      p="sm"
      shadow="md"
      radius={0}
      //   bg="gray"
    >
      <Group justify="space-around">
        <ActionIcon variant="light" radius="xl" aria-label="Settings">
          <IconHome style={{ width: "70%", height: "70%" }} stroke={1.5} />
        </ActionIcon>
        <ActionIcon variant="light" radius="xl" aria-label="Settings">
          <IconListDetails style={{ width: "70%", height: "70%" }} stroke={1.5} />
        </ActionIcon>
        <ActionIcon variant="light"  radius="xl" aria-label="Settings">
          <IconShare style={{ width: "70%", height: "70%" }} stroke={1.5} />
        </ActionIcon>
        <ActionIcon variant="light" radius="xl" aria-label="Settings">
          <IconFolderOpen
            style={{ width: "70%", height: "70%" }}
            stroke={1.5}
          />
        </ActionIcon>
      </Group>
    </Paper>
  );
}

export default BottomNavigation;
