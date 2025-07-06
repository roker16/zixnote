"use client";
import { Anchor, Group, ActionIcon, rem } from "@mantine/core";
import {
  IconBrandTwitter,
  IconBrandYoutube,
  IconBrandInstagram,
} from "@tabler/icons-react";
// import { MantineLogo } from "@mantinex/mantine-logo";
import classes from "./FooterCentered.module.css";
import Link from "next/link";

const links = [
  { link: "/contact", label: "Contact us" },
  { link: "/privacy", label: "Privacy Policy" },
  { link: "/terms-conditions", label: "Terms and Conditions" },
];

export function FooterCentered() {
  const items = links.map((link) => (
    <Link
      className="no-underline text-sm text-gray-700"
      key={link.label}
      href={link.link}
    >
      {link.label}
    </Link>
  ));

  return (
    <div className={`${classes.footer} `}>
      <div className={classes.inner}>
        <IconBrandTwitter
          style={{ width: rem(18), height: rem(18) }}
          stroke={1.5}
        />

        <Group className={classes.links}>{items}</Group>

        <Group gap="xs" justify="flex-end" wrap="nowrap">
          <ActionIcon size="lg" variant="default" radius="xl">
            <IconBrandTwitter
              style={{ width: rem(18), height: rem(18) }}
              stroke={1.5}
            />
          </ActionIcon>
          <ActionIcon size="lg" variant="default" radius="xl">
            <IconBrandYoutube
              style={{ width: rem(18), height: rem(18) }}
              stroke={1.5}
            />
          </ActionIcon>
          <ActionIcon size="lg" variant="default" radius="xl">
            <IconBrandInstagram
              style={{ width: rem(18), height: rem(18) }}
              stroke={1.5}
            />
          </ActionIcon>
        </Group>
      </div>
    </div>
  );
}
