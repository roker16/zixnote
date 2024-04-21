"use client";
import {
  Image,
  Container,
  Title,
  Button,
  Group,
  Text,
  List,
  ThemeIcon,
  rem,
} from "@mantine/core";
import { IconCheck } from "@tabler/icons-react";
import image from "./image.svg";
import classes from "./HeroBullets.module.css";
import { useEffect } from "react";

export function HeroBullets() {
  return (
    <Container size="md">
      <div className={classes.inner}>
        <div className={classes.content}>
          <Title className={classes.title}>
            A modern <span className={classes.highlight}>Digital</span> <br />{" "}
            notes making platform
          </Title>
          <Text c="dimmed" mt="md" lh={2}>
            Designed for <span className={classes.highlight}>Teachers</span>{" "}
            <span className={classes.highlight}>Students</span>{" "}
            <span className={classes.highlight}>Examinee</span>{" "}
            <span className={classes.highlight}>Writers</span>
            {" & "}
            <span className={classes.highlight}>Researchers</span> who seek to
            effortlessly create, edit, share, and securely store their notes
            indefinitely.
          </Text>

          <List
            mt={30}
            spacing="sm"
            size="md"
            center={false}
            icon={
              <ThemeIcon size={20} radius="xl">
                <IconCheck
                  style={{ width: rem(12), height: rem(12) }}
                  stroke={1.5}
                />
              </ThemeIcon>
            }
          >
            <List.Item>
              <b>Rich & colorfull notes</b> – Enrich your notes with Colorfull
              texts, Maths & equations, tables, images, link, video and many
              more.
            </List.Item>
            <List.Item>
              <b>Access notes anywhere, at any device</b> – Don&apos;t burden
              yourself with the fear of losing your notes. Once created, they
              are securely stored and accessible on any device, from anywhere.
            </List.Item>
            <List.Item>
              <b>Share and distribute notes</b> – Share notes with other users
              on Diginote.
            </List.Item>
            <List.Item>
              <b>Export your notes to PDF</b> – Export your digital notes to PDF
              or print to a hard paper in just one click.
            </List.Item>
          </List>

          <Group mt={30}>
            <Button
              component="a"
              href="/login"
              radius="xl"
              size="md"
              onClick={(event) => event.preventDefault()}
              className={classes.control}
            >
              Get started
            </Button>
          </Group>
        </div>
        <Image src={image.src} className={classes.image} />
      </div>
    </Container>
  );
}
