import { getBookmarks } from "./getBookmarks";

/** ブックマーク済みかどうかを返す */
export function isBookmarked(): boolean {
  const currentBookmarks = getBookmarks();
  return currentBookmarks.some(
    (bookmark) => bookmark.url === window.location.href,
  );
}
