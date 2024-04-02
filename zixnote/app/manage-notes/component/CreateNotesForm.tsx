"use client";
import { createClient } from "@/utils/supabase/client";
// import { MdAdd, MdEdit } from "react-icons/md";
import { Box, Button, Checkbox, Group, Modal, NumberInput, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { useInsertMutation } from "@supabase-cache-helpers/postgrest-swr";
import { useSearchParams } from "next/navigation";
import { title } from "process";

export default function CreateNotesForm({
  parentId,
  parentCategoryId,
  syllabusId,
  label,
}: {
  parentId?: number | null | undefined;
  parentCategoryId?: number | null | undefined;
  syllabusId?: number | null | undefined;
  label?: string;
}) {
  const supabase = createClient();
  const [opened, { open, close }] = useDisclosure(false);
  const searchParams = useSearchParams();
  const headingId = searchParams.get("headingid");
  const { trigger: insert } = useInsertMutation(
    supabase.from("notes"),
    ["id"],
    null,
    {
      onSuccess: () => console.log("Success!"),
      onError: (e) => console.log("error", e),
    }
  );

  interface Formvalue {
    title: string;
    order: number;
  }

  const form = useForm<Formvalue>({
    initialValues: {
      title: "",
      order: 0,
    },

    validate: {
      title: (value) =>
        value.length > 100 ? "Must be less than 100 character" : null,
      order: (value) => (value > 100 ? "Must be less than 100" : null),
    },
  });
  const onSubmitHandler = async (formData: Formvalue) => {
    await insert([
      {
        title: formData.title,
        order: formData.order,
        owner_fk: "44ea6393-ec00-4a4e-bec5-144eb86f8ed7",
        index_id_fk: Number(headingId),
      },
    ]);
  };

  return (
    <>
      <Modal opened={opened} onClose={close} title="Create Index">
        <Box maw={340} mx="auto">
          <form onSubmit={form.onSubmit((values) => onSubmitHandler(values))}>
            <TextInput
              withAsterisk
              label="Note title"
              placeholder="Note title"
              {...form.getInputProps("title")}
            />
            <NumberInput
              {...form.getInputProps("order")}
              label="Sequence"
              placeholder="Sequence"
              mt="md"
            />
            <Checkbox
              mt="md"
              label="I agree to sell my privacy"
              {...form.getInputProps("termsOfService", { type: "checkbox" })}
            />

            <Group justify="flex-end" mt="md">
              <Button type="submit">Submit</Button>
            </Group>
          </form>
        </Box>
      </Modal>

      <Button onClick={open} variant="light">
        Create Note
      </Button>
    </>
  );
}
