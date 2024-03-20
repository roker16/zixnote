"use client";
import {
  AppShell,
  Box,
  Burger,
  Button,
  Flex,
  Text,
  Group,
  ScrollArea,
  Title,
  HoverCard,
  Accordion,
  SegmentedControl,
  Space,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconEdit, IconNotebook } from "@tabler/icons-react";
import Link from "next/link";
import { Suspense, useState } from "react";
export default function ManageSyllabusLayout({
  children,
  filter,
  notes,
  index,
}: {
  children: React.ReactNode;
  filter: React.ReactNode;
  notes: React.ReactNode;
  index: React.ReactNode;
}) {
  const [opened, { toggle }] = useDisclosure();
  const [value, setValue] = useState("react");
  return (
    <AppShell
      layout="alt"
      header={{ height: 50 }}
      footer={{ height: 60 }}
      navbar={{
        width: 350,
        breakpoint: "sm",
        collapsed: { mobile: !opened },
      }}
      aside={{
        width: 150,
        breakpoint: "lg",
        collapsed: { desktop: false, mobile: true },
      }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md">
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          <IconNotebook size={30} />
          <Button
            variant="subtle"
            size="compact-sm"
            color="dark"
            component={Link}
            href="/manage-index"
          >
            Pricing
          </Button>
          <Button
            variant="subtle"
            size="compact-sm"
            color="dark"
            component={Link}
            href="/manage-index"
          >
            Guide
          </Button>
          <Button
            variant="subtle"
            size="compact-sm"
            color="dark"
            component={Link}
            href="/manage-index"
            rightSection={<IconEdit size={14} />}
          >
            Index
          </Button>
        </Group>
        <SegmentedControl
          fullWidth
          value={value}
          onChange={setValue}
          data={[
            { label: "Notes", value: "react" },
            { label: "Shared", value: "ng" },
            { label: "Vue", value: "vue" },
            { label: "Svelte", value: "svelte" },
          ]}
        />
      </AppShell.Header>
      <AppShell.Navbar p="xs">
        <Group>
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          <Button
            variant="subtle"
            size="compact-lg"
            color="dark"
            component={Link}
            href="/manage-index"
            rightSection={<IconEdit size={14} />}
          >
            Index
          </Button>
        </Group>

        {/* <Accordion variant="default" defaultValue="Apples">
          <Accordion.Item value={"item.value"}>
            <Accordion.Control>{"Change Index"}</Accordion.Control>
            <Accordion.Panel>{filter}</Accordion.Panel>
          </Accordion.Item>
        </Accordion> */}

        {/* <AppShell.Section component={ScrollArea}> */}
        <ScrollArea scrollbarSize={4} scrollHideDelay={0} offsetScrollbars>
          {filter}
          {index}
        </ScrollArea>
        {/* </AppShell.Section> */}
      </AppShell.Navbar>
      <AppShell.Main>
       
        {value === "react" && notes}
        
          <div>
           h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h
           h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h
           h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h
           h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h
           h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h
           h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h
           h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h
           h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h
           h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h
           h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h
           h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h
           h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h
           h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h
           h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h
           h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h
           h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h
           h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h
           h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h
           h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h
           h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h
           h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h
           h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h
           h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h
           h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h
           h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h
           h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h
           h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h
           h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h
           h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h
           h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h
           h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h
           h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h
           h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h
           h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h
           h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h
           h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h
           h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h
           h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h
           h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h
           h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h
           h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h
           h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h
           h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h
           h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h
           h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h
           h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h
           h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h
           h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h
           h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h
           h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h
           h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h
           h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h
           h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h
           h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h
           h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h
           h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h
           h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h
           h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h
           h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h
           h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h
           h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h
           h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h
           h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h
           h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h
           h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h
           h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h
           h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h
           h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h
           h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h
           h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h
           h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h
           h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h
           h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h
           h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h
           h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h
           h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h
           h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h
           h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h
           h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h
           h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h
           h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h
           h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h
           h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h
           h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h
           h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h
           h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h
           h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h
           h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h
           h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h
           h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h
           h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h
           h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h
           h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h
           h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h
           h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h
           h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h
           h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h
           h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h
           h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h
           h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h
           h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h
           h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h
           h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h
           h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h
           h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h
           h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h
           h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h
           h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h
           h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h
           h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h
           h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h
           h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h
           h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h
           h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h
           h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h
           h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h
           h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h
           h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h
           h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h
           h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h
           h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h
           h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h
           h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h
           h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h
           h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h
           h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h
           h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h
           h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h
           h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h
           h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h
           h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h
           h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h
           h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h
           h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h
           h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h
           h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h
           h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h h

          </div>
        
      </AppShell.Main>
      <AppShell.Aside p="md">Aside</AppShell.Aside>
      {/* <AppShell.Footer p="md">Footer</AppShell.Footer> */}
    </AppShell>
  );
}
