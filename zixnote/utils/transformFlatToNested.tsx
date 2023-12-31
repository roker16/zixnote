
export interface IndexItem {
  index_id: number;
  index_name: string;
  category_id: number;
  parent_index_id: number | null;
  sequence: number; // Assuming sequence is part of the flat data
}

export interface NestedIndexItem extends IndexItem {
  children?: NestedIndexItem[];
}

export const transformFlatToNested = (
  flatData: IndexItem[]
): NestedIndexItem[] => {
  const createNode = (flatItem: IndexItem): NestedIndexItem => ({
    ...flatItem,
    children: flatData
      .filter((item) => item.parent_index_id === flatItem.index_id)
      .sort((a, b) => a.sequence - b.sequence)
      .map(createNode),
  });
  // Create nodes for top-level items (where parent_index_id is null)
  return flatData
    .filter((item) => item.parent_index_id === null)
    .sort((a, b) => a.sequence - b.sequence)
    .map(createNode);
};


