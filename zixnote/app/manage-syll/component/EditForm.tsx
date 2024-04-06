"use client";
import { editIndex } from "@/app/action";
import { SubmitButton } from "@/app/submit-button";
import {
  ActionIcon,
  Flex,
  Input,
  Modal,
  NumberInput,
  TextInput,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconPencil } from "@tabler/icons-react";

export default function EditForm({
  id,
  name,
  order,
}: {
  id: number;
  name?: string;
  order?: number;
}) {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Modal opened={opened} onClose={close} title="Edit Index">
        <form action={editIndex}>
          <Flex gap="sm" p="xs" direction="column">
            <input type="hidden" name="id" value={id} />
            <TextInput
              label="Index name"
              name="index"
              defaultValue={name}
              required
            />
            <NumberInput
              label="Sequence"
              name="order"
              defaultValue={order}
              required
            />
            <SubmitButton />
          </Flex>
        </form>
      </Modal>

      <ActionIcon size={"sm"} radius={"lg"} variant={"light"} onClick={open}>
        <IconPencil size={"16px"} />
      </ActionIcon>
    </>
  );
}
