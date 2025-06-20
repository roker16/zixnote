"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const schema = z.object({
  index: z.string().max(100, { message: "100 char" }),
  order: z.string().min(1, { message: "1 char" }),
});

export async function editIndex(formData: FormData): Promise<void> {
  console.log("form data is ", formData);

  // Validate form data
  const validatedFields = schema.safeParse({
    index: formData.get("index"),
    order: formData.get("order"),
  });

  // If validation fails, throw an error
  if (!validatedFields.success) {
    const errors = validatedFields.error.flatten().fieldErrors;
    console.log("Validation errors:", errors);
    throw new Error(
      JSON.stringify({
        errors: errors,
        message: "Form validation failed",
      })
    );
  }

  // Proceed with database update
  const supabase = await createClient();
  const { error } = await supabase
    .from("syll_index")
    .update({
      index_name: validatedFields.data.index,
      sequence: Number(validatedFields.data.order),
    })
    .eq("index_id", Number(formData.get("id")));

  if (error) {
    console.log("Supabase error:", error.message);
    throw new Error("Failed to update index: " + error.message);
  }

  // Revalidate the path after successful update
  revalidatePath("/manage-index");
}
export async function createIndex(formData: FormData) {
  const validatedFields = schema.safeParse({
    index: formData.get("index"),
    order: formData.get("order"),
  });

  if (!validatedFields.success) {
    // Instead of returning errors, you can throw an error or redirect
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
      parent_index_id:
        formData.get("parentId") !== ""
          ? Number(formData.get("parentId"))
          : null,
      category_id:
        formData.get("parentCategoryId") !== ""
          ? Number(formData.get("parentCategoryId"))
          : 1,
    },
  ]);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/manage-index");
  // redirect("/manage-index"); // Redirect after successful submission
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
