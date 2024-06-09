"use client";
import { UserMenu } from "@/components/UserMenu";
import { createClient } from "@/utils/supabase/client";
import {
  ActionIcon,
  AppShell,
  Burger,
  Button,
  Center,
  Group,
  Paper,
  ScrollArea,
  Space,
  Tabs,
  rem,
  useMantineTheme,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { User } from "@supabase/supabase-js";
import { IconNotes, IconWriting } from "@tabler/icons-react";
import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import NotesMenu from "../manage-notes/component/NoteMenu";

export default function ManageSyllabusLayout({
  children,
  filter,
  moderator,
  syllabus,
  analytics,
}: {
  children: React.ReactNode;
  filter: React.ReactNode;
  moderator: React.ReactNode;
  syllabus: React.ReactNode;
  analytics: React.ReactNode;
}) {
  const [opened, { toggle }] = useDisclosure();
  const [activeTab, setActiveTab] = useState<string | null>("first");
  const theme = useMantineTheme();
  const supabase = createClient();
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    const getUser = async () => {
      setUser((await supabase.auth.getUser()).data.user);
    };

    getUser();
  }, [supabase.auth]);

  return (
    <AppShell
      layout="alt"
      header={{ height: 50, offset: false }}
      padding={{ base: 0, md: 4, xl: 90 }}
      navbar={{
        width: { base: 350, md: 400 },
        breakpoint: "md",
        collapsed: { mobile: !opened },
      }}
      aside={{
        width: 0,
        breakpoint: "lg",
        collapsed: { desktop: false, mobile: true },
      }}
    >
      <AppShell.Header withBorder={true}>
        <Paper h={50} style={{ position: "sticky", top: "0px", zIndex: "100" }}>
          <Tabs
            value={activeTab}
            onChange={setActiveTab}
            defaultValue="first"
            variant="default"
            bg={theme.colors.gray[0]}
          >
            <Tabs.List justify={"space-between"} h={50}>
              <Group h="100%" justify="center" align="center">
                <Burger
                  opened={opened}
                  onClick={toggle}
                  hiddenFrom="md"
                  size="sm"
                />
                <Link href={"/"}>
                  <ActionIcon
                    // visibleFrom="md"
                    variant="gradient"
                    size="md"
                    radius={"xl"}
                    gradient={{
                      from: "var(--mantine-color-indigo-4)",
                      to: "var(--mantine-color-indigo-7)",
                      deg: 304,
                    }}
                  >
                    <IconWriting size={20} stroke={1} />
                  </ActionIcon>
                </Link>
              </Group>

              <Group gap={0}>
                {" "}
                <Tabs.Tab value="first">Manage Index</Tabs.Tab>
                {/* <Tabs.Tab value="second">Shared</Tabs.Tab> */}
                {/* <Tabs.Tab value="third">Trend</Tabs.Tab>
                <Tabs.Tab value="forth">Notes</Tabs.Tab> */}
              </Group>
              <Center>
                {/* <NotesMenu />{" "} */}
              </Center>
            </Tabs.List>
          </Tabs>
        </Paper>
      </AppShell.Header>
      <AppShell.Navbar
        withBorder={false}
        h={"full"}
        bg={"var(--mantine-color-gray-0)"}
      >
        <Group justify="space-between" p={2} bg={"var(--mantine-color-gray-0)"}>
          <Group p={6}>
            <UserMenu user={user} />

            <Button
              variant="subtle"
              size="compact-sm"
              color="dark"
              component={Link}
              href="/manage-notes"
              leftSection={<IconNotes size={14} />}
            >
              Create Notes
            </Button>
          </Group>
          <Burger opened={opened} onClick={toggle} hiddenFrom="md" size="sm" />
        </Group>

        <ScrollArea scrollbarSize={4} scrollHideDelay={0} h={"100vh"}>
          {filter}
          {syllabus}
        </ScrollArea>
      </AppShell.Navbar>
      <AppShell.Main pt={`calc(${rem(50)} + var(--mantine-spacing-md))`}>
        <Space h={10} />
        {activeTab === "first" && (
          <Suspense fallback={<div>loading...</div>}>{moderator}</Suspense>
        )}
        {activeTab === "second" && <div>{analytics}</div>}
        {activeTab === "third" && <div>{analytics}</div>}
      </AppShell.Main>
    </AppShell>
  );
}
