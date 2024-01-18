"use client"
import React, { ReactNode, useState } from "react";
import IndexForm from "./IndexForm";
import ActionButtons from "./ActionButtons";
import { useBoundStore } from "@/store/zustand";
import { MdAdd } from "react-icons/md";
import { findTopLevelParentId } from "./../../../utils/findTopLevelParentId";

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
  originaldata?: NestedIndexItem;
  data: NestedIndexItem[];
  level?: number;
  // editable: boolean;
  actionui?: ReactNode;
}

const NestedIndexItem: React.FC<NestedIndexItemProps> = ({
  originaldata,
  data,
  level = 0,
  // editable,
  actionui,
}) => {
  const paddingLeft = level * 2;
  const [expandedParents, setExpandedParents] = useState<{
    [parentId: number]: boolean;
  }>({});
  console.log(JSON.stringify(originaldata?.index_id));
  const [toggledIds, setToggledIds] = useState<(number | null)[]>([]);

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
              {item.parent_index_id === null ? (
                <div className="flex items-center justify-between text-sm group">
                  <div
                    className={`flex flex-col items-start  ${
                      item.parent_index_id === null
                        ? "font-bold text-secondary"
                        : "opacity-70 group-hover:opacity-100 "
                    }`}
                  >
                    <div className="flex flex-row flex-nowrap items-center">
                      <span>
                        {item.parent_index_id == null && (
                          <button
                            onClick={() => handleToggle(item.index_id)}
                            className="btn join-item btn-circle btn-sm btn-ghost"
                          >
                            <MdAdd size={16} />
                          </button>
                        )}
                      </span>
                      <span> {item.index_name}</span>
                    </div>
                  </div>
                  <div className="invisible group-hover:visible">
                    <ActionButtons />
                  </div>
                </div>
              ) : toggledIds.includes(
                  findTopLevelParentId(originaldata!, item.index_id)
                ) ? (
                <div className="flex items-center justify-between text-sm group">
                  <div
                    className={`flex flex-col items-start  ${
                      item.parent_index_id === null
                        ? "font-bold text-secondary"
                        : "opacity-70 group-hover:opacity-100 "
                    }`}
                  >
                    <div className="flex flex-row flex-nowrap items-center">
                      <span> {item.index_name}</span>
                    </div>
                  </div>
                  <div className="invisible group-hover:visible">
                    <ActionButtons />
                  </div>
                </div>
              ) : null}
              {item.children && (
                <NestedIndexItem
                  key={item.index_id}
                  data={item.children}
                  level={level + (item.parent_index_id === null ? 16 : 1)}
                  originaldata={item}
                />
              )}
            </li>
          </div>
        ))}
      </ul>
    </div>
  );
};

const NestedIndex: React.FC<NestedIndexItemProps> = ({
  data,
  // editable,
  actionui,
}) => {
  const bears = useBoundStore().bears;
  const addBear = useBoundStore().addBear;

  return (
    <div className="flex items-start flex-col">
      {bears}
      <button className="btn" onClick={() => addBear()}>
        Add
      </button>
      <p className="text-center text-lg font-semibold p-2 w-full rounded-full">
        {data[0]?.syll_syllabus_entity?.syllabus_name}
      </p>
      <NestedIndexItem data={data} />
    </div>
  );
};

export default NestedIndex;
