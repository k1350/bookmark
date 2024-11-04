import { isBookmarked } from "novel-bookmark/index";
import type { updateBookmarkButtonProps } from "../types";

export async function updateBookmarkButton({
  element,
  bookmarkedText = "Remove Bookmark",
  notBookmarkedText = "Add Bookmark",
}: updateBookmarkButtonProps): Promise<HTMLButtonElement> {
  const bookmarked = await isBookmarked(window.location.href);
  element.textContent = bookmarked ? bookmarkedText : notBookmarkedText;
  element.dataset.bookmarked = bookmarked ? "true" : "false";
  return element;
}
