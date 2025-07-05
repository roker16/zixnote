"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Card, Title, Text, Loader, Stack } from "@mantine/core";

interface LatestNoteEvent {
  id: number | null;
  full_name: string | null;
  metadata: any;
  created_at: string | null;
}

export default function NoteUpdatesTracker() {
  const supabase = createClient();
  const [events, setEvents] = useState<LatestNoteEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("latest_note_updates_per_user")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error loading latest note updates", error);
        setLoading(false);
        return;
      }

      setEvents(data || []);
      setLoading(false);
    };

    fetchEvents();
  }, [supabase]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder className="mt-4">
      <Title order={4} className="mb-4">
        📝 Notes update tracker
      </Title>

      {loading ? (
        <Loader size="sm" />
      ) : events.length === 0 ? (
        <Text size="sm" c="dimmed">
          No updates found.
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
