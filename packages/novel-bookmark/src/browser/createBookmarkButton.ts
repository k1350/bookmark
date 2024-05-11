import { addBookmark, isBookmarked, removeBookmark } from "../index.js";
import { BookmarkButtonId } from "./constants.js";
import type { CreateBookmarkButtonProps } from "./types.js";

/**
 * ブックマークボタンを作成する
 */
export function createBookmarkButton({
  parentElement = document.body,
  className = "NovelBookmarkButton",
  bookmarkedText = "Remove Bookmark",
  notBookmarkedText = "Add Bookmark",
  onClick,
}: CreateBookmarkButtonProps) {
  const button = document.createElement("button");
  button.type = "button";
  button.id = BookmarkButtonId;
  button.classList.add(className);
  const bookmarked = isBookmarked();
  button.textContent = bookmarked ? bookmarkedText : notBookmarkedText;
  button.dataset.bookmarked = bookmarked ? "true" : "false";

  button.addEventListener("click", () => {
    if (isBookmarked()) {
      removeBookmark();
      button.textContent = notBookmarkedText;
      button.dataset.bookmarked = "false";
    } else {
      addBookmark();
      button.textContent = bookmarkedText;
      button.dataset.bookmarked = "true";
    }
    onClick?.();
  });

  parentElement.appendChild(button);
}
