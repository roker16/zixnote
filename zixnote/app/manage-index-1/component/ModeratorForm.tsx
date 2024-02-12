"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Text, Button, Center, Flex, TextInput } from "@mantine/core";

export default function ModeratorForm({ syllabusId }: { syllabusId: number }) {
  const [moderator, setModerator] = useState("");
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const supabase = createClient();

  const addModerator = async () => {
    setMessage("");
    try {
      const { data: userData, error: userError } = await supabase
        .from("profiles")
        .select(`id,email`)
        .eq("email", moderator);

      if (userError) {
        setMessage("Error: " + userError.message);
        return;
      }

      if (!userData || userData.length === 0) {
        setMessage("This user does not exist!");
        return;
      }

      const { error: moderatorError } = await supabase
        .from("syll_moderator")
        .insert({ moderator_id: userData[0].id, syllabus_id: syllabusId });

      if (moderatorError) {
        setMessage(
          moderatorError.code === "23505"
            ? "Moderator already exists!"
            : moderatorError.message
        );
        return;
      }

      startTransition(() => {
        router.refresh();
      });
    } catch (error) {
      setMessage((error as Error).message);
    }
  };

  return (
    <Center>
      <Flex gap="sm" p="xs" direction="column">
        <Text size="xs" c="red">
          {message}
          {moderator}
        </Text>
        <TextInput
          label="Moderator email"
          required
          placeholder="Moderator email"
          name="index"
          value={moderator}
          onChange={(e) => setModerator(e.target.value)}
        />
        <Button loading={isPending} onClick={addModerator}>
          Add Moderator
        </Button>
      </Flex>
    </Center>
  );
}
