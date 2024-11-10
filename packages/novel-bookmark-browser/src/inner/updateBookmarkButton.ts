import { isBookmarked } from "novel-bookmark/index.js";
import type { updateBookmarkButtonProps } from "../types.js";

export async function updateBookmarkButton({
  element,
}: updateBookmarkButtonProps): Promise<HTMLElement> {
  const bookmarked = await isBookmarked(window.location.href);
  element.dataset.bookmarked = bookmarked ? "true" : "false";
  return element;
}
