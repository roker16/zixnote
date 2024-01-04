import React from "react";

interface NestedIndexItem {
  index_id: number;
  index_name: string;
  category_id: number;
  parent_index_id: number | null;
  sequence: number;
  children?: NestedIndexItem[];
}

interface NestedIndexItemProps {
  data: NestedIndexItem[];
  level?: number;
}

const NestedIndexItem: React.FC<NestedIndexItemProps> = ({
  data,
  level = 0,
}) => {
  const paddingLeft = level * 10;
  return (
    <ul className="p-2  bg-slate-200 rounded-md">
      {data.map((item) => (
        <li key={item.index_id} className="px-4" style={{ paddingLeft: `${paddingLeft}px` }}>
          {item.index_name} (Parent: {item.parent_index_id})
          {item.children && (
            <NestedIndexItem data={item.children} level={level + 1} />
          )}
        </li>
      ))}
    </ul>
  );
};

const NestedIndex: React.FC<NestedIndexItemProps> = ({ data }) => {
  return (
    <div>
      <h1>Nested Index Data</h1>
      <NestedIndexItem data={data} />
    </div>
  );
};

export default NestedIndex;
