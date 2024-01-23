"use server";

import { wait } from "@/utils/helper";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { z } from "zod";

const schema = z.object({
  index: z.string().min(100, { message: "100 char" }),
  order: z.string().min(1, { message: "1 char" }),
});

export async function editIndex( formData: FormData) {
 
  const validatedFields = schema.safeParse({
    index: formData.get("index1"),
    order: formData.get("order1"),
  });
  await wait(5000);
  // Return early if the form data is invalid
  if (!validatedFields.success) {
    console.log("hi...",validatedFields.error.flatten().fieldErrors);
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }
  const supabase = createClient(cookies());
  const { error } = await supabase.from("syll_index").update(
    {
      index_name: formData.get("index1")?.toString()!,
      sequence: Number(formData.get("order1")),
    },
  ).eq("index_id",Number(formData.get("id1")));
  if (error) {
    console.log(error.message);
  }
  revalidatePath("/manage-index");
}

export async function deleteItem( formData: FormData) {
  const id = formData.get("id");
  const tableName = formData.get("tableName");

  // await wait(5000);

  const supabase = createClient(cookies());
  const { error } = await supabase
    .from(`${tableName}`)
    .delete()
    .eq("index_id", id);
  if (error) {
    console.log(error.message)
    throw new Error('Failed to create task')

  }
  revalidatePath("/manage-index");
  // return
}
