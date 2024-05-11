import { getBookmarks } from "./getBookmarks";
import { removeBookmarkFromStorage, setBookmarkToStorage } from "./storage";
import type { Bookmark } from "./types";

/** ブックマークを解除する */
export function removeBookmark(bookmark?: Bookmark): void {
  const currentBookmarks = getBookmarks();
  const filteredBookmarks = currentBookmarks.filter(
    (currentBookmark) =>
      currentBookmark.url !== (bookmark ? bookmark.url : window.location.href),
  );
  if (filteredBookmarks.length > 0) {
    setBookmarkToStorage(filteredBookmarks);
    return;
  }
  removeBookmarkFromStorage();
}
