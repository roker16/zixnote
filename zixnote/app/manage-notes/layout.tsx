"use client";
import { UserMenu } from "@/components/UserMenu";
import { createClient } from "@/utils/supabase/client";
import {
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
import { useDisclosure, useHeadroom } from "@mantine/hooks";
import { User } from "@supabase/supabase-js";
import { IconNotebook, IconPencil } from "@tabler/icons-react";
import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import NotesMenu from "./component/NoteMenu";
export default function ManageSyllabusLayout({
  children,
  filter,
  notes,
  sharednotes,
  index,
}: {
  children: React.ReactNode;
  filter: React.ReactNode;
  notes: React.ReactNode;
  sharednotes: React.ReactNode;
  index: React.ReactNode;
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
        width: 300,
        breakpoint: "md",
        collapsed: { mobile: !opened },
      }}
      aside={{
        width: 0,
        breakpoint: "lg",
        collapsed: { desktop: false, mobile: true },
      }}
    >
      <AppShell.Header withBorder={false}>
        <Paper h={50} style={{ position: "sticky", top: "0px", zIndex: "100" }}>
          <Tabs
            value={activeTab}
            onChange={setActiveTab}
            defaultValue="first"
            variant="default"
            bg={theme.colors.gray[0]}
          >
            <Tabs.List justify={"space-between"} h={50}>
              <Group h="100%">
                <Burger
                  opened={opened}
                  onClick={toggle}
                  hiddenFrom="md"
                  size="sm"
                />
                <Link href={"/"}>
                  <IconNotebook
                    style={{
                      marginTop: "auto",
                      marginBottom: "auto",
                    }}
                  />
                </Link>
              </Group>

              <Group gap={0}>
                {" "}
                <Tabs.Tab value="first">Notes</Tabs.Tab>
                <Tabs.Tab value="second">Shared</Tabs.Tab>
                <Tabs.Tab value="third">Trend</Tabs.Tab>
                <Tabs.Tab value="forth">Notes</Tabs.Tab>
              </Group>
              <Center>
                
                <NotesMenu />
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
              href="/manage-syll"
              leftSection={<IconPencil size={16} />}
            >
              Create index
            </Button>
          
          </Group>
          <Burger opened={opened} onClick={toggle} hiddenFrom="md" size="sm" />
        </Group>

        <ScrollArea scrollbarSize={4} scrollHideDelay={0} h={"100vh"}>
          {filter}
          {index}
        </ScrollArea>
      </AppShell.Navbar>
      <AppShell.Main pt={`calc(${rem(50)} + var(--mantine-spacing-md))`}>
        <Space h={10} />
        {activeTab === "first" && (
          <Suspense fallback={<div>loading...</div>}>{notes}</Suspense>
        )}
        {activeTab === "second" && <div>{sharednotes}</div>}
        {activeTab === "third" && <div>Third Tab</div>}
      </AppShell.Main>
    </AppShell>
  );
}
