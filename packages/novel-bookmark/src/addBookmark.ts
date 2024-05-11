import {
  MAX_BOOKMARKS,
  NOVEL_BOOKMARK_INTERSECTING_DATA_NAME,
  NOVEL_BOOKMARK_P_ID_PREFIX,
} from "./constants";
import { getBookmarks } from "./getBookmarks";
import { setBookmarkToStorage } from "./storage";

/** ブックマークする */
export function addBookmark(id?: string): void {
  const currentBookmarks = getBookmarks();
  if (currentBookmarks.length >= MAX_BOOKMARKS) {
    return;
  }
  const intersectingIds = Array.from(
    document.querySelectorAll(
      `[${NOVEL_BOOKMARK_INTERSECTING_DATA_NAME}="true"]`,
    ),
  ).map((element) =>
    Number.parseInt(
      (element as HTMLElement).dataset.novelBookmarkId?.replace(
        "element-p-",
        "",
      ) ?? "0",
    ),
  );

  currentBookmarks.push({
    title: document.title,
    url: window.location.href,
    id:
      intersectingIds.length > 0
        ? `${NOVEL_BOOKMARK_P_ID_PREFIX}${Math.min(...intersectingIds)}`
        : undefined,
  });
  setBookmarkToStorage(currentBookmarks);
}
