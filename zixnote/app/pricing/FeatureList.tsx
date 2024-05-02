"use client";
import { List, ThemeIcon, rem } from "@mantine/core";
import {
  IconCheck,
  IconChecklist,
  IconCircleCheck,
  IconCircleDashed,
} from "@tabler/icons-react";

export function FeatureList() {
  return (
    <List
      spacing="xs"
      size="sm"
      center
      icon={
        <ThemeIcon color="var(--mantine-primary-color-6)" size={24} radius="xl">
          <IconCircleCheck style={{ width: rem(16), height: rem(16) }} />
        </ThemeIcon>
      }
    >
      <List.Item>All features included.</List.Item>
      <List.Item>
        All future updates shall be provied without any additinal charges.
      </List.Item>
      <List.Item>No hidded charges.</List.Item>
    </List>
  );
}
