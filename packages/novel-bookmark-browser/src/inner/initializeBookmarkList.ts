import { BOOKMARK_LIST_CONTAINER_CLASS } from "../constants.js";
import { updateBookmarkList } from "./updateBookmarkList.js";

/**
 * ブックマーク一覧初期化
 */
export async function initializeBookmarkList(): Promise<HTMLElement> {
  const elements = document.getElementsByClassName(
    BOOKMARK_LIST_CONTAINER_CLASS,
  );
  if (elements.length === 0) {
    throw new Error("novel-bookmark__list-container is not found");
  }
  const element = elements[0];
  if (!(element instanceof HTMLElement)) {
    throw new Error("novel-bookmark__list-container is not HTMLElement");
  }
  await updateBookmarkList({
    element,
  });
  return element;
}
