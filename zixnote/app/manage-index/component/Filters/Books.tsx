"use client";
import { wait } from "@/utils/helper";
import { createClient } from "@/utils/supabase/client";
import { Database } from "@/utils/supabase/supatype";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { MdDelete } from "react-icons/md";
import CreatableSelect from "react-select/creatable";
import { DeleteForm } from "../DeleteForm";
import { School } from "./School";
interface Option1 {
  id: number;
  class_id: number | null;
  syllabus_name: string;
}
type data = Database["public"]["Tables"]["syll_syllabus_entity"]["Row"];
interface Option {
  readonly label: string;
  readonly value: string;
}

const createOption = (x: Option1) => ({
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
    action(Number(newValue?.value),newValue?.label!);
  };

  const call = async (inputValue: string) => {
    setError(null);
    setIsLoading(true);
    // if (inputValue !== "hidd") {
    //   setError("not saved");
    //   setIsLoading(false);
    //   return;
    // }
    const { data, error } = await supabsae
      .from("syll_syllabus_entity")
      .insert([{ syllabus_name: inputValue, class_id: classId!, type_id: 1 }])
      .select()
      .single();

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
      .from("syll_syllabus_entity")
      .delete()

      .eq("id", value?.value!);

    await wait(5000);
    setIsLoading(false);
    setOptions((prev) => prev?.filter((item) => item.value !== value?.value));
    setValue(null);
  };

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
        />
      </div>
      <button
        hidden={value === null || value === undefined}
        disabled={isLoading || value === null || value === undefined}
        className="btn btn-circle btn-sm "
        onClick={() => handleDelete()}
      >
        <MdDelete />
        {/* {isLoading ? "Deleting..." : "Delete"} */}
      </button>
    </div>
  );
};
