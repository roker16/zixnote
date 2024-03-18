"use client";
import { deleteItem } from "@/app/action";
import { ActionIcon, Button, Center } from "@mantine/core";
import { IconTrashX } from "@tabler/icons-react";
import { useFormStatus } from "react-dom";

export const DeleteForm = ({
  id,
  tableName,
  idColumnName,
  revalidatePathName,
  isIconButton,
}: {
  id: number;
  tableName: string;
  idColumnName: string;
  revalidatePathName: string;
  isIconButton?: boolean;
}) => {
  return (
    <form action={deleteItem}>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="tableName" value={tableName} />
      <input type="hidden" name="idColumnName" value={idColumnName} />
      <input
        type="hidden"
        name="revalidatePathName"
        value={revalidatePathName}
      />
      {isIconButton ? (
        <DeleteButton isIconButton={isIconButton} />
      ) : (
        <DeleteButton />
      )}
    </form>
  );
};
const DeleteButton = ({ isIconButton }: { isIconButton?: boolean }) => {
  const { pending } = useFormStatus();

  return (
    <Center>
      {!isIconButton ? (
        <Button disabled={pending} loading={pending} type="submit">
          Delete
        </Button>
      ) : (
        <ActionIcon
          size={"sm"}
          // disabled={pending}
          style={{
            cursor: "pointer",
          }}
          loading={pending}
          type="submit"
          radius={"lg"}
          variant={"light"}
          aria-label="ActionIcon with size as a number"
        >
          <IconTrashX  size={"16px"} />
        </ActionIcon>
      )}
    </Center>
  );
};
