import React, { ReactNode } from "react";
import IndexForm from "../../manage-index/component/IndexForm";

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
  actionui?: ReactNode;
}

const NestedIndexItem: React.FC<NestedIndexItemProps> = ({
  data,
  level = 0,
  // editable,
  actionui,
}) => {
  const paddingLeft = level * 0;
  return (
    <ul className="flex flex-nowrap items-start menu p-0 gap-y-0 bg-base-100 text-left rounded-md ">
      {data.map((item) => (
        <div>
          <li
            key={item.index_id}
            className=""
            // style={{ paddingLeft: `${paddingLeft}px` }}
          >
            <div
              className={`flex flex-col items-start  ${
                item.parent_index_id === null ? "font-bold text-secondary" : ""
              }`}
            >
              {item.index_name}
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
      <NestedIndexItem data={data} />
    </div>
  );
};

export default NestedIndex;
