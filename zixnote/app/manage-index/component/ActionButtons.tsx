"use client";
import React from "react";

import { CiEdit } from "react-icons/ci";
import { IoAdd } from "react-icons/io5";
import { MdDeleteOutline } from "react-icons/md";
import { ElementTypeOfGetIndex } from "../page";
import { DeleteForm } from "./DeleteForm";
import EditForm from "./EditForm";
export type ActionType = "create" | "edit" | "delete"; // Accept string as well

interface ActionButtonsProps {
  onClickButton: (mode: ActionType, data?: ElementTypeOfGetIndex) => void;
  data?: ElementTypeOfGetIndex; // Data to be passed
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  onClickButton,
  data,
}) => {
  const createButton = (
    <button
      key="create"
      className="btn join-item btn-circle btn-sm btn-ghost"
      onClick={() => onClickButton("create", data)}
    >
      <IoAdd />
    </button>
  );

  const editButton = (
    <button
      key="edit"
      className="btn join-item btn-circle btn-sm btn-ghost"
      onClick={() => onClickButton("edit", data)}
    >
      <CiEdit />
    </button>
  );

  const deleteButton = (
    <form>
      <button
        key="delete"
        className="btn join-item btn-circle btn-sm btn-ghost"
        onClick={() => onClickButton("delete", data)}
      >
        <MdDeleteOutline />
      </button>
    </form>
  );

  return (
    <div className="flex flex-row flex-nowrap items-center">
      {createButton}
      {editButton}
      {deleteButton}
      <DeleteForm
        id={data?.index_id!}
        tableName={"syll_index"}
        isIconButton={false}
      />
      <EditForm id={data?.index_id!} name={data?.index_name!} order={data?.sequence!} />
    </div>
  );
};

export default ActionButtons;
