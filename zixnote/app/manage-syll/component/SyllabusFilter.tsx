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
import { useCallback, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function SyllabusFilter({
  canModerate,
}: {
  canModerate: boolean;
}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Get a new searchParams string by merging the current
  // searchParams with a provided key/value pair
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );
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
  const handleTabChange = (selectedTab: string) => {
    router.replace(
      pathname + "?" + createQueryString("activetab", selectedTab)
    );
  };
  return (
    <Tabs
      defaultValue={searchParams.get("activetab") || "school"}
      onChange={(selectedTab) => {
        handleTabChange(selectedTab!);
      }}
      variant="pills"
      radius="md"
    >
      <Tabs.List p="xs" justify="center" >
        {tabsData.map(({ value, icon, label }) => (
          <Tabs.Tab key={value} value={value} leftSection={icon} py={8}>
            {label}
          </Tabs.Tab>
        ))}
      </Tabs.List>
      {tabsData.map(({ value, component }) => (
        <Tabs.Panel key={value} value={value} >
          {component}
        </Tabs.Panel>
      ))}
    </Tabs>
  );
}
