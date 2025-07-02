"use client";
import { DeleteAction } from "@/components/DeleteAction";
import { showNotifications } from "@/components/Notification";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState, useTransition } from "react";
import CreatableSelect from "react-select/creatable";
import { showErrorNotification } from "../../../../components/showErrorNotification";

import { handleTransitionNotes } from "../../handleTransition1";
import { useRouter } from "next/navigation";
import { handleTransition } from "../../handleTransition";
import { saveActiveContext } from "@/utils/ai/contextStorage";
interface DataInput {
  id: number;
  department_id: number | null;
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

export const Course = ({
  collegeName,
  departmentName,
  departmentId,
  collegeId,
  canModerate,
}: {
  collegeName: string | undefined;
  departmentName: string | undefined;
  departmentId: number | undefined;
  collegeId: number | undefined;
  canModerate: boolean;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [options, setOptions] = useState<Option[] | undefined>(undefined);
  const [value, setValue] = useState<Option | null>();
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const supabase = createClient();
  useEffect(() => {
    setValue(null);
    const getSchool = async () => {
      setIsLoading(true);
      const { data: books, error } = await supabase
        .from("syll_syllabus_entity")
        .select(`id,department_id,syllabus_name`)
        .eq("department_id", departmentId!);
      if (error) {
        showErrorNotification(error);
        setIsLoading(false);
        return;
      }
      setOptions(books?.map((x) => createOption(x)));
      setIsLoading(false);
    };
    if (departmentId) {
      getSchool();
    }
  }, [departmentId, supabase]);

  const handleChange = (newValue: Option | null) => {
    setValue(newValue);

    const current = new URLSearchParams(window.location.search);

    // ✅ Preserve existing `activetab`
    const params = new URLSearchParams(current);

    // ✅ Set group explicitly
    params.set("group", "college");
    if (collegeId) {
      params.set("id2", collegeId.toString()); // college
    }
    // ✅ 1. Set parent hierarchy
    if (departmentId) {
      params.set("id1", departmentId.toString()); // department
    }

    // ✅ 2. Set main selected item (last)
    if (newValue?.value) {
      params.set("id", newValue.value); // course ID
      params.set("name", newValue.label); // course name
    }

    // ❌ 3. Remove stale topic reference
    params.delete("headingid");

    // ✅ 4. Save readable context for AI
    if (collegeName && departmentName && newValue?.label) {
      saveActiveContext({
        type: "college",
        collegeName,
        department: departmentName,
        course: newValue.label,
      });
    }

    // ✅ 5. Push URL with preserved + updated params
    startTransition(() => {
      router.replace(`?${params.toString()}`, { scroll: false });
    });
  };

  const handleCreate = async (inputValue: string) => {
    if (!canModerate) {
      showNotifications("You don't have required Permission!");
      return;
    }
    if (!departmentId) {
      showNotifications("No class selected");
      return;
    }
    setIsLoading(true);
    const { data, error } = await supabase
      .from("syll_syllabus_entity")
      .insert({
        syllabus_name: inputValue,
        department_id: departmentId,
        type_id: 2,
      })
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
    handleChange({ label: data.syllabus_name, value: data.id.toString() });
    showNotifications(null, "created");
  };
  const handleDelete = async () => {
    setIsLoading(true);

    const { error } = await supabase
      .from("syll_syllabus_entity")
      .delete()
      .eq("id", Number(value?.value!));
    if (error) {
      showErrorNotification(error);
      setIsLoading(false);
      return;
    }
    setIsLoading(false);
    setOptions((prev) => prev?.filter((item) => item.value !== value?.value));
    handleChange(null);
    showNotifications(null, "deleted");
  };
  const isDisabled = isLoading || value === null || value === undefined;
  return (
    <div className=" flex items-center gap-1 ">
      <div className="md:w-60 flex-1">
        <CreatableSelect
          placeholder="Select course..."
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
    </div>
  );
};
