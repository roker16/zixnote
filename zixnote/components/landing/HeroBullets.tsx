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
              <b>Access notes anywhere, at any device</b> – all packages have
              MIT license, you can use Mantine in any project
            </List.Item>
            <List.Item>
              <b>Share and distribute notes</b> – Share notes with other users
              on Jionote.
            </List.Item>
            <List.Item>
              <b>Export your notes to PDF</b> – Export your digital notes to PDF
              or print to a hard paper in just one click.
            </List.Item>
          </List>

          <Group mt={30}>
            <Button radius="xl" size="md" className={classes.control}>
              Get started
            </Button>
            <Button
              variant="default"
              radius="xl"
              size="md"
              className={classes.control}
            >
              Source code
            </Button>
          </Group>
        </div>
        <Image src={image.src} className={classes.image} />
      </div>
    </Container>
  );
}
