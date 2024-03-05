"use client";
import { showNotifications } from "@/components/Notification";
import { isDevEnvironment } from "@/utils/helper";
import { PostgrestError } from "@supabase/supabase-js";

export function showErrorNotification(error: PostgrestError | null) {
  if (isDevEnvironment) {
    showNotifications((error?.message)!);
  } else {
    error?.code === "23503"
      ? showNotifications("Can't delete, this is being used somewhere else. Delete all references first!")
      : showNotifications("Something went wrong, try again!");
  }
}
