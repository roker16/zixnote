"use client";
import { NestedIndexItem } from "@/utils/transformFlatToNested";
import React, { useState } from "react";
import { MdExpandMore, MdSunny } from "react-icons/md";
import ActionButtons, { ActionType } from "./ActionButtons";
import { ElementTypeOfGetIndex } from "../page";


interface TableOfContentProps {
  topLevelIndexItem?: NestedIndexItem;
  data: NestedIndexItem[];
  indent?: number;
  toggledIds: (number | null)[];
  handleToggle: (index_id: number) => void;
  handleAction: (action: ActionType, data?: ElementTypeOfGetIndex) => void;
}

const TableOfContent: React.FC<TableOfContentProps> = ({
  topLevelIndexItem: topLevelIndex = null,
  data,
  indent = 0,
  toggledIds,
  handleToggle,
  handleAction,
}) => {
  const paddingLeft = indent * 2;

  return (
    <ul className=" flex flex-col items-start bg-base-300 text-left ">
      {data.map((item) => (
        <li key={item.index_id} style={{ paddingLeft: `${paddingLeft}px` }}>
          <div className="flex items-center group">
            <div
              onClick={
                item.parent_index_id === null
                  ? () => handleToggle(item.index_id)
                  : undefined
              }
              className={`flex cursor-pointer  ${
                item.parent_index_id === null
                  ? "text-secondary font-medium italic"
                  : "opacity-70 group-hover:opacity-100 "
              }`}
            >
              <div className="flex flex-row flex-nowrap items-center">
                <span>
                  {item.parent_index_id == null && (
                    <button className="btn btn-circle btn-sm btn-ghost">
                      {!toggledIds.includes(item.index_id) ? (
                        <MdExpandMore size={16} />
                      ) : (
                        <MdSunny />
                      )}
                    </button>
                  )}
                </span>

                <div>{item.index_name}</div>
              </div>
            </div>
            <div className="invisible items-center group-hover:visible">
              <ActionButtons onClickButton={handleAction} data={item} />
            </div>
          </div>

          {item.children &&
            toggledIds.includes(
              topLevelIndex ? topLevelIndex.index_id : item.index_id
            ) && (
              <TableOfContent
                data={item.children}
                indent={indent + (item.parent_index_id === null ? 16 : -4)}
                topLevelIndexItem={topLevelIndex ? topLevelIndex : item}
                toggledIds={toggledIds}
                handleToggle={handleToggle}
                handleAction={handleAction}
              />
            )}
        </li>
      ))}
    </ul>
  );
};

const NestedIndex = ({ data }: { data: NestedIndexItem[] }) => {
  const [toggledIds, setToggledIds] = useState<(number | null)[]>([]);
  const [actionType, setActionType] = useState<{
    action: ActionType;
    data?: ElementTypeOfGetIndex;
  }>();
  const handleToggle = (index_id: number) => {
    const updatedIds = toggledIds.includes(index_id)
      ? toggledIds.filter((id) => id !== index_id)
      : [...toggledIds, index_id];
    setToggledIds(updatedIds);
  };
  const handleAction = (action: ActionType, data?: ElementTypeOfGetIndex) => {
    setActionType({ action, data });
  };
  return (
    <div>
      <TableOfContent
        data={data}
        toggledIds={toggledIds}
        handleToggle={handleToggle}
        handleAction={handleAction}
      />
      
     
    </div>
  );
};

export default NestedIndex;
