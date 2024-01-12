import React, { Dispatch, SetStateAction } from "react";
import { ActionProps } from "../page";
import { Database } from "@/utils/supabase/supatype";

function ActionButtons({
  data,
  action,
}: {
  data: Database["public"]["Tables"]["syll_index"]["Row"];
  action: Dispatch<SetStateAction<ActionProps | undefined>>;
}) {
  return (
    <div className="join join-vertical lg:join-horizontal">
      <button
        className="btn join-item"
        onClick={() => action({ mode: "create", data: data })}
      >
        +
      </button>
      <button className="btn join-item">-</button>
      <button className="btn join-item">Edit</button>
    </div>
  );
}

export default ActionButtons;
