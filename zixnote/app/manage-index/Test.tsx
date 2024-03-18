"use client";
import { Center, SegmentedControl, rem } from "@mantine/core";
import {
  IconChalkboard,
  IconFilePencil,
  IconSchool,
} from "@tabler/icons-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import SchoolParent from "./component/school-filter/SchoolParent";
import CollegeParent from "./component/college-filter/CollegeParent";
import ExamParent from "./component/exam-filter/ExamParent";

export function Demo({ canModerate }: { canModerate: boolean }) {
  const [value, setValue] = useState("school");
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
  const handleTabChange = (selectedTab: string) => {
    setValue(selectedTab);
    router.replace(
      pathname + "?" + createQueryString("activetab", selectedTab)
    );
  };
  const iconStyle = { width: rem(20), height: rem(20) };
  return (
    <>
      <SegmentedControl
        // value={value}
        defaultValue={searchParams.get("activetab") || "school"}
        onChange={(f) => handleTabChange(f)}
        fullWidth
        color="indigo"
        data={[
          {
            value: "school",
            label: (
              <Center style={{ gap: 10 }}>
                <IconChalkboard stroke={1} style={iconStyle} />
                <span>School</span>
              </Center>
            ),
          },
          {
            value: "college",
            label: (
              <Center style={{ gap: 10 }}>
                <IconSchool stroke={1} style={iconStyle} />
                <span>College</span>
              </Center>
            ),
          },
          {
            value: "exam",
            label: (
              <Center style={{ gap: 10 }}>
                <IconFilePencil stroke={1} style={iconStyle} />
                <span>Exam</span>
              </Center>
            ),
          },
        ]}
      />
      {value === "school" && <SchoolParent canModerate={canModerate} />}
      {value === "college" && <CollegeParent canModerate={canModerate} />}
      {value === "exam" && <ExamParent canModerate={canModerate} />}
    </>
  );
}
