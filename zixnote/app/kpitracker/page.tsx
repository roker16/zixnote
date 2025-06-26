"use client";

import { Container, Title } from "@mantine/core";
import AiDrawerOpensTracker from "./AiDrawerOpensTracker";
import NoteUpdatesTracker from "./NoteUpdatesTracker";

export default function KPIPage() {
  return (
    <Container size="lg" className="py-10">
      <Title order={2} mb={16}>
        📊 KPI Tracker
      </Title>

      {/* Grid of KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <AiDrawerOpensTracker />
        <NoteUpdatesTracker />
      </div>
    </Container>
  );
}
