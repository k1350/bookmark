import type { CreateBookmarkListProps } from "../types.js";
import { updateBookmarkList } from "./updateBookmarkList.js";

/**
 * ブックマーク一覧作成
 */
export async function createBookmarkList(
  props: CreateBookmarkListProps,
): Promise<HTMLDivElement> {
  const div = document.createElement("div");
  await updateBookmarkList({
    element: div,
    ...props,
  });
  return div;
}
