"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Card, Title, Text, Loader, Stack } from "@mantine/core";

// Nullable-safe view result type
interface LatestKpiEvent {
  id: number | null;
  created_at: string | null;
  event_type: string | null;
  metadata: any;
  full_name: string | null;
}

export default function AiDrawerOpensTracker() {
  const supabase = createClient();
  const [events, setEvents] = useState<LatestKpiEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLatestEvents = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("latest_ai_drawer_events_per_user")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching latest AI drawer events:", error);
        setLoading(false);
        return;
      }

      setEvents(data || []);
      setLoading(false);
    };

    fetchLatestEvents();
  }, [supabase]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder className="mt-4">
      <Title order={4} className="mb-4">
        🧑‍💻 Latest AI Drawer Activity (Unique Users)
      </Title>

      {loading ? (
        <Loader size="sm" />
      ) : events.length === 0 ? (
        <Text size="sm" c="dimmed">
          No AI drawer usage logged yet.
        </Text>
      ) : (
        <Stack gap="sm" className="max-h-[400px] overflow-y-auto pr-2">
          {events.map((event) => {
            const formattedDate = event.created_at
              ? new Intl.DateTimeFormat("en-GB", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                })
                  .format(new Date(event.created_at))
                  .replace(/\//g, "-")
              : "Unknown time";

            return (
              <div
                key={event.id ?? `${event.full_name}-${event.created_at}`}
                className="border-b pb-2"
              >
                <Text fw={700} size="sm">
                  {event.full_name ?? "Anonymous"} — {formattedDate}
                </Text>

                {event.metadata?.book_name && (
                  <Text size="xs" c="gray.6" mt={2}>
                    Book: {event.metadata.book_name}
                  </Text>
                )}
              </div>
            );
          })}
        </Stack>
      )}
    </Card>
  );
}
