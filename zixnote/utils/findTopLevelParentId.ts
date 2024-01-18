import { NestedIndexItem } from "./transformFlatToNested";

export function findTopLevelParentId(
  data: NestedIndexItem,
  childIndexId: number | null,
  topLevelParentId: number | null = null
): number | null {
  if (data.index_id === childIndexId) {
    // If the current node is the target child, return the top-level parent_index_id
    return topLevelParentId;
  }

  if (data.children) {
    // If the current node has children, recursively search for the target child
    for (const child of data.children) {
      const parentId = findTopLevelParentId(
        child,
        childIndexId,
        topLevelParentId !== null ? topLevelParentId : data.index_id
      );
      if (parentId !== null) {
        // If a parent is found in the recursion, return it
        return parentId;
      }
    }
  }
  // If the target child is not found in the current branch, return null
  return null;
}
