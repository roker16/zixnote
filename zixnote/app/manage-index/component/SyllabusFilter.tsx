"use client";
import { Tabs, rem } from "@mantine/core";
import {
  IconPhoto,
  IconMessageCircle,
  IconSettings,
} from "@tabler/icons-react";
import { School } from "./Filters/School";
import Parent from "./Filters/Parent";

export default function SyllabusFilter() {
  const iconStyle = { width: rem(12), height: rem(12) };

  return (
    <Tabs  variant="pills" radius="md" defaultValue="school" w={"75%"}>
      <Tabs.List bg={"var(--mantine-primary-color-1)"} p={"xs"} justify="center">
        <Tabs.Tab value="school" leftSection={<IconPhoto style={iconStyle} /> } >
          School
        </Tabs.Tab>
        <Tabs.Tab
          value="college"
          leftSection={<IconMessageCircle style={iconStyle} />}
        >
          College
        </Tabs.Tab>
        <Tabs.Tab
          value="exams"
          leftSection={<IconSettings style={iconStyle} />}
        >
          Exams
        </Tabs.Tab>
        <Tabs.Tab
          value="personal"
          leftSection={<IconSettings style={iconStyle} />}
        >
          Personal
        </Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value="school"><Parent/></Tabs.Panel>

      <Tabs.Panel value="college"><Parent/></Tabs.Panel>

      <Tabs.Panel value="exams">Settings tab content</Tabs.Panel>
      <Tabs.Panel value="personal">Settings tab content</Tabs.Panel>
    </Tabs>
  );
}

