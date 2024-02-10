"use client";
import { createIndex } from "@/app/action";
import { SubmitButton } from "@/app/submit-button";
// import { MdAdd, MdEdit } from "react-icons/md";

import {
  ActionIcon,
  Button,
  Flex,
  Input,
  Modal,
  NumberInput,
  TextInput,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconPlus } from "@tabler/icons-react";

export default function CreateForm({
  parentId,
  syllabusId,
  label,
}: {
  parentId: number | null | undefined;
  syllabusId?: number | null | undefined;
  label?: string;
}) {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Modal opened={opened} onClose={close} title="Create Index">
        {/* Modal content */}
        <form action={createIndex}>
          <Flex gap="sm" p={"xs"} direction="column">
            <input
              type="hidden"
              name="parentId"
              value={parentId ? parentId : undefined}
            />
            <input type="hidden" name="syllabusId" value={syllabusId!} />
            <TextInput
              label="Index name"
              required
              placeholder="Index name"
              name="index"
            />
            <NumberInput
              label="Sequence"
              required
              placeholder="Sequence"
              name="order"
            />
            <SubmitButton />
          </Flex>
        </form>
      </Modal>

      {label ? (
        <Button onClick={open} variant="light">
          {label}
        </Button>
      ) : (
        <ActionIcon
          size={"sm"}
          radius={"lg"}
          variant={"light"}
          onClick={open}
          aria-label="ActionIcon with size as a number"
        >
          <IconPlus size={"16px"} />
        </ActionIcon>
      )}
    </>
  );
}
