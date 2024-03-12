"use client";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import CreatableSelect from "react-select/creatable";

import { DeleteAction } from "@/components/DeleteAction";
import { showNotifications } from "@/components/Notification";
import { showErrorNotification } from "../../../../components/showErrorNotification";
import { Database, Tables } from "@/utils/supabase/supatype";

interface InputData {
  id: number;
  school_name: string;
}

interface Option {
  readonly label: string;
  readonly value: string;
}

type TableNames = keyof Database["public"]["Tables"];

type TablePropertyMappings = {
  [K in TableNames]?: {
    // why we use ? here, to make all tablename optional, remove this and see
    labelProperty: keyof Tables<K>;
    idProperty: keyof Tables<K>;
  };
};

const tablePropertyMappings: TablePropertyMappings = {
  syll_school: {
    labelProperty: "school_name",
    idProperty: "id",
  },
  syll_college: {
    labelProperty: "college_name",
    idProperty: "id",
  },
  syll_exam: {
    labelProperty: "exam_name",
    idProperty: "id",
  },
  // ... add more mappings as needed
};

const createOption = <T extends keyof Database["public"]["Tables"]>(
  tableName: T,
  x: Tables<T>
): { label: string; value: string } => {
  const mapping = tablePropertyMappings[tableName];

  if (!mapping) {
    throw new Error(`Unsupported table: ${tableName}`);
  }

  const { labelProperty, idProperty } = mapping;

  return {
    label: String(x[labelProperty]),
    value: String(x[idProperty]),
  };
};
function getIdPropertyName<T extends TableNames>(
  tableName: T
): keyof Tables<T> {
  const mapping = tablePropertyMappings[tableName];

  if (!mapping) {
    throw new Error(`Unsupported table: ${tableName}`);
  }

  if (!mapping.idProperty) {
    throw new Error(`Table ${tableName} does not have a defined idProperty`);
  }

  return mapping.idProperty;
}

export function FirstCommonFilter<T extends TableNames>({
  action,
  canModerate,
  tableName,
}: {
  action: (id: number) => void;
  canModerate: boolean;
  tableName: T;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [options, setOptions] = useState<Option[] | undefined>(undefined);
  const [value, setValue] = useState<Option | null>();
  const supabase = createClient();
  useEffect(() => {
    const getSchool = async () => {
      setIsLoading(true);
      const { data: school, error } = await supabase
        .from(tableName)
        .select(`*`);
      if (error) {
        showErrorNotification(error);
        setIsLoading(false);
        return;
      }
      setOptions(school?.map((x) => createOption(tableName, x as any)));
      setIsLoading(false);
    };
    getSchool();
  }, [supabase, tableName]);

  const handleCreate = async (inputValue: string) => {
    if (!canModerate) {
      showNotifications("You don't have required Permission");
      return;
    }

    setIsLoading(true);

    // Determine the appropriate insert object based on tableName
    const insertData = getInsertData(tableName, inputValue);

    const { data, error } = await supabase
      .from(tableName)
      .insert(insertData as any)
      .select()
      .single();

    if (error) {
      showErrorNotification(error);
      setIsLoading(false);
      return;
    }

    setIsLoading(false);
    showNotifications(null, "created");

    // Assuming you want to update options or a value in your component
    setOptions((prev) =>
      prev
        ? [...prev, createOption(tableName, data as any)]
        : [createOption(tableName, data as any)]
    );
    // setValue(createOption(tableName, data)); // If you're updating a value
  };

  // Helper function to get the correct insert object
  type InsertData<T extends TableNames> =
    Database["public"]["Tables"][T]["Insert"];
  function getInsertData<T extends TableNames>(
    tableName: T,
    inputValue: string
  ): InsertData<T> {
    switch (tableName) {
      case "syll_school":
        return {
          school_name: inputValue,
        } as InsertData<"syll_school">;
      case "syll_college":
        return {
          college_name: inputValue,
        } as InsertData<"syll_college">;
      case "syll_exam":
        return {
          exam_name: inputValue,
        } as InsertData<"syll_exam">;
      default:
        throw new Error(`Unsupported table: ${tableName}`);
    }
  }

  // // Helper function to get the correct insert object, same as above see what u want to use.
  // type InsertData<T extends TableNames> =
  //   Database["public"]["Tables"][T]["Insert"];
  //   function getInsertData<T extends TableNames>(
  //     tableName: T,
  //     inputValue: string
  //   ): InsertData<T> {
  //     const mapping = tablePropertyMappings[tableName];

  //     if (!mapping || !mapping.labelProperty) {
  //       throw new Error(`Table ${tableName} is not supported or missing idProperty`);
  //     }

  //     return { [mapping.labelProperty]: inputValue} as InsertData<T>;
  //   }

  const handleDelete = async () => {
    const k = getIdPropertyName(tableName);
    setIsLoading(true);

    const { error } = await supabase
      .from(tableName)
      .delete()
      .eq(k.toString(), value?.value!);
    if (error) {
      showErrorNotification(error);
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

  const placeholderMapping: { [K in TableNames]?: string } = {
    syll_school: "Select school/board...",
    syll_college: "Select College/University...",
    syll_exam: "Select exam",
  };

  const placeholder = placeholderMapping[tableName];
  return (
    <div className=" flex items-center justify-center">
      <div className="flex-1">
        <CreatableSelect
          placeholder={placeholder}
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
      {canModerate && DeleteAction(isLoading, isDisabled, handleDelete)}
    </div>
  );
}
