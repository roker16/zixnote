"use client";
import { DeleteAction } from "@/components/DeleteAction";
import { showNotifications } from "@/components/Notification";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import CreatableSelect from "react-select/creatable";
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

// const defaultOptions = [createOption({ id: 5, school_name: "City" })];

export const Books = ({
  action,
  classId,
}: {
  action: (id: number, name: string) => void;
  classId: number | undefined;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [options, setOptions] = useState<Option[] | undefined>(undefined);
  const [value, setValue] = useState<Option | null>();
  const [error, setError] = useState<string | null>(null);
  const supabsae = createClient();
  useEffect(() => {
    setValue(null);
    const getSchool = async () => {
      setIsLoading(true);
      const supabase = createClient();

      const { data: books, error } = await supabase
        .from("syll_syllabus_entity")
        .select(`id,class_id,syllabus_name`)
        .eq("class_id", classId!);
      if (error) {
        setError(error.message);
        setIsLoading(false);
        return;
      }
      setOptions(books?.map((x) => createOption(x)));
      setIsLoading(false);
    };
    if (classId) {
      getSchool();
    }
  }, [classId]);

  const handleChange = (newValue: Option | null) => {
    setValue(newValue);
    action(Number(newValue?.value), newValue?.label!);
  };
  const handleCreate = async (inputValue: string) => {
    setError(null);
    setIsLoading(true);
    const { data, error } = await supabsae
      .from("syll_syllabus_entity")
      .insert([{ syllabus_name: inputValue, class_id: classId!, type_id: 1 }])
      .select()
      .single();
    if (error) {
      showNotifications(error);
      setIsLoading(false);
      return;
    }
    showNotifications(null, "created");
    setIsLoading(false);
    setOptions((prev) =>
      prev ? [...prev, createOption(data!)] : [createOption(data!)]
    );
    setValue(createOption(data!));
  };
  const handleDelete = async () => {
    setError(null);
    setIsLoading(true);

    const { data, error } = await supabsae
      .from("syll_syllabus_entity")
      .delete()
      .eq("id", value?.value!);
    if (error) {
      showNotifications(error);
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
      {error && <div className="text-error">{error}</div>}
      <div className="flex-1">
        <CreatableSelect
          placeholder="Select Book..."
          isClearable
          isDisabled={isLoading}
          isLoading={isLoading}
          onChange={(newValue) => handleChange(newValue)}
          onCreateOption={handleCreate}
          options={options}
          value={value}
          className="text-sm"
        />
      </div>
      {DeleteAction(isLoading, isDisabled, handleDelete)}
    </div>
  );
};
