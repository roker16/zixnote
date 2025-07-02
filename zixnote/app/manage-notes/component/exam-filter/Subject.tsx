"use client";
import { DeleteAction } from "@/components/DeleteAction";
import { showNotifications } from "@/components/Notification";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState, useTransition } from "react";
import CreatableSelect from "react-select/creatable";
import { showErrorNotification } from "../../../../components/showErrorNotification";
import { useRouter } from "next/navigation";
import { handleTransition } from "../../handleTransition";
import { saveActiveContext } from "@/utils/ai/contextStorage";

interface DataInput {
  id: number;
  paper_id: number | null;
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

export const Subject = ({
  examId,
  examName,
  paperName,
  paperId,
  canModerate,
}: {
  examName: string | undefined;
  paperName: string | undefined;
  examId: number | undefined;
  paperId: number | undefined;
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
        .select(`id,paper_id,syllabus_name`)
        .eq("paper_id", paperId!);
      if (error) {
        showErrorNotification(error);
        setIsLoading(false);
        return;
      }
      setOptions(books?.map((x) => createOption(x)));
      setIsLoading(false);
    };
    if (paperId) {
      getSchool();
    }
  }, [paperId, supabase]);

  const handleChange = (newValue: Option | null) => {
    setValue(newValue);

    const current = new URLSearchParams(window.location.search);
    const params = new URLSearchParams(current);

    // Set group explicitly
    params.set("group", "exam");

    // 1. Set parent hierarchy: examId first
    if (examId) {
      params.set("id1", examId.toString());
    } else {
      params.delete("id1");
    }

    // 2. Then paperId
    if (paperId) {
      params.set("id2", paperId.toString());
    } else {
      params.delete("id2");
    }

    // 3. Set main selected item (subject)
    if (newValue?.value) {
      params.set("id", newValue.value);
      params.set("name", newValue.label);
    } else {
      params.delete("id");
      params.delete("name");
    }

    // 4. Remove stale topic reference
    params.delete("headingid");

    // 5. Save readable context for AI
    if (examName && paperName && newValue?.label) {
      saveActiveContext({
        type: "exam",
        examName,
        paperName,
        subjectName: newValue.label,
      });
    }

    startTransition(() => {
      router.replace(`?${params.toString()}`, { scroll: false });
    });
  };

  const handleCreate = async (inputValue: string) => {
    if (!canModerate) {
      showNotifications("You don't have required Permission!");
      return;
    }
    if (!paperId) {
      showNotifications("No class selected");
      return;
    }
    setIsLoading(true);
    const { data, error } = await supabase
      .from("syll_syllabus_entity")
      .insert({ syllabus_name: inputValue, paper_id: paperId, type_id: 3 })
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
          placeholder="Select Subject..."
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
