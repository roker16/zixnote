import { ActionIcon } from "@mantine/core";
import { MdDelete } from "react-icons/md";

export function DeleteAction(
    loading: boolean,
    isDisabled: boolean,
    handleDelete: () => Promise<void>
  ) {
    return (
      <ActionIcon
        style={{ cursor: "pointer" }}
        variant="subtle"
        radius={"lg"}
        loading={loading}
        disabled={isDisabled}
        onClick={() => handleDelete()}
      >
        <MdDelete />
      </ActionIcon>
    );
  }