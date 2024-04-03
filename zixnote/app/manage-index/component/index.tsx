"use client";
import { NestedIndexItem } from "@/app/manage-index/transformFlatToNested";
import { ActionIcon, Box } from "@mantine/core";
import React, { useState } from "react";
import { MdExpandMore, MdSunny } from "react-icons/md";
import ActionButtons from "./ActionButtons";

const NestedIndex = ({
  data,
  canModerate,
}: {
  data: NestedIndexItem[];
  canModerate: boolean;
}) => {
  // This component is only to show/hide chapter topics, because the
  //state *toggledIds* can not be handled properly by child *TableOfContent* because this
  // is a recursive component
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
        canModerate={canModerate}
      />
    </div>
  );
};

export default NestedIndex;

interface TableOfContentProps {
  topLevelIndexItem?: NestedIndexItem;
  data: NestedIndexItem[];
  toggledIds: (number | null)[];
  handleToggle: (index_id: number) => void;
  canModerate: boolean;
}

const TableOfContent: React.FC<TableOfContentProps> = ({
  topLevelIndexItem: topLevelIndex = null,
  data,
  toggledIds,
  handleToggle,
  canModerate,
}) => {
  return (
    <ul className={`py-1 list-none ${topLevelIndex ? "pl-6" : "pl-0"}`}>
      {data.map((item) => (
        <li key={item.index_id}>
          <div className="flex items-center group">
            <Box
              onClick={
                item.parent_index_id === null
                  ? () => handleToggle(item.index_id)
                  : undefined
              }
              className={`cursor-pointer flex flex-nowrap opacity-80 py-0.5 px-2 ${
                item.parent_index_id === null
                  ? "font-medium text-sm "
                  : " group-hover:opacity-100 group-hover:bg-gray-200 group-hover:rounded-xl text-sm "
              }`}
            >
              <span>
                {item.parent_index_id == null && (
                  <ActionIcon variant="subtle" size="sm" radius="lg">
                    {!toggledIds.includes(item.index_id) ? (
                      <MdExpandMore size={16} />
                    ) : (
                      <MdSunny />
                    )}
                  </ActionIcon>
                )}
              </span>

              <div>{item.index_name}</div>
            </Box>
            {canModerate &&
              item.category_id &&
              (item.category_id < 4) && (
                <div className="invisible group-hover:visible px-1 ">
                  <ActionButtons data={item} />
                </div>
              )}
          </div>

          {item.children &&
            toggledIds.includes(
              topLevelIndex ? topLevelIndex.index_id : item.index_id
            ) && (
              <TableOfContent
                data={item.children}
                topLevelIndexItem={topLevelIndex ? topLevelIndex : item}
                toggledIds={toggledIds}
                handleToggle={handleToggle}
                canModerate={canModerate}
              />
            )}
        </li>
      ))}
    </ul>
  );
};
