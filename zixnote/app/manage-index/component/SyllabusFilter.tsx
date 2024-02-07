"use client";
import { Tabs, rem } from "@mantine/core";
import {
  IconPhoto,
  IconMessageCircle,
  IconSettings,
} from "@tabler/icons-react";
import Parent from "./book-filter/Parent";

export default function SyllabusFilter() {
  const iconStyle = { width: rem(12), height: rem(12) };

  const tabsData = [
    {
      value: "school",
      icon: <IconPhoto style={iconStyle} />,
      label: "School",
      component: <Parent />,
    },
    {
      value: "college",
      icon: <IconMessageCircle style={iconStyle} />,
      label: "College",
      component: <Parent />,
    },
    {
      value: "exams",
      icon: <IconSettings style={iconStyle} />,
      label: "Exams",
      component: <Parent />,
    },
    {
      value: "personal",
      icon: <IconSettings style={iconStyle} />,
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
