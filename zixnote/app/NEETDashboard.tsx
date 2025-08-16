"use client";

import {
  Card,
  Group,
  Text,
  Title,
  Container,
  SimpleGrid,
  Anchor,
  ThemeIcon,
  Box,
} from "@mantine/core";
import {
  IconAtom,
  IconFlask2,
  IconDna,
  IconDownload,
  IconBooks,
  IconSchool,
} from "@tabler/icons-react";

export default function NEETDashboard() {
  const class11 = [
    {
      subject: "Physics",
      icon: IconAtom,
      color: "indigo",
      books: [
        { title: "NCERT Physics Part 1", link: "/ncert/class11/physics-part1" },
        { title: "NCERT Physics Part 2", link: "/ncert/class11/physics-part2" },
      ],
    },
    {
      subject: "Chemistry",
      icon: IconFlask2,
      color: "red",
      books: [
        {
          title: "NCERT Chemistry Part 1",
          link: "/ncert/class11/chemistry-part1",
        },
        {
          title: "NCERT Chemistry Part 2",
          link: "/ncert/class11/chemistry-part2",
        },
      ],
    },
    {
      subject: "Biology",
      icon: IconDna,
      color: "green",
      books: [{ title: "NCERT Biology", link: "/ncert/class11/biology" }],
    },
  ];

  const class12 = [
    {
      subject: "Physics",
      icon: IconAtom,
      color: "indigo",
      books: [
        { title: "NCERT Physics Part 1", link: "/ncert/class12/physics-part1" },
        { title: "NCERT Physics Part 2", link: "/ncert/class12/physics-part2" },
      ],
    },
    {
      subject: "Chemistry",
      icon: IconFlask2,
      color: "red",
      books: [
        {
          title: "NCERT Chemistry Part 1",
          link: "/ncert/class12/chemistry-part1",
        },
        {
          title: "NCERT Chemistry Part 2",
          link: "/ncert/class12/chemistry-part2",
        },
      ],
    },
    {
      subject: "Biology",
      icon: IconDna,
      color: "green",
      books: [{ title: "NCERT Biology", link: "/ncert/class12/biology" }],
    },
  ];

  const renderBooks = (data: typeof class11) =>
    data.map(({ subject, icon: Icon, color, books }) => (
      <Card
        key={subject}
        shadow="sm"
        radius="lg"
        padding="md"
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.85)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255,255,255,0.3)",
        }}
        className="hover:shadow-xl transition-all relative z-10"
      >
        <Group mb="xs" wrap="nowrap">
          <ThemeIcon variant="light" color={color} radius="xl" size="lg">
            <Icon size={18} />
          </ThemeIcon>
          <Text fw={600} size="md" className="truncate">
            {subject}
          </Text>
        </Group>
        {books.map((book) => (
          <Anchor
            key={book.title}
            href={book.link}
            className="flex items-center justify-between p-1 sm:p-2 rounded-md hover:bg-gray-50 transition"
          >
            <Text size="sm" className="truncate">
              {book.title}
            </Text>
            <IconDownload size={14} />
          </Anchor>
        ))}
      </Card>
    ));

  return (
    <Box
      style={{
        position: "relative",
        minHeight: "100vh",
        background: "linear-gradient(to bottom right, #ebf8ff, #fdf2f8)",
        overflow: "hidden",
      }}
    >
      {/* SVG pastel shapes layer */}
      <Box
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 1,
          pointerEvents: "none",
        }}
      >
        <svg
          width="100%"
          height="100%"
          xmlns="http://www.w3.org/2000/svg"
          style={{ opacity: 0.2 }}
        >
          <circle cx="15%" cy="20%" r="80" fill="#86efac" />
          <rect
            x="70%"
            y="10%"
            width="100"
            height="100"
            fill="#f9a8d4"
            transform="rotate(15)"
          />
          <circle cx="80%" cy="70%" r="90" fill="#93c5fd" />
          <polygon
            points="40,60 70,90 10,90"
            fill="#bbf7d0"
            transform="translate(50,200)"
          />
        </svg>
      </Box>

      <Container size="lg" className="relative z-20 py-8">
        <Group gap="apart" mb="lg">
          <Group>
            <ThemeIcon color="violet" variant="light" radius="xl" size="lg">
              <IconSchool size={20} />
            </ThemeIcon>
            <Title order={2} className="text-gray-800">
              NEET Dashboard
            </Title>
          </Group>
          <ThemeIcon color="cyan" variant="light" radius="xl" size="lg">
            <IconBooks size={20} />
          </ThemeIcon>
        </Group>

        <Title
          order={3}
          mb="md"
          className="text-indigo-700 flex items-center gap-2"
        >
          <IconSchool size={18} /> Class 11
        </Title>
        <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md">
          {renderBooks(class11)}
        </SimpleGrid>

        <Title
          order={3}
          mt="xl"
          mb="md"
          className="text-indigo-700 flex items-center gap-2"
        >
          <IconSchool size={18} /> Class 12
        </Title>
        <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md">
          {renderBooks(class12)}
        </SimpleGrid>
      </Container>
    </Box>
  );
}
