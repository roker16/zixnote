import { notifications } from "@mantine/notifications";
import { PostgrestError } from "@supabase/supabase-js";
import { IconX } from "@tabler/icons-react";

export function showNotifications(error: PostgrestError | null) {
  notifications.show({
    title: error?"Something went wrong":"Success",
    message: error ? error?.message : "Executated successfully",
    // color: "blue",
    icon: error && <IconX />,
  });
}
