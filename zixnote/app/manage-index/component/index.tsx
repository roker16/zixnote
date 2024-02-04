"use client";
import { NestedIndexItem } from "@/utils/transformFlatToNested";
import React, { useState } from "react";
import { Text } from '@mantine/core';

import { MdExpandMore, MdSunny } from "react-icons/md";
import ActionButtons from "./ActionButtons";

interface TableOfContentProps {
  topLevelIndexItem?: NestedIndexItem;
  data: NestedIndexItem[];
  indent?: number;
  toggledIds: (number | null)[];
  handleToggle: (index_id: number) => void;
}

const TableOfContent: React.FC<TableOfContentProps> = ({
  topLevelIndexItem: topLevelIndex = null,
  data,
  indent = 0,
  toggledIds,
  handleToggle,
}) => {
  const paddingLeft = indent * 2;

  return (
    <ul className=" flex flex-col items-start text-left gap-2">
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
                  : " group-hover:text-blue-400 text-sm "
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
            {/* <div className="invisible items-center group-hover:visible">
              <ActionButtons data={item} />
            </div> */}
          </div>

          {item.children &&
            toggledIds.includes(
              topLevelIndex ? topLevelIndex.index_id : item.index_id
            ) && (
              <TableOfContent
                data={item.children}
                indent={indent + (item.parent_index_id === null ? 8 : -2)}
                topLevelIndexItem={topLevelIndex ? topLevelIndex : item}
                toggledIds={toggledIds}
                handleToggle={handleToggle}
              />
            )}
        </li>
      ))}
    </ul>
  );
};

const NestedIndex = ({ data }: { data: NestedIndexItem[] }) => {
  const [toggledIds, setToggledIds] = useState<(number | null)[]>([]);

  const handleToggle = (index_id: number) => {
    const updatedIds = toggledIds.includes(index_id)
      ? toggledIds.filter((id) => id !== index_id)
      : [...toggledIds, index_id];
    setToggledIds(updatedIds);
  };

  return (
    <div>
      <TableOfContent
        data={data}
        toggledIds={toggledIds}
        handleToggle={handleToggle}
      />
    </div>
  );
};

export default NestedIndex;
