"use client";
import { DeleteAction } from "@/components/DeleteAction";
import { showNotifications } from "@/components/Notification";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState, useTransition } from "react";
import CreatableSelect from "react-select/creatable";
import { showErrorNotification } from "../../../../components/showErrorNotification";
import { Group, Text } from "@mantine/core";

import { useRouter } from "next/navigation";
import { handleTransition } from "../../handleTransition";

interface DataInput {
  id: number;

  syllabus_name: string;
}

interface Option {
  readonly label: string;
  readonly value: string;
}

const createOption = (x: DataInput) => ({
  label: x.syllabus_name,
  value: x.id.toString(),
});

export const PersonalBook = ({ canModerate }: { canModerate: boolean }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [options, setOptions] = useState<Option[] | undefined>(undefined);
  const [value, setValue] = useState<Option | null>();
  const [userId, setUserId] = useState<string | undefined>(undefined);
  const supabase = createClient();
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  useEffect(() => {
    setValue(null);
    const getSchool = async () => {
      setIsLoading(true);
      const userId = (await supabase.auth.getUser()).data.user?.id;
      if (!userId) {
        setUserId(undefined);
        setOptions(undefined);
        return;
      }
      setUserId(userId);
      const { data: books, error } = await supabase
        .from("syll_syllabus_entity")
        .select(`id,syllabus_name`)
        .eq("owner_id", userId);
      if (error) {
        showErrorNotification(error);
        setIsLoading(false);
        return;
      }
      setOptions(books?.map((x) => createOption(x)));
      setIsLoading(false);
    };
    // if (userId) {
    getSchool();
    // }
  }, [supabase, userId]);

  const handleChange = (newValue: Option | null) => {
    setValue(newValue);
    handleTransition(newValue?.value, newValue?.label, startTransition, router);
  };
  const handleCreate = async (inputValue: string) => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("syll_syllabus_entity")
      .insert({ syllabus_name: inputValue, owner_id: userId, type_id: 4 })
      .select()
      .single();
    if (error) {
      showNotifications(error.message);
      setIsLoading(false);
      return;
    }
    setIsLoading(false);
    setOptions((prev) =>
      prev ? [...prev, createOption(data)] : [createOption(data)]
    );
    // setValue(createOption(data));
    handleChange({ label: data.syllabus_name, value: data.id.toString() });
    showNotifications(null, "created");
  };
  const handleDelete = async () => {
    setIsLoading(true);

    const { error } = await supabase
      .from("syll_syllabus_entity")
      .delete()
      .eq("id", Number(value?.value!));
    if (error) {
      showErrorNotification(error);
      setIsLoading(false);
      return;
    }
    setIsLoading(false);
    setOptions((prev) => prev?.filter((item) => item.value !== value?.value));
    handleChange(null);
    showNotifications(null, "deleted");
  };
  const isDisabled = isLoading || value === null || value === undefined;
  if (!userId) {
    return (
      <div className="flex justify-center">
        <Text c="dimmed" fs="italic">
          You need to login first!
        </Text>
      </div>
    );
  }

  return (
    <div className=" flex items-center gap-1 ">
      <div className="md:w-60 flex-1">
        <CreatableSelect
          placeholder="Select Book..."
          isClearable
          isDisabled={isLoading || isPending}
          isLoading={isLoading || isPending}
          onChange={(newValue) => handleChange(newValue)}
          onCreateOption={handleCreate}
          options={options}
          value={value}
          className="text-sm"
        />
      </div>
      {DeleteAction(isLoading, isDisabled || isPending, handleDelete)}
    </div>
  );
};
