import React, { Dispatch, SetStateAction } from "react";
import { ActionProps } from "../page";
import { Database } from "@/utils/supabase/supatype";
import { IoAdd } from "react-icons/io5";
import { CiEdit } from "react-icons/ci";
import { MdDeleteOutline } from "react-icons/md";
function ActionButtons({
//   data,
//   action,
// }: {
  // data: Database["public"]["Tables"]["syll_index"]["Row"];
  // action: Dispatch<SetStateAction<ActionProps | undefined>>;
}) {
  return (
    <div className="">
      <button
        className="btn join-item btn-circle btn-sm btn-ghost "
        // onClick={() => action({ mode: "create", data: data })}
      >
        <IoAdd />
      </button>
      <button className="btn join-item btn-circle btn-sm btn-ghost">
        <CiEdit />
      </button>
      <button className="btn join-item btn-circle btn-sm btn-ghost">
        <MdDeleteOutline />
      </button>
    </div>
  );
}

export default ActionButtons;
