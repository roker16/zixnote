"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Card, Title, Text, Group, Loader } from "@mantine/core";

// Raw Supabase row
interface KpiEventRaw {
  id: number;
  created_at: string | null;
  event_type: string;
  metadata: any;
  profiles: {
    full_name: string | null;
  } | null;
}

// Transformed for display
interface KpiEvent {
  id: number;
  full_name: string;
  book_name?: string;
  created_at: string;
}

export default function AiDrawerOpensTracker() {
  const supabase = createClient();
  const [events, setEvents] = useState<KpiEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchKPI = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("kpi_events")
        .select("id, event_type, created_at, metadata, profiles(full_name)")
        .eq("event_type", "ai_drawer_opened")
        .order("created_at", { ascending: false })
        .limit(50);

      if (error) {
        console.error("Error loading AI drawer events:", error);
        setLoading(false);
        return;
      }

      const parsed = (data as KpiEventRaw[]).map((event) => ({
        id: event.id,
        full_name: event.profiles?.full_name ?? "Anonymous",
        book_name:
          typeof event.metadata === "object" && event.metadata?.book_name
            ? event.metadata.book_name
            : undefined,
        created_at: event.created_at ?? "",
      }));

      setEvents(parsed);
      setLoading(false);
    };

    fetchKPI();
  }, [supabase]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder className="mt-4">
      <Title order={4} className="mb-4">
        💬 AI Drawer Opens
      </Title>

      {loading ? (
        <Loader size="sm" />
      ) : events.length === 0 ? (
        <Text size="sm" c="dimmed">
          No AI drawer opens logged yet.
        </Text>
      ) : (
        <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
          {events.map((event) => (
            <Group key={event.id} className="border-b pb-1">
              <div>
                <Text size="sm">
                  Book Name: <strong>{event.book_name ?? "Unknown"}</strong>
                </Text>
                <Text size="xs" c="dimmed">
                  By: {event.full_name}
                </Text>
              </div>
              <Text size="xs" c="dimmed">
                {new Intl.DateTimeFormat("en-GB", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                }).format(new Date(event.created_at))}
              </Text>
            </Group>
          ))}
        </div>
      )}
    </Card>
  );
}
