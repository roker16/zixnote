"use client";
import React from "react";
import { MdDeleteOutline } from "react-icons/md";
import { useFormStatus } from "react-dom";
import { deleteItem } from "@/app/action";

export const DeleteForm = ({
  id,
  tableName,
  isIconButton,
}: {
  id: number;
  tableName: string;
  isIconButton?: boolean;
}) => {
  return (
    <form action={deleteItem}>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="tableName" value={tableName} />
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

  const withIconStyles = "btn btn-sm btn-ghost btn-circle opacity-70";
  const withLabelStyles = "btn btn-sm btn-ghost opacity-70 ";
  const buttonStyles = isIconButton ? withIconStyles : withLabelStyles;

  return (
    <button type="submit" disabled={pending} className={buttonStyles}>
      {pending ? (
        <div className="loading"></div>
      ) : isIconButton ? (
        <MdDeleteOutline />
      ) : (
        "Delete"
      )}
    </button>
  );
};
