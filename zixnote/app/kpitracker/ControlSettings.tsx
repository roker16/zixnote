"use client";

import { useState, useEffect } from "react";
import { Card, Switch, Text, Loader } from "@mantine/core";
import { createClient } from "@/utils/supabase/client";

export default function ControlSettings() {
  const [testMode, setTestMode] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  useEffect(() => {
    async function fetchTestMode() {
      try {
        const { data, error } = await supabase
          .from("settings")
          .select("setting_status")
          .eq("setting_name", "test_mode")
          .single();

        if (error && error.code === "PGRST116") {
          const { error: insertError } = await supabase
            .from("settings")
            .insert({ setting_name: "test_mode", setting_status: "disabled" });

          if (insertError) throw insertError;
          setTestMode(false);
        } else if (error) {
          throw error;
        } else {
          setTestMode(data?.setting_status === "enabled");
        }
      } catch (err) {
        setError("Failed to load or initialize test mode settings.");
      } finally {
        setLoading(false);
      }
    }

    fetchTestMode();
  }, [supabase]);

  const handleToggle = async () => {
    const newTestMode = !testMode;
    setTestMode(newTestMode);
    setLoading(true);

    try {
      const { error } = await supabase
        .from("settings")
        .update({ setting_status: newTestMode ? "enabled" : "disabled" })
        .eq("setting_name", "test_mode");

      if (error) throw error;
    } catch (err) {
      setError("Failed to update test mode.");
      setTestMode(!newTestMode);
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return (
      <Card withBorder radius="lg" className="mt-8 p-6">
        <Text size="xl" fw={500} c="red.6">
          Error
        </Text>
        <Text c="dimmed" mt="sm">
          {error}
        </Text>
      </Card>
    );
  }

  return (
    <Card withBorder radius="lg" className="mt-8 p-6">
      <Text size="xl" fw={600} mb="md">
        Control Settings
      </Text>
      <Switch
        checked={testMode}
        onChange={handleToggle}
        disabled={loading}
        label="Test Mode"
        size="md"
      />
      {loading && <Loader size="sm" mt="sm" />}
    </Card>
  );
}
