"use client";
import { createClient } from "@/utils/supabase/client";
// import { MdAdd, MdEdit } from "react-icons/md";
import {
  Box,
  Button,
  Chip,
  Group,
  Modal,
  NumberInput,
  Textarea,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { useInsertMutation } from "@supabase-cache-helpers/postgrest-swr";
import { useRouter, useSearchParams } from "next/navigation";

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
  // const [value, setValue] = useState('react');
  const searchParams = useSearchParams();
  const router = useRouter();
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
    type: string;
  }

  const form = useForm<Formvalue>({
    initialValues: {
      title: "",
      order: 0,
      type: "notes",
    },

    validate: {
      title: (value) =>
        value.length > 500 ? "Must be less than 500 character" : null,
      order: (value) => (value > 200 ? "Must be less than 200" : null),
    },
  });
  const onSubmitHandler = async (formData: Formvalue) => {
    const userId = (await supabase.auth.getSession()).data.session?.user.id;
    if (!userId) {
      alert("User not logged In!");
      router.replace("/login");
      return;
    }
    await insert([
      {
        title: formData.title,
        order: formData.order,
        owner_fk: userId,
        index_id_fk: Number(headingId),
        type: formData.type,
      },
    ]);
  };

  return (
    <>
      <Modal
        overlayProps={{ opacity: 0.15 }}
        opened={opened}
        onClose={close}
        title="Create Note"
      >
        <Box mx="auto">
          <form onSubmit={form.onSubmit((values) => onSubmitHandler(values))}>
            <Textarea
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
            <Chip.Group multiple={false} {...form.getInputProps("type")}>
              <Group justify="flex-start" mt={16} gap={2}>
                <Chip value="notes" size="xs">
                  Notes
                </Chip>
                <Chip value="question" size="xs">
                  Question
                </Chip>
                <Chip value="test" size="xs">
                  Class Test
                </Chip>
                <Chip value="assignment" size="xs">
                  Assignment
                </Chip>
              </Group>
            </Chip.Group>
            {/* <Checkbox
              mt="md"
              label="I agree to sell my privacy"
              {...form.getInputProps("termsOfService", { type: "checkbox" })}
            /> */}

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
