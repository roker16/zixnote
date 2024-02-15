"use client";
import { Tabs, rem } from "@mantine/core";
import {
  IconChalkboard,
  IconFilePencil,
  IconLockHeart,
  IconSchool
} from "@tabler/icons-react";
import Parent from "./book-filter/Parent";
import { isDevEnvironment } from "@/utils/helper";

export default function SyllabusFilter() {
  const iconStyle = { width: rem(20), height: rem(20) };

  const tabsData = [
    {
      value: "school",
      icon: <IconChalkboard  stroke={1} style={iconStyle} />,
      label: "School",
      component: <Parent />,
    },
    {
      value: "college",
      icon: <IconSchool stroke={1} style={iconStyle} />,
      label: "College",
      component: <Parent />,
    },
    {
      value: "exams",
      icon: <IconFilePencil stroke={1}  style={iconStyle} />,
      label: "Exams",
      component: <Parent />,
    },
    {
      value: "personal",
      icon: <IconLockHeart stroke={1} style={iconStyle} />,
      label: "Personal",
      component: <Parent />,
    },
  ];

  return (
    <Tabs variant="pills" radius="md" defaultValue="school" w="75%">
      <Tabs.List  p="xs" justify="center">
        {tabsData.map(({ value, icon, label }) => (
          <Tabs.Tab key={value} value={value} leftSection={icon}>
            {label}
          </Tabs.Tab>
        ))}
      </Tabs.List>

      {tabsData.map(({ value, component }) => (
        <Tabs.Panel key={value} value={value}>
          {component}
        </Tabs.Panel>
      ))}
    </Tabs>
  );
}
