"use client";
import { showErrorNotification } from "@/components/showErrorNotification";
import { createClient } from "@/utils/supabase/client";
import { Box, TextInput, Checkbox, Group, Button } from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications, showNotification } from "@mantine/notifications";
import { IconDiscountCheck, IconInfoCircle } from "@tabler/icons-react";
import { useSearchParams } from "next/navigation";
import React, { useState } from "react";
import SharedList from "./SharedList";
import { useInsertMutation } from "@supabase-cache-helpers/postgrest-swr";

function ManageSharing() {
  const searchParams = useSearchParams();
  const headingId = searchParams.get("headingid");
  const [loading, setLoading] = useState(false);
  const supabase = createClient();
  const { trigger: insert } = useInsertMutation(
    supabase.from("notes_sharing"),
    ["id"],
    null,
    {
      onSuccess: () => {
        setLoading(false);
        notifications.show({
          title: "Notes shared!",
          message: "Notes shared successfully!",
          icon: <IconInfoCircle />,
          color: "blue",
        });
      },
      onError: (e) => {
        showErrorNotification(e);
        setLoading(false);
        return;
      },
    }
  );

  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      email: "",
      canEdit: false,
      canCopy: false,
    },

    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
    },
  });
  const handleSubmit = async (values: typeof form.values) => {
    const user = (await supabase.auth.getSession()).data.session?.user;
    if (user?.email === values.email) {
      notifications.show({
        title: "Can't share",
        message: "Can't share your notes to yourself",
        icon: <IconInfoCircle />,
        color: "blue",
      });
      return
    }
    setLoading(true);

    const { data, error } = await supabase
      .from("profiles")
      .select(`*`)
      .eq("email", values.email)
      .maybeSingle();
    if (error) {
      setLoading(false);
      showErrorNotification(error);
      return;
    }
    if (!data) {
      notifications.show({
        title: "User does not exists",
        message: "No user exists corresponding to this email!",
        icon: <IconInfoCircle />,
        color: "blue",
      });
      setLoading(false);
      return;
    }
    const { data: k, error: e } = await supabase
      .from("notes_sharing")
      .select(`*`)
      .eq("shared_with", data.id)
      .eq("shared_by", user?.id!)
      .eq("heading_id", Number(headingId))
      .maybeSingle();
    if (e) {
      showErrorNotification(e);
      setLoading(false);
      return;
    }
    if (k) {
      notifications.show({
        title: "Notes already shared with this user",
        message: "Notes from this topic is already shared with this user",
        icon: <IconInfoCircle />,
        color: "blue",
      });
      setLoading(false);
      return;
    }
    await insert([
      {
        heading_id: Number(headingId),
        shared_by: user?.id!,
        shared_with: data.id,
        can_copy: values.canCopy,
        can_edit: values.canEdit,
      },
    ]);
  };
  return (
    <Box maw={340} mx="auto">
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <TextInput
          withAsterisk
          label="Email"
          placeholder="Email"
          key={form.key("email")}
          {...form.getInputProps("email")}
        />

        <Checkbox
          mt="md"
          label="Allow Edit"
          key={form.key("canEdit")}
          {...form.getInputProps("canEdit", { type: "checkbox" })}
        />
        <Checkbox
          mt="md"
          label="Allow Copy"
          key={form.key("canCopy")}
          {...form.getInputProps("canCopy", { type: "checkbox" })}
        />

        <Group justify="flex-end" mt="md">
          <Button type="submit" loading={loading}>
            Share
          </Button>
        </Group>
      </form>
      <SharedList />
    </Box>
  );
}

export default ManageSharing;
