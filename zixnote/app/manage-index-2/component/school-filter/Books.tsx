"use client";
import { DeleteAction } from "@/components/DeleteAction";
import { showNotifications } from "@/components/Notification";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import CreatableSelect from "react-select/creatable";
import { showErrorNotification } from "../../../../components/showErrorNotification";
interface DataInput {
  id: number;
  class_id: number | null;
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

export const Books = ({
  action,
  classId,
  canModerate,
  isPending,
}: {
  action: (id: number, name: string) => void;
  classId: number | undefined;
  canModerate: boolean;
  isPending: boolean;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [options, setOptions] = useState<Option[] | undefined>(undefined);
  const [value, setValue] = useState<Option | null>();
  const supabase = createClient();
  useEffect(() => {
    setValue(null);
    const getSchool = async () => {
      setIsLoading(true);
      const { data: books, error } = await supabase
        .from("syll_syllabus_entity")
        .select(`id,class_id,syllabus_name`)
        .eq("class_id", classId!);
      if (error) {
        showErrorNotification(error);
        setIsLoading(false);
        return;
      }
      setOptions(books?.map((x) => createOption(x)));
      setIsLoading(false);
    };
    if (classId) {
      getSchool();
    }
  }, [classId, supabase]);

  const handleChange = (newValue: Option | null) => {
    setValue(newValue);
    action(Number(newValue?.value), newValue?.label!);
  };
  const handleCreate = async (inputValue: string) => {
    if (!canModerate) {
      showNotifications("You don't have required Permission!");
      return;
    }
    if (!classId) {
      showNotifications("No class selected");
      return;
    }
    setIsLoading(true);
    const { data, error } = await supabase
      .from("syll_syllabus_entity")
      .insert([{ syllabus_name: inputValue, class_id: classId, type_id: 1 }])
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
    setValue(createOption(data));
    showNotifications(null, "created");
  };
  const handleDelete = async () => {
    setIsLoading(true);

    const { error } = await supabase
      .from("syll_syllabus_entity")
      .delete()
      .eq("id", value?.value!);
    if (error) {
      showErrorNotification(error);
      setIsLoading(false);
      return;
    }
    showNotifications(null, "deleted");
    setIsLoading(false);
    setOptions((prev) => prev?.filter((item) => item.value !== value?.value));
    setValue(null);
  };
  const isDisabled = isLoading || value === null || value === undefined;
  return (
    <div className=" flex items-center px-1 gap-1">
      <div className="flex-1">
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
      {canModerate &&
        DeleteAction(isLoading, isDisabled || isPending, handleDelete)}
    </div>
  );
};
