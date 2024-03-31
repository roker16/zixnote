"use client";
import {
  TextInput,
  TextInputProps,
  ActionIcon,
  useMantineTheme,
  rem,
} from "@mantine/core";
import { IconSearch, IconArrowRight } from "@tabler/icons-react";

export function NotesSearch(props?: TextInputProps) {
  const theme = useMantineTheme();

  return (
    <TextInput
      radius="xl"
      size={"sm"}
      w={325}
    
      // style={{ width: "100%" }}
      placeholder="Search your notes..."
      // rightSectionWidth={42}
      leftSection={
        <IconSearch style={{ width: rem(18), height: rem(18) }} stroke={1.5} />
      }
      // rightSection={
      //   <ActionIcon
      //     size={20}
      //     radius="xl"
      //     color={theme.primaryColor}
      //     variant="light"
      //   >
      //     <IconArrowRight
      //       style={{ width: rem(18), height: rem(18) }}
      //       stroke={1.5}
      //     />
      //   </ActionIcon>
      // }
      {...props}
    />
  );
}
