"use client";
import { UserMenu } from "@/components/UserMenu";
import { createClient } from "@/utils/supabase/client";
import {
  AppShell,
  Burger,
  Button,
  Group,
  Paper,
  ScrollArea,
  SegmentedControl,
  Space,
  Tabs,
  rem,
  useMantineTheme,
} from "@mantine/core";
import { useDisclosure, useHeadroom } from "@mantine/hooks";
import { User } from "@supabase/supabase-js";
import { IconEdit, IconNotebook } from "@tabler/icons-react";
import Link from "next/link";
import { useEffect, useState } from "react";
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
      header={{ height: 60, collapsed: !pinned, offset: false }}
      padding={{ base: 5, md: "md", xl: 90 }}
      // header={{ height: 50 }}
      // footer={{ height: 60 }}
      navbar={{
        width: 350,
        breakpoint: "md",
        collapsed: { mobile: !opened },
      }}
      // aside={{
      //   width: 0,
      //   breakpoint: "lg",
      //   collapsed: { desktop: false, mobile: true },
      // }}
    >
      <AppShell.Header>
        <Group h="100%" px="md">
          <Burger opened={opened} onClick={toggle} hiddenFrom="md" size="sm" />
          <IconNotebook size={30} />
          <Button
            variant="subtle"
            size="compact-sm"
            color={"dark"}
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
          {/* <Flex justify={"center"}>
            <NotesSearch />
          </Flex> */}
        </Group>
        {/*         
        <Paper
          shadow="xl"
          bg={"yellow"}
          h={50}
          style={{ position: "sticky", top: "0px", zIndex: "100" }}
        >
          <Tabs
            defaultValue="first"
            variant="pills"
            color={theme.colors.gray[7]}
            radius="xl"
            bg={"yellow"}
            p={8}
          >
            <Tabs.List justify="center">
              <Tabs.Tab value="first">Notes</Tabs.Tab>
              <Tabs.Tab value="second">Shared</Tabs.Tab>
              <Tabs.Tab value="third">Trend</Tabs.Tab>
           
            </Tabs.List>
          </Tabs>
        </Paper> */}

        <Paper
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
            variant="light"
            radius="xl"
            // style={{"backgroundColor":theme.primaryColor,"opacity":"90%"}}
            color={!pinned ? theme.colors.indigo[6] : theme.colors.gray[8]}
            bg={!pinned ? theme.colors.gray[2] : "white"}
            onChange={setValue}
            data={[
              { label: "Notes", value: "react" },
              { label: "Sharing", value: "ng" },
              { label: "Shared", value: "vue" },
              { label: "Svelte1", value: "svelte" },

              // { label: "Svelte", value: "svelte1" },
              // { label: "Svelte", value: "svelte11" },
            ]}
          />
        </Paper>
      </AppShell.Header>
      <AppShell.Navbar p="xs">
        <Group justify="space-between">
          <Group>
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
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
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
      <AppShell.Main pt={`calc(${rem(60)} + var(--mantine-spacing-md))`}>
        <Space h={80} />
        {notes}
      </AppShell.Main>
      {/* <AppShell.Aside p="md">Aside</AppShell.Aside> */}
      {/* <AppShell.Footer p="md">Footer</AppShell.Footer> */}
    </AppShell>
  );
}
