import { ElementTypeOfGetIndex } from "./@syllabus/getIndex";


export interface NestedIndexItem extends ElementTypeOfGetIndex {
  children?: ElementTypeOfGetIndex[];
}

export const transformFlatToNested = (
  flatData: ElementTypeOfGetIndex[]
): NestedIndexItem[] => {
  const createNode = (flatItem: ElementTypeOfGetIndex): NestedIndexItem => ({
    ...flatItem,
    children: flatData
      .filter((item) => item.parent_index_id === flatItem.index_id)
      .sort((a, b) => a.sequence! - b.sequence!)
      .map(createNode),
  });
  // Create nodes for top-level items (where parent_index_id is null)
  return flatData
    .filter((item) => item.parent_index_id === null)
    .sort((a, b) => a.sequence! - b.sequence!)
    .map(createNode);
};
