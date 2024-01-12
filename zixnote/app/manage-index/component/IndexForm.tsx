"use client";

import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Database } from "@/utils/supabase/supatype";

export const myFormSchema = z.object({
  indexName: z
    .string()
    .max(50, { message: "50 character max." })
    .min(3, { message: "3 character min." }),
  sequence: z.coerce
    .number() // Force it to be a number
    .int() // Make sure it's an integer
    .gte(1, { message: "between 1-400" }) // Greater than or equal to the smallest 5 digit int
    .lte(400, { message: "between 1-400" }), // Less than or equal to the largest 5 digit int
});

export type MyFormFields = z.infer<typeof myFormSchema>;
type index = Database["public"]["Tables"]["syll_index"]["Row"];
export default function IndexForm({
  data,
  action,
}: {
  data: index | null;
  action: "edit" | "create";
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<MyFormFields>({
    resolver: zodResolver(myFormSchema),
    defaultValues: {
      indexName: action === "create" ? "" : data?.index_name,
      sequence: action === "create" ? undefined : data?.sequence!,
    },
  });
  const onSubmit: SubmitHandler<MyFormFields> = (data) => console.log(data);
  return (
    <form className="join items-baseline" onSubmit={handleSubmit(onSubmit)}>
      <div>
        <input
          {...register("indexName")}
          type="text"
          max={30}
          min={3}
          placeholder="Index name"
          className="input join-item input-bordered input-xs w-full max-w-xs"
        />
        {errors.indexName && (
          <div className="text-xs text-error">{errors.indexName.message}</div>
        )}
      </div>
      <div>
        <input
          {...register("sequence")}
          type="number"
          placeholder="Sequence"
          className="input join-item input-bordered input-xs w-24"
        />
        {errors.sequence && (
          <div className="text-xs text-error">{errors.sequence.message}</div>
        )}
      </div>
      <button className="btn btn-xs joint-item rounded-r-full">Add</button>
    </form>
  );
}
