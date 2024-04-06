"use client";
import { UserMenu } from "@/components/UserMenu";
import { createClient } from "@/utils/supabase/client";
import {
  AppShell,
  Box,
  Burger,
  Button,
  Center,
  Group,
  Paper,
  ScrollArea,
  SegmentedControl,
  Space,
  Tabs,
  alpha,
  rem,
  useMantineTheme,
} from "@mantine/core";
import { useDisclosure, useHeadroom } from "@mantine/hooks";
import { User } from "@supabase/supabase-js";
import { IconDotsVertical, IconEdit, IconNotebook } from "@tabler/icons-react";
import Link from "next/link";
import { Suspense, useEffect, useState } from "react";

export default function ManageSyllabusLayout({
  children,
  filter,
  moderator,
  syllabus,
}: {
  children: React.ReactNode;
  filter: React.ReactNode;
  moderator: React.ReactNode;
  syllabus: React.ReactNode;
}) {
  const [opened, { toggle }] = useDisclosure();
  const [value, setValue] = useState("react");
  const [activeTab, setActiveTab] = useState<string | null>("first");
  const theme = useMantineTheme();
  const pinned = useHeadroom({ fixedAt: 120 });
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
      // header={{ height: 50 }}
      // footer={{ height: 50 }}
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
        <Paper
          // shadow="xs"
          // bg={alpha("--var(--mantine-color-gray-2)",0.74)}
          h={50}
          style={{ position: "sticky", top: "0px", zIndex: "100" }}
        >
          <Tabs
            value={activeTab}
            onChange={setActiveTab}
            defaultValue="first"
            variant="default"
            // color={theme.colors.indigo[7]}
            // radius="xl"
            bg={theme.colors.gray[0]}

            // p={8}
          >
            <Tabs.List justify={"space-between"} h={50}>
              <Group h="100%">
                <Burger
                  opened={opened}
                  onClick={toggle}
                  hiddenFrom="md"
                  size="sm"
                />
                <IconNotebook
                  style={{
                    marginTop: "auto",
                    marginBottom: "auto",
                  }}
                />
                {/* <MantineLogo size={30} /> */}
              </Group>

              <Group gap={0}>
                {" "}
                <Tabs.Tab value="first">Notes</Tabs.Tab>
                <Tabs.Tab value="second">Shared</Tabs.Tab>
                <Tabs.Tab value="third">Trend</Tabs.Tab>
                <Tabs.Tab value="forth">Notes</Tabs.Tab>
                {/* <Tabs.Tab value="fifth">Notes</Tabs.Tab> */}
              </Group>
              <Center>{/* <NotesMenu/> */}</Center>
            </Tabs.List>
          </Tabs>
        </Paper>

        {/* <Paper
          shadow="xs"
          bg={!pinned ? theme.colors.gray[2] : "white"}
          radius={"0px"}
          h={52}
          style={{
            position: "sticky",
            top: "0px",
            zIndex: "100",
          }}
        >
          <SegmentedControl
            fullWidth
            withItemsBorders={false}
            h={50}
            size={"md"}
            value={value}
         
            radius="xl"
            // style={{"backgroundColor":theme.primaryColor,"opacity":"90%"}}
            color={!pinned ? theme.colors.indigo[6] : theme.colors.gray[8]}
            bg={!pinned ? theme.colors.gray[2] : "white"}
            onChange={setValue}
            data={[
              { label: "Button1", value: "react" },
              { label: "Button2", value: "ng" },
              { label: "Button3", value: "vue" },
              { label: "Svelte1", value: "svelte" },

            ]}
          />
        </Paper> */}
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
              size="compact-lg"
              color="dark"
              component={Link}
              href="/manage-index"
              rightSection={<IconEdit size={14} />}
            >
              Index
            </Button>
          </Group>
          <Burger opened={opened} onClick={toggle} hiddenFrom="md" size="sm" />
        </Group>

        <ScrollArea scrollbarSize={4} scrollHideDelay={0} h={"100vh"}>
          {filter}
          {syllabus}
        </ScrollArea>
        {/* </AppShell.Section> */}
      </AppShell.Navbar>
      <AppShell.Main pt={`calc(${rem(50)} + var(--mantine-spacing-md))`}>
        <Space h={80} />
        {activeTab === "first" && (
          <Suspense fallback={<div>loading...</div>}>{moderator}</Suspense>
        )}
        {activeTab === "second" && <div>Second Tab</div>}
        {activeTab === "third" && <div>Third Tab</div>}
      </AppShell.Main>
      {/* <AppShell.Aside withBorder={true} p="md">Aside</AppShell.Aside> */}
      {/* <AppShell.Footer p="md">Footer</AppShell.Footer> */}
    </AppShell>
  );
}
