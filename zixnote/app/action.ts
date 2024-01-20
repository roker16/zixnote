"use server";

import { wait } from "@/utils/helper";
import { z } from "zod";

const schema = z.object({
  email: z
    .string({
      invalid_type_error: "Invalid Email",
    })
    .min(5, { message: "5 char" }),
});

export default async function createUser(prevState: any, formData: FormData) {
  const email1 = JSON.stringify(formData.get("email"));
  const validatedFields = schema.safeParse({
    email: formData.get("email"),
  });
  await wait(5000);
  // Return early if the form data is invalid
  if (!validatedFields.success) {
    return {
      message: formData.get("email")?.toString()!,
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  // Mutate data
}
