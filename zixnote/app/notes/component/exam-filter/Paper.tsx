"use client";
import { DeleteAction } from "@/components/DeleteAction";
import { showNotifications } from "@/components/Notification";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import CreatableSelect from "react-select/creatable";
import { showErrorNotification } from "../../../../components/showErrorNotification";
interface InputData {
  exam_id: number;
  id: number;
  name: string;
}
interface Option {
  readonly label: string;
  readonly value: string;
}

const createOption = (x: InputData) => ({
  label: x.name,
  value: x.id.toString(),
});

export const Paper = ({
  action,
  schoolId,
  canModerate,
}: {
  action: (id: number) => void;
  schoolId: number | undefined;
  canModerate: boolean;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [options, setOptions] = useState<Option[] | undefined>(undefined);
  const [value, setValue] = useState<Option | null>();
  const supabase = createClient();
  useEffect(() => {
    setValue(null);
    const getSchool = async () => {
      setIsLoading(true);
      const { data: _class, error } = await supabase
        .from("syll_paper")
        .select(`*`)
        .eq("exam_id", schoolId!);
      if (error) {
        showErrorNotification(error);
        setIsLoading(false);
        return;
      }
      setOptions(_class?.map((x) => createOption(x)));
      setIsLoading(false);
    };
    if (schoolId) {
      getSchool();
    }
  }, [schoolId, supabase]);

  const handleChange = (newValue: Option | null) => {
    setValue(newValue);
    action(Number(newValue?.value));
  };

  const handleCreate = async (inputValue: string) => {
    if (!canModerate) {
      showNotifications("You don't have required Permission");
      return;
    }
    if (!schoolId) {
      showNotifications("No school selected");
      return;
    }
    setIsLoading(true);
    const { data, error } = await supabase
      .from("syll_paper")
      .insert({ "name": inputValue, exam_id: schoolId })
      .select()
      .single();
    if (error) {
      showErrorNotification(error);
      setIsLoading(false);
      return;
    }
    showNotifications(null, "created");
    setIsLoading(false);
    setOptions((prev) =>
      prev ? [...prev, createOption(data)] : [createOption(data)]
    );
    setValue(createOption(data!));
  };
  const handleDelete = async () => {
    setIsLoading(true);
    const { error } = await supabase
      .from("syll_class")
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
    <div className=" flex items-center gap-1 ">
      <div className="md:w-60 flex-1">
        <CreatableSelect
          placeholder="Select paper..."
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
