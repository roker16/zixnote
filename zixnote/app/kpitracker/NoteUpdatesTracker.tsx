"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Card, Title, Text, Group, Loader } from "@mantine/core";
interface KpiEventRaw {
  id: number;
  user_id: string | null;
  event_type: string;
  metadata: any;
  created_at: string | null;
  profiles: {
    full_name: string | null;
  } | null;
}

interface KpiEvent {
  id: number;
  username: string;
  event_type: string;
  metadata: { book_name?: number } | null;
  created_at: string;
}

export default function NoteUpdatesTracker() {
  const supabase = createClient();
  const [events, setEvents] = useState<KpiEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchKPI = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("kpi_events")
        .select("id, event_type, metadata, created_at, profiles(full_name)")
        .eq("event_type", "note_updated")
        .order("created_at", { ascending: false })
        .limit(50);

      if (error) {
        console.error("Failed to load KPI events", error);
        setLoading(false);
        return;
      }

      const parsed = (data as KpiEventRaw[]).map((event) => ({
        id: event.id,
        username: event.profiles?.full_name ?? "Anonymous",
        event_type: event.event_type,
        created_at: event.created_at ?? "",
        metadata:
          typeof event.metadata === "object" && event.metadata !== null
            ? { book_name: event.metadata.book_name }
            : null,
      }));

      setEvents(parsed);
      setLoading(false);
    };

    fetchKPI();
  }, [supabase]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder className="mt-4">
      <Title order={4} className="mb-4">
        📝 Last 50 Note Updates
      </Title>

      {loading ? (
        <Loader size="sm" />
      ) : events.length === 0 ? (
        <Text size="sm" c="dimmed">
          No updates found.
        </Text>
      ) : (
        <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
          {events.map((event) => (
            <Group key={event.id} className="border-b pb-1">
              <div>
                <Text size="sm">
                  Book Name:{" "}
                  <strong>{event.metadata?.book_name ?? "Unknown"}</strong>
                </Text>
                <Text size="xs" c="dimmed">
                  By: {event.username}
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
