import { deleteFromDatabase } from "./database";
import { isBookmarked } from "./isBookmarked";

/** ブックマークを解除する */
export async function removeBookmark(url: string): Promise<void> {
  const alreadyBookmarked = await isBookmarked(url);
  if (!alreadyBookmarked) return;
  await deleteFromDatabase(url);
}
