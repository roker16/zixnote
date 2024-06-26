"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";

const schema = z.object({
  index: z.string().max(100, { message: "100 char" }),
  order: z.string().min(1, { message: "1 char" }),
});

export async function editIndex(formData: FormData) {
  console.log("form data is ", formData);
  const validatedFields = schema.safeParse({
    index: formData.get("index"),
    order: formData.get("order"),
  });
  // await wait(5000);
  // Return early if the form data is invalid
  if (!validatedFields.success) {
    console.log("hi...", validatedFields.error.flatten().fieldErrors);
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }
  const supabase = createClient(cookies());
  const { error } = await supabase
    .from("syll_index")
    .update({
      index_name: formData.get("index")?.toString()!,
      sequence: Number(formData.get("order")),
    })
    .eq("index_id", Number(formData.get("id")));
  if (error) {
    console.log(error.message);
  }
  revalidatePath("/manage-index");
}
export async function createIndex(formData: FormData) {
  const validatedFields = schema.safeParse({
    index: formData.get("index"),
    order: formData.get("order"),
  });
  // await wait(5000);
  // Return early if the form data is invalid
  if (!validatedFields.success) {
    console.log("hi...", validatedFields.error.flatten().fieldErrors);
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }
  const supabase = createClient(cookies());
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
    console.log(error.message);
  }
  revalidatePath("/manage-index");
}

export async function deleteItem(formData: FormData) {
  const id = formData.get("id");
  const tableName = formData.get("tableName");
  const idColumnName = formData.get("idColumnName");
  const revalidatePathName = formData.get("revalidatePathName");
  // await wait(5000);

  const supabase = createClient(cookies());
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
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  await supabase.auth.signOut();
  return redirect("/");
}
export async function navigateWithLogin(data: FormData) {
  const supabase = createClient(cookies());
  const { user } = (await supabase.auth.getUser()).data;
  if (user) {
    redirect(`/manage-notes`);
  }
  redirect(`/login`);
}
