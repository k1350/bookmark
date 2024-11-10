import {
  MAX_BOOKMARKS,
  NOVEL_BOOKMARK_INTERSECTING_DATA_NAME,
  NOVEL_BOOKMARK_P_ID_PREFIX,
} from "./constants";
import { addToDatabase } from "./database";
import { getBookmarks } from "./getBookmarks";
import { isBookmarked } from "./isBookmarked";

/** ブックマークする */
export async function addBookmark(): Promise<void> {
  const alreadyBookmarked = await isBookmarked(window.location.href);
  if (alreadyBookmarked) return;

  const currentBookmarks = await getBookmarks();
  if (currentBookmarks.length >= MAX_BOOKMARKS) {
    return;
  }
  const intersectingIds = Array.from(
    document.querySelectorAll(
      `[${NOVEL_BOOKMARK_INTERSECTING_DATA_NAME}="true"]`,
    ),
  ).map((element) => {
    if (!(element instanceof HTMLElement)) {
      return 0;
    }
    return Number.parseInt(
      element.dataset.novelBookmarkId?.replace("element-p-", "") ?? "0",
    );
  });

  await addToDatabase({
    title: document.title,
    url: window.location.href,
    id:
      intersectingIds.length > 0
        ? `${NOVEL_BOOKMARK_P_ID_PREFIX}${Math.min(...intersectingIds)}`
        : undefined,
  }).catch((event) => {
    console.error("addToDatabase error", event);
  });
}
