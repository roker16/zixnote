import React, { ReactNode } from "react";
import IndexForm from "./IndexForm";

interface NestedIndexItem {
  category_id: number | null;
  index_id: number;
  index_name: string;
  parent_index_id: number | null;
  sequence: number | null;
  syllabus_id: number;
  children?: NestedIndexItem[];
}

interface NestedIndexItemProps {
  data: NestedIndexItem[];
  level?: number;
  // editable: boolean;
  actionui?: ReactNode ;
}

const NestedIndexItem: React.FC<NestedIndexItemProps> = ({
  data,
  level = 0,
  // editable,
  actionui
}) => {
  
  const paddingLeft = level * 0;
  return (
    <ul className="p-2 gap-y-32 space-y-1  bg-slate-200 rounded-md ">
      {data.map((item) => (
        <div>
          <li
            key={item.index_id}
            className="px-2 "
            style={{ paddingLeft: `${paddingLeft}px` }}
          >
            <div className="flex flex-col">
              <text>{item.index_name}</text>
            </div>
            {item.children && (
              <NestedIndexItem
                data={item.children}
                level={level + 1}
                // editable={editable}
              />
            )}
          </li>
        </div>
      ))}
    </ul>
  );
};

const NestedIndex: React.FC<NestedIndexItemProps> = ({
  data,
  // editable,
  actionui,
}) => {
  return (
    <div>
      <h1>Nested Index Data</h1>
      <NestedIndexItem data={data}  />
    </div>
  );
};

export default NestedIndex;
