import type { Bookmark } from "./types";

/** Bookmark 型ガード */
export function isBookmark(data: unknown): data is Bookmark {
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
