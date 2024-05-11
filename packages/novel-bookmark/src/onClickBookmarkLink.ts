import { setParagraphIdToStorage } from "./storage";
import type { Bookmark } from "./types";

export function onClickBookmarkLink(bookmark: Bookmark) {
  if (bookmark.id) {
    setParagraphIdToStorage(bookmark.id);
  }
}
