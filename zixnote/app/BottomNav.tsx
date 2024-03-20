import { ActionIcon, Button, Group, Paper } from "@mantine/core";
import {
  IconFolderOpen,
  IconHome,
  IconListDetails,
  IconShare,
} from "@tabler/icons-react";
import React, { useState } from "react";

import { Drawer } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { TablerIconsProps } from "@tabler/icons-react";

export default function BottomNavigation() {
  return (
    <Paper
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        width: "100%",
        zIndex: 1000,
      }}
      p="sm"
      shadow="md"
      radius={0}
    >
      <Group justify="space-around">
        <DrawerButton icon={IconHome} title="Home">
          hello1
          {/* Home Drawer Content */}
        </DrawerButton>
        <DrawerButton icon={IconListDetails} title="Details">
          hello2
          <BottomNavCompOne />
          {/* Details Drawer Content */}
        </DrawerButton>
        <DrawerButton icon={IconShare} title="Share">
          hello3
          {/* Share Drawer Content */}
        </DrawerButton>
        <DrawerButton icon={IconFolderOpen} title="Files">
          hello4
          {/* Files Drawer Content */}
        </DrawerButton>
      </Group>
    </Paper>
  );
}

function DrawerButton({
  icon: Icon,
  title,
  children,
}: {
  icon: (props: TablerIconsProps) => JSX.Element;
  title: string;
  children: React.ReactNode;
}) {
  const [opened, { open, close }] = useDisclosure(false);
  const [counter, setCounter] = useState(1);
  return (
    <>
      <Drawer opened={opened} onClose={close} title={title}>
        <Button
          onClick={() => {
            setCounter(counter + 1);
          }}
        >
          Counter
        </Button>
        counter is {counter}
        <BottomNavCompOne />
        {children}
      </Drawer>

      <ActionIcon variant="light" radius="xl" onClick={open}>
        <Icon style={{ width: "70%", height: "70%" }} stroke={1.5} />
      </ActionIcon>
    </>
  );
}

function BottomNavCompOne() {
  const [counter, setcounter] = useState(1);
  return (
    <div>
      {counter}
      <Button
        onClick={() => {
          setcounter(counter + 1);
        }}
      ></Button>
    </div>
  );
}
