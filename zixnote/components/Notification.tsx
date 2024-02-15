import { notifications } from "@mantine/notifications";
import { PostgrestError } from "@supabase/supabase-js";
import {
  IconAlertCircleFilled,
  IconDiscountCheckFilled,
} from "@tabler/icons-react";

export function showNotifications(
  errorMessage: string | null,
  type?: "created" | "deleted" | "updated"
) {
  const titles = {
    created: "Created successfully!",
    deleted: "Deleted successfully",
    updated: "Updated successfully",
  };

  const title = type ? titles[type] : "Something went wrong!";

  notifications.show({
    title,
    message: errorMessage,
    icon: errorMessage ? <IconAlertCircleFilled /> : <IconDiscountCheckFilled />,
    ...(errorMessage && { color: "red" }),
  });
}
