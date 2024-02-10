"use client";
import { wait } from "@/utils/helper";
import { createClient } from "@/utils/supabase/client";
import { Database } from "@/utils/supabase/supatype";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { MdDelete } from "react-icons/md";
import CreatableSelect from "react-select/creatable";
import { DeleteForm } from "../DeleteForm";
import { notifications } from "@mantine/notifications";

import { IconX } from "@tabler/icons-react";
import { ActionIcon, Button } from "@mantine/core";
import { PostgrestError } from "@supabase/supabase-js";
import { showNotifications } from "@/components/Notification";
import { DeleteAction } from "@/components/DeleteAction";
interface Option1 {
  id: number;
  school_name: string;
}
type data = Database["public"]["Tables"]["syll_school"]["Row"];
interface Option {
  readonly label: string;
  readonly value: string;
}

const createOption = (x: Option1) => ({
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

  const call = async (inputValue: string) => {
    setError(null);
    setIsLoading(true);

    const { data, error } = await supabsae
      .from("syll_school")
      .insert([{ school_name: inputValue }])
      .select()
      .single();
    if (error) {
      showNotifications(error);
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
  const handleCreate = (inputValue: string) => {
    call(inputValue);
  };
  const handleDelete = async () => {
    setError(null);
    setIsLoading(true);

    const { data, error } = await supabsae
      .from("syll_school")
      .delete()

      .eq("id", value?.value!);
    if (error) {
      showNotifications(error);
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


