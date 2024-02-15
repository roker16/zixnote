"use client";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import CreatableSelect from "react-select/creatable";

import { DeleteAction } from "@/components/DeleteAction";
import { showNotifications } from "@/components/Notification";
import { isDevEnvironment } from "@/utils/helper";
import { ShowErrorNotification } from "../../../../components/showErrorNotification";

interface InputData {
  id: number;
  school_name: string;
}

interface Option {
  readonly label: string;
  readonly value: string;
}

const createOption = (x: InputData) => ({
  label: x.school_name,
  value: x.id.toString(),
});

// const defaultOptions = [createOption({ id: 5, school_name: "City" })];

export const School = ({ action }: { action: (id: number) => void }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [options, setOptions] = useState<Option[] | undefined>(undefined);
  const [value, setValue] = useState<Option | null>();
  const [error, setError] = useState<string | null>(null);
  const supabsae = createClient();
  useEffect(() => {
    const getSchool = async () => {
      setIsLoading(true);
      const supabase = createClient();

      const { data: school, error } = await supabase
        .from("syll_school")
        .select(`*`);
      if (error) {
        setError(error.message);
        setIsLoading(false);
        return;
      }
      setOptions(school?.map((x) => createOption(x)));
      setIsLoading(false);
    };
    getSchool();
  }, []);

  const handleCreate = async (inputValue: string) => {
    setError(null);
    setIsLoading(true);

    const { data, error } = await supabsae
      .from("syll_school")
      .insert([{ school_name: inputValue }])
      .select()
      .single();
    if (error) {
      if (isDevEnvironment) {
        showNotifications(error.message);
      } else {
        showNotifications("Something went wrong, try again!");
      }
      setIsLoading(false);
      return;
    }
    setIsLoading(false);
    showNotifications(null, "created");
    setOptions((prev) =>
      prev ? [...prev, createOption(data!)] : [createOption(data!)]
    );
    setValue(createOption(data!));
  };
  const handleDelete = async () => {
    setError(null);
    setIsLoading(true);

    const { data, error } = await supabsae
      .from("syll_school")
      .delete()

      .eq("id", value?.value!);
    if (error) {
      ShowErrorNotification(error);
      setIsLoading(false);
      return;
    }
    setOptions((prev) => prev?.filter((item) => item.value !== value?.value));
    setValue(null);
    setIsLoading(false);
    showNotifications(null, "deleted");
  };
  const handleChange = (newValue: Option | null) => {
    setValue(newValue);
    action(Number(newValue?.value));
  };
  const isDisabled = isLoading || value === null || value === undefined;

  return (
    <div className=" flex items-center justify-center">
      {error && <div className="text-error">{error}</div>}
      <div className="flex-1">
        <CreatableSelect
          placeholder="Select school/board..."
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


