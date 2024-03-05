"use client";
import { Box, Tabs, rem } from "@mantine/core";
import {
  IconChalkboard,
  IconFilePencil,
  IconLockHeart,
  IconSchool,
} from "@tabler/icons-react";
import SchoolParent from "./school-filter/SchoolParent";
import CollegeParent from "./college-filter/CollegeParent";
import ExamParent from "./exam-filter/ExamParent";
import PersonalParent from "./personal-filter/PersonalParent";

export default function SyllabusFilter({
  canModerate,
}: {
  canModerate: boolean;
}) {
  const iconStyle = { width: rem(20), height: rem(20) };

  const tabsData = [
    {
      value: "school",
      icon: <IconChalkboard stroke={1} style={iconStyle} />,
      label: "School",
      component: <SchoolParent canModerate={canModerate} />,
    },
    {
      value: "college",
      icon: <IconSchool stroke={1} style={iconStyle} />,
      label: "College",
      component: <CollegeParent canModerate={canModerate} />,
    },
    {
      value: "exams",
      icon: <IconFilePencil stroke={1} style={iconStyle} />,
      label: "Exams",
      component: <ExamParent canModerate={canModerate} />,
    },
    {
      value: "personal",
      icon: <IconLockHeart stroke={1} style={iconStyle} />,
      label: "Personal",
      component: <PersonalParent canModerate={canModerate} />,
    },
  ];

  return (
    <Tabs variant="pills" radius="md" defaultValue="school" w="75%">
      <Tabs.List p="xs" justify="center">
        {tabsData.map(({ value, icon, label }) => (
          <Tabs.Tab key={value} value={value} leftSection={icon}>
            {label}
          </Tabs.Tab>
        ))}
      </Tabs.List>

      {tabsData.map(({ value, component }) => (
        <Tabs.Panel key={value} value={value}>
         <Box h={"48px"}>{component}</Box> 
        </Tabs.Panel>
      ))}
    </Tabs>
  );
}
