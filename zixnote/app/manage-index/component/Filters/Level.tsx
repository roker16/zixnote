"use client";
import { wait } from "@/utils/helper";
import { createClient } from "@/utils/supabase/client";
import { Database } from "@/utils/supabase/supatype";
import React, { useEffect, useState } from "react";
import { MdDelete } from "react-icons/md";
import CreatableSelect from "react-select/creatable";
import { DeleteForm } from "../DeleteForm";
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

export const Level = ({ data }: { data: data[] }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [options, setOptions] = useState(data.map((x) => createOption(x)));
  const [value, setValue] = useState<Option | null>();
  const [error, setError] = useState<string | null>(null);
  const supabsae = createClient();

  const call = async (inputValue: string) => {
    setError(null);
    setIsLoading(true);
    // if (inputValue !== "hidd") {
    //   setError("not saved");
    //   setIsLoading(false);
    //   return;
    // }
    const { data, error } = await supabsae
      .from("syll_school")
      .insert([{ school_name: inputValue }])
      .select()
      .single();

    setIsLoading(false);
    setOptions((prev) => [...prev, createOption(data!)]);
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
      // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
      .eq("id", value?.value!);

    await wait(5000);
    setIsLoading(false);
    setOptions((prev) => prev.filter((item) => item.value !== value?.value));
    setValue(null);
  };

  return (
    <div className=" flex items-center px-1 gap-1">
      {error && <div className="text-error">{error}</div>}
      <div className="flex-1">
        <CreatableSelect
          placeholder="Select school/board..."
          isClearable
          isDisabled={isLoading}
          isLoading={isLoading}
          onChange={(newValue) => setValue(newValue)}
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
