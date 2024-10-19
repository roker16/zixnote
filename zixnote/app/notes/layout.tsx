"use client";
import { UserMenu } from "@/components/UserMenu";
import { createClient } from "@/utils/supabase/client";
import {
  ActionIcon,
  AppShell,
  AppShellHeader,
  AppShellMain,
  AppShellNavbar,
  Burger,
  Button,
  Center,
  Group,
  Paper,
  ScrollArea,
  Space,
  Tabs,
  TabsList,
  TabsTab,
  rem,
  useMantineTheme,
} from "@mantine/core";
import { useDisclosure, useHeadroom } from "@mantine/hooks";
import Image from "next/image";
import { User } from "@supabase/supabase-js";
import { IconNotebook, IconPencil, IconWriting } from "@tabler/icons-react";
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
      // disabled
      header={{ height: 50, offset: false }}
      padding={{ base: 0, md: 4, xl: 90 }}
      navbar={{
        width: 300,
        breakpoint: "lg",
        collapsed: { mobile: !opened },
      }}
      aside={{
        
        width: 200,
        breakpoint: "lg",
        collapsed: { desktop: false, mobile: true },
      }}
    >
      <AppShellHeader withBorder={false}>
        <Paper h={50} style={{ position: "sticky", top: "0px", zIndex: "100" }}>
          <Tabs
            value={activeTab}
            onChange={setActiveTab}
            defaultValue="first"
            variant="default"
            bg={theme.colors.gray[0]}
          >
            <TabsList justify={"space-between"} h={50}>
              <Group h="100%">
                <Burger
                  opened={opened}
                  onClick={toggle}
                  hiddenFrom="md"
                  size="sm"
                />
                <Link href={"/"} className="my-auto">
                  <Image src="/logo.png" width={35} height={22} alt="Logo" />
                </Link>
              </Group>

              <Group gap={0}>
                {" "}
                <TabsTab value="first">Notes</TabsTab>
                <TabsTab value="second">Shared</TabsTab>
                {/* <Tabs.Tab value="third">Trend</Tabs.Tab>
                <Tabs.Tab value="forth">Notes</Tabs.Tab> */}
              </Group>
              <Center>
                {" "}
                <NotesMenu />{" "}
              </Center>
            </TabsList>
          </Tabs>
        </Paper>
      </AppShellHeader>
      <AppShellNavbar
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
      </AppShellNavbar>
      <AppShellMain  pt={`calc(${rem(50)} + var(--mantine-spacing-md))`}>
        <Space h={100} bg={"red"} />

        {activeTab === "first" && (
          <Suspense fallback={<div>loading...</div>}>{notes}</Suspense>
        )}
        {activeTab === "second" && <div>{sharednotes}</div>}
        {activeTab === "third" && <div>Third Tab</div>}
      </AppShellMain>
      <AppShell.Aside p="md" bg={"red"}>Aside</AppShell.Aside>
    </AppShell>
  );
}
