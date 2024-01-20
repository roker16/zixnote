"use client";
import { useBoundStore } from "@/store/zustand";
import React, { Dispatch, useState } from "react";
import { MdAdd, MdSunny } from "react-icons/md";
import ActionButtons from "./ActionButtons";

export interface NestedIndexItem {
  category_id: number | null;
  index_id: number;
  index_name: string;
  parent_index_id: number | null;
  sequence: number | null;
  syllabus_id: number;
  syll_syllabus_entity: {
    id: number;
    syllabus_name: string;
  } | null;
  children?: NestedIndexItem[];
}

interface NestedIndexItemProps {
  topLevelIndex?: NestedIndexItem;
  data: NestedIndexItem[];
  level?: number;
  toggledIds: (number | null)[];
  setToggledIds: Dispatch<React.SetStateAction<(number | null)[]>>;
}

const NestedIndexItem: React.FC<NestedIndexItemProps> = ({
  topLevelIndex = null,
  data,
  level = 0,
  toggledIds,
  setToggledIds,
}) => {
  const paddingLeft = level * 2;
  const handleToggle = (index_id: number) => {
    const updatedIds = toggledIds.includes(index_id)
      ? toggledIds.filter((id) => id !== index_id)
      : [...toggledIds, index_id];
    setToggledIds(updatedIds);
  };

  return (
    <div>
      <ul className="flex flex-col items-start  p-0 gap-y-0 bg-base-100 text-left rounded-md ">
        {data.map((item) => (
          <div>
            <li
              key={item.index_id}
              className=""
              style={{ paddingLeft: `${paddingLeft}px` }}
            >
              <div className="flex items-center justify-between group">
                <div
                  onClick={
                    item.parent_index_id === null
                      ? () => handleToggle(item.index_id)
                      : undefined
                  }
                  className={`flex flex-col items-start cursor-pointer  ${
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
                            <MdAdd size={16} />
                          ) : (
                            <MdSunny />
                          )}
                        </button>
                      )}
                    </span>

                    <div >{item.index_name}</div>
                  </div>
                </div>
                <div className="invisible group-hover:visible">
                  <ActionButtons />
                </div>
              </div>

              {item.children &&
                toggledIds.includes(
                  topLevelIndex ? topLevelIndex.index_id : item.index_id
                ) && (
                  <NestedIndexItem
                    key={item.index_id}
                    data={item.children}
                    level={level + (item.parent_index_id === null ? 16 : -4)}
                    topLevelIndex={topLevelIndex ? topLevelIndex : item}
                    toggledIds={toggledIds}
                    setToggledIds={setToggledIds}
                  />
                )}
            </li>
          </div>
        ))}
      </ul>
    </div>
  );
};

const NestedIndex = ({ data }:{data:NestedIndexItem[]}) => {
  const [toggledIds, setToggledIds] = useState<(number | null)[]>([null]);
  return (
    <div className="flex items-start flex-col">
      {/* <p className="text-center text-lg font-semibold p-2 w-full rounded-full">
        {data[0]?.syll_syllabus_entity?.syllabus_name}
      </p> */}
      <NestedIndexItem
        data={data}
        toggledIds={toggledIds}
        setToggledIds={setToggledIds}
      />
    </div>
  );
};

export default NestedIndex;
