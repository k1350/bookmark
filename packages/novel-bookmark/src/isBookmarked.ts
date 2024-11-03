import { getFromDatabase } from "./database";
import { isBookmark } from "./typeGuard";

/** ブックマーク済みかどうかを返す */
export async function isBookmarked(url: string): Promise<boolean> {
  const bookmark = await getFromDatabase(url, isBookmark);
  return !!bookmark;
}
