import { getAllFromDatabase } from "./database";
import { isBookmark } from "./typeGuard";
import type { Bookmark } from "./types";

/** ブックマークを取得する */
export async function getBookmarks(): Promise<Bookmark[]> {
  return getAllFromDatabase(isBookmark).catch((event) => {
    console.error("getBookmarks error", event);
    return [];
  });
}
