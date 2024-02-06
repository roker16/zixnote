"use client";
import React from "react";

import { CiEdit } from "react-icons/ci";
import { IoAdd } from "react-icons/io5";
import { MdDeleteOutline } from "react-icons/md";
import { ElementTypeOfGetIndex } from "../page";
import { DeleteForm } from "./DeleteForm";
import EditForm from "./EditForm";
import CreateForm from "./CreateForm";
import { Center, Group } from "@mantine/core";
export type ActionType = "create" | "edit" | "delete"; // Accept string as well

const ActionButtons = ({ data }: { data?: ElementTypeOfGetIndex }) => {
  return (
    <Group justify="center" gap="1px" >
      <CreateForm parentId={data?.index_id} syllabusId={data?.syllabus_id!} />
      <EditForm
        id={data?.index_id!}
        name={data?.index_name!}
        order={data?.sequence!}
      />
      <DeleteForm
        id={data?.index_id!}
        tableName={"syll_index"}
        idColumnName={"index_id"}
        isIconButton={true}
        revalidatePathName={"/manage-index"}
      />
    </Group>
  );
};

export default ActionButtons;
