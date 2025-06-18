"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";

const schema = z.object({
  index: z
    .string()
    .min(1, { message: "Index is required" })
    .max(100, { message: "Index must be 100 characters or less" }),
  order: z.string().regex(/^\d+$/, { message: "Order must be a valid number" }),
});

export async function createIndex(formData: FormData): Promise<void> {
  const validatedFields = schema.safeParse({
    index: formData.get("index"),
    order: formData.get("order"),
  });

  if (!validatedFields.success) {
    throw new Error(
      JSON.stringify(validatedFields.error.flatten().fieldErrors)
    );
  }

  const supabase = await createClient();
  const { error } = await supabase.from("syll_index").insert([
    {
      index_name: formData.get("index")?.toString()!,
      sequence: Number(formData.get("order")),
      syllabus_id: Number(formData.get("syllabusId")),
      parent_index_id: formData.get("parentId")?.toString()
        ? Number(formData.get("parentId"))
        : null,
      category_id: formData.get("parentCategoryId")?.toString()
        ? Number(formData.get("parentCategoryId"))
        : 1,
    },
  ]);

  if (error) {
    throw new Error(`Supabase error: ${error.message}`);
  }

  revalidatePath("/manage-index");
  redirect("/manage-index");
}

// Update editIndex similarly
export async function editIndex(formData: FormData): Promise<void> {
  const validatedFields = schema.safeParse({
    index: formData.get("index"),
    order: formData.get("order"),
  });

  if (!validatedFields.success) {
    throw new Error(
      JSON.stringify(validatedFields.error.flatten().fieldErrors)
    );
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("syll_index")
    .update({
      index_name: formData.get("index")?.toString()!,
      sequence: Number(formData.get("order")),
    })
    .eq("index_id", Number(formData.get("id")));

  if (error) {
    throw new Error(`Supabase error: ${error.message}`);
  }

  revalidatePath("/manage-index");
  redirect("/manage-index");
}
export async function deleteItem(formData: FormData) {
  const id = formData.get("id");
  const tableName = formData.get("tableName");
  const idColumnName = formData.get("idColumnName");
  const revalidatePathName = formData.get("revalidatePathName");
  // await wait(5000);

  const supabase = await createClient();
  const { error } = await supabase
    .from(`${tableName as any}` as any)
    .delete()
    .eq(`${idColumnName}`, id);
  if (error) {
    if (error.code === "23503") {
      throw new Error(error.code);
    } else {
      throw new Error(error?.message);
    }
  }
  revalidatePath(`${revalidatePathName}`);
  // return
}
export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect("/");
}
export async function navigateWithLogin(data: FormData) {
  const supabase = await createClient();
  const { user } = (await supabase.auth.getUser()).data;
  if (user) {
    redirect(`/manage-notes`);
  }
  redirect(`/login`);
}
