"use client";
import {
  ActionIcon,
  Box,
  Burger,
  Button,
  Divider,
  Drawer,
  Group,
  ScrollArea,
  rem,
} from "@mantine/core";
import classes from "./HeaderMegaMenu.module.css";
//   import { MantineLogo } from '@mantinex/mantine-logo';
import { useDisclosure } from "@mantine/hooks";
import { User } from "@supabase/supabase-js";
import Link from "next/link";
import { UserMenu } from "../UserMenu";
import Image from "next/image";
import Logo from "@/app/Logo";


export function HeaderMegaMenu({ user }: { user: User | null }) {
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] =
    useDisclosure(false);

  return (
    <Box>
      <header className={classes.header}>
        <Group justify="space-between" h="100%">
          <Burger
            opened={drawerOpened}
            onClick={toggleDrawer}
            hiddenFrom="md"
          />
          <Link href={"/"}>
            <Logo />
          </Link>

          <Group h="100%">
            <Group h="100%" justify="flex-end" gap={0} visibleFrom="md">
              <Link href="/manage-notes" className={classes.link}>
                Notes
              </Link>
              <Link href="/manage-syll" className={classes.link}>
                Manage Syllabus
              </Link>
              <a href="/pricing" className={classes.link}>
                Pricing
              </a>
            </Group>

            <Group justify="flex-end">
              {" "}
              {user ? (
                <UserMenu user={user} />
              ) : (
                <Button
                  component="a"
                  href="/login"
                  style={{ textDecoration: "none" }}
                  variant="link"
                >
                  Log In
                </Button>
              )}
            </Group>
          </Group>
        </Group>
      </header>

      <Drawer
        opened={drawerOpened}
        onClose={closeDrawer}
        size="100%"
        padding="md"
        title={
          <Link href={"/"}>
           <Logo />
            {/* <ActionIcon
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
            </ActionIcon> */}
          </Link>
        }
        hiddenFrom="sm"
        zIndex={1000000}
      >
        <ScrollArea h={`calc(100vh - ${rem(80)})`} mx="-md">
          <Divider my="sm" />

          <Link href="/manage-notes" className={classes.link}>
            Notes
          </Link>
          <Link href="/manage-syll" className={classes.link}>
            Manage Syllabus
          </Link>
          <a href="/pricing" className={classes.link}>
            Pricing
          </a>

          <Divider my="sm" />
        </ScrollArea>
      </Drawer>
    </Box>
  );
}
