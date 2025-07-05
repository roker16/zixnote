"use client";

import { useState, useEffect } from "react";
import { Card, Switch, Text, Loader, Stack } from "@mantine/core";
import { createClient } from "@/utils/supabase/client";

export default function ControlSettings() {
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [settings, setSettings] = useState<{
    test_mode: boolean;
    payment_test: boolean;
  }>({
    test_mode: false,
    payment_test: false,
  });

  useEffect(() => {
    const settingNames = ["test_mode", "payment_test"];
    async function fetchSettings() {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("settings")
          .select("setting_name, setting_status")
          .in("setting_name", settingNames);

        if (error) throw error;

        // Create map of settings or fallback if missing
        const map: Record<string, boolean> = {};
        for (const name of settingNames) {
          const entry = data?.find((d) => d.setting_name === name);
          if (!entry) {
            // Insert default if missing
            await supabase
              .from("settings")
              .insert({ setting_name: name, setting_status: "disabled" });
            map[name] = false;
          } else {
            map[name] = entry.setting_status === "enabled";
          }
        }

        setSettings(map as any);
      } catch (err) {
        console.error(err);
        setError("Failed to load or initialize control settings.");
      } finally {
        setLoading(false);
      }
    }

    fetchSettings();
  }, [supabase]);

  const handleToggle = async (settingName: string) => {
    const newValue = !settings[settingName as keyof typeof settings];
    setSettings((prev) => ({ ...prev, [settingName]: newValue }));
    setLoading(true);

    try {
      const { error } = await supabase
        .from("settings")
        .update({ setting_status: newValue ? "enabled" : "disabled" })
        .eq("setting_name", settingName);

      if (error) throw error;
    } catch (err) {
      console.error(err);
      setError(`Failed to update ${settingName.replace("_", " ")} setting.`);
      setSettings((prev) => ({ ...prev, [settingName]: !newValue }));
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

      <Stack gap="md">
        <Switch
          checked={settings.test_mode}
          onChange={() => handleToggle("test_mode")}
          disabled={loading}
          label="Test Mode"
          size="md"
        />
        <Switch
          checked={settings.payment_test}
          onChange={() => handleToggle("payment_test")}
          disabled={loading}
          label="Payment Test"
          size="md"
        />
      </Stack>

      {loading && <Loader size="sm" mt="md" />}
    </Card>
  );
}
