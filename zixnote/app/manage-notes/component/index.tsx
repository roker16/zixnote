"use client";

import { ActionIcon, Box, useMantineTheme } from "@mantine/core";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState, useTransition } from "react";
import { MdExpandMore, MdSunny } from "react-icons/md";
// import { handleTransitionNotes } from "../handleTransition1";
import { NestedIndexItem } from "../transformFlatToNested";
import { handleTransitionNotes } from "../handleTransition1";

const NestedIndex = ({ data }: { data: NestedIndexItem[] }) => {
  // This component is only to show/hide chapter topics, because the
  //state *toggledIds* can not be handled properly by child *TableOfContent* because this
  // is a recursive component
  const [toggledIds, setToggledIds] = useState<(number | null)[]>([2222222]);

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

interface TableOfContentProps {
  topLevelIndexItem?: NestedIndexItem;
  data: NestedIndexItem[];
  toggledIds: (number | null)[];
  handleToggle: (index_id: number) => void;
}

const TableOfContent: React.FC<TableOfContentProps> = ({
  topLevelIndexItem: topLevelIndex = null,
  data,
  toggledIds,
  handleToggle,
}) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const theme = useMantineTheme();
  const searchParams = useSearchParams();
  const selectedTopic = searchParams.get("headingid");
  const handleUpdateParams = (id: number, heading: string) => {
    handleTransitionNotes(id.toString(), heading, startTransition, router);
  };
  return (
    <ul className={`py-1 list-none ${topLevelIndex ? "pl-6" : "pl-0"}`}>
      {data.map((item) => (
        <li key={item.index_id}>
          <div className="flex items-center group">
            <Box
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();

                // If top-level but has children => toggle
                // Else behave like inner child (navigate)
                if (item.parent_index_id === null && item.children?.length) {
                  handleToggle(item.index_id);
                } else {
                  handleUpdateParams(item.index_id, item.index_name);
                }
              }}
              className={`cursor-pointer flex flex-nowrap opacity-80 py-0.5 px-2 ${
                item.parent_index_id === null
                  ? "font-normal text-sm opacity-70 "
                  : " group-hover:opacity-100 group-hover:bg-slate-200 group-hover:rounded-sm text-sm opacity-60 py-1"
              }`}
            >
              <span>
                {item.parent_index_id === null && (
                  <ActionIcon variant="subtle" size="sm" radius="lg">
                    {item.children?.length ? (
                      !toggledIds.includes(item.index_id) ? (
                        <MdExpandMore size={16} />
                      ) : (
                        <MdSunny />
                      )
                    ) : (
                      <span className="text-xs">
                        <span>◾</span>
                      </span> // You can replace this with any icon
                    )}
                  </ActionIcon>
                )}
              </span>

              <div
                className={`${
                  item.index_id === Number(selectedTopic)
                    ? `text-pink-700 font-semibold "`
                    : ""
                }`}
              >
                {item.index_name}
              </div>
            </Box>
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
              />
            )}
        </li>
      ))}
    </ul>
  );
};
