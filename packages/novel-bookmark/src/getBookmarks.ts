import { getBookmarksFromStorage } from "./storage";
import type { Bookmark } from "./types";

/** ブックマークを取得する */
export function getBookmarks(): Bookmark[] {
  const storageData = getBookmarksFromStorage() ?? "[]";
  const parsedStorageData = JSON.parse(storageData);
  return Array.isArray(parsedStorageData)
    ? parsedStorageData.filter((item) => isBookmark(item))
    : [];
}

/** Bookmark 型ガード */
function isBookmark(data: unknown): data is Bookmark {
  if (typeof data !== "object" || data === null) {
    return false;
  }
  return (
    "title" in data &&
    typeof data.title === "string" &&
    "url" in data &&
    typeof data.url === "string"
  );
}
