"use client";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import CreatableSelect from "react-select/creatable";

import { showNotifications } from "@/components/Notification";
import { showErrorNotification } from "../../../../components/showErrorNotification";

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

export const School = ({
  action,
  canModerate,
}: {
  action: (id: number, name: string) => void;
  canModerate: boolean;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [options, setOptions] = useState<Option[] | undefined>(undefined);
  const [value, setValue] = useState<Option | null>();
  const supabase = createClient();
  useEffect(() => {
    const getSchool = async () => {
      setIsLoading(true);
      const { data: school, error } = await supabase
        .from("syll_school")
        .select(`*`);
      if (error) {
        showErrorNotification(error);
        setIsLoading(false);
        return;
      }
      setOptions(school?.map((x) => createOption(x)));
      setIsLoading(false);
    };
    getSchool();
  }, [supabase]);

  const handleCreate = async (inputValue: string) => {
    if (!canModerate) {
      showNotifications("You don't have required Permission");
      return;
    }
    setIsLoading(true);

    const { data, error } = await supabase
      .from("syll_school")
      .insert([{ school_name: inputValue }])
      .select()
      .single();
    if (error) {
      showErrorNotification(error);
      setIsLoading(false);
      return;
    }
    setIsLoading(false);
    showNotifications(null, "created");
    setOptions((prev) =>
      prev ? [...prev, createOption(data)] : [createOption(data)]
    );
    setValue(createOption(data));
  };

  const handleChange = (newValue: Option | null) => {
    setValue(newValue);
    action(Number(newValue?.value), newValue?.label!);
  };

  return (
    <div className=" flex items-center gap-1 ">
      <div className="md:w-60 flex-1">
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
    </div>
  );
};
