"use client";
import { wait } from "@/utils/helper";
import { createClient } from "@/utils/supabase/client";
import { Database } from "@/utils/supabase/supatype";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { MdDelete } from "react-icons/md";
import CreatableSelect from "react-select/creatable";
import { DeleteForm } from "../DeleteForm";
import { School } from "./School";
import { ActionIcon } from "@mantine/core";
import { DeleteAction } from "@/components/DeleteAction";
import { showNotifications } from "@/components/Notification";
interface Option1 {
  class_name: string;
  id: number;
  school_id: number;
}
type data = Database["public"]["Tables"]["syll_school"]["Row"];
interface Option {
  readonly label: string;
  readonly value: string;
}

const createOption = (x: Option1) => ({
  label: x.class_name,
  value: x.id.toString(),
});

// const defaultOptions = [createOption({ id: 5, school_name: "City" })];

export const Class = ({
  action,
  schoolId,
}: {
  action: (id: number) => void;
  schoolId: number | undefined;
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

      const { data: _class, error } = await supabase
        .from("syll_class")
        .select(`*`)
        .eq("school_id", schoolId!);
      if (error) {
        setError(error.message);
        setIsLoading(false);
        return;
      }
      setOptions(_class?.map((x) => createOption(x)));
      setIsLoading(false);
    };
    if (schoolId) {
      getSchool();
    }
  }, [schoolId]);

  const handleChange = (newValue: Option | null) => {
    setValue(newValue);
    action(Number(newValue?.value));
  };

  const call = async (inputValue: string) => {
    setError(null);
    setIsLoading(true);
    const { data, error } = await supabsae
      .from("syll_class")
      .insert([{ class_name: inputValue, school_id: schoolId! }])
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
  const handleCreate = (inputValue: string) => {
    call(inputValue);
  };
  const handleDelete = async () => {
    setError(null);
    setIsLoading(true);

    const { data, error } = await supabsae
      .from("syll_class")
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
          placeholder="Select Class..."
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
