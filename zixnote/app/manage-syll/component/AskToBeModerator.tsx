"use client";
import { createClient } from "@/utils/supabase/client";
import { Flex, Button } from "@mantine/core";
import React, { useState, useTransition } from "react";
import { Transition } from "@headlessui/react";
import { useRouter } from "next/navigation";
import NoticeText from "@/components/NoticeText";

function AskToBeModerator({
  userId,
  syllabusId,
}: {
  userId: string;
  syllabusId: number;
}) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const supabase = createClient();
  const sendRequest = async () => {
    const { error } = await supabase
      .from("syll_moderator")
      .insert({ moderator_id: userId, syllabus_id: syllabusId });
    if (error) {
      return;
    }
    startTransition(() => {
      router.refresh();
    });
  };
  return (
    <Flex
      justify="center"
      gap={"sm"}
      align="center"
      direction="column"
      wrap="nowrap"
    >
      <NoticeText
        text={"To Add or Modify to this index you need to be a moderator!"}
      />
      <div>
        <Button loading={isPending} onClick={() => sendRequest()}>
          Request to be moderator!
        </Button>
      </div>
    </Flex>
  );
}

export default AskToBeModerator;
