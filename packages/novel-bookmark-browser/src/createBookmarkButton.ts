import {
  addBookmark,
  isBookmarked,
  removeBookmark,
} from "novel-bookmark/index.js";
import { BookmarkButtonId } from "./constants.js";
import type { CreateBookmarkButtonProps } from "./types.js";

/**
 * ブックマークボタンを作成する
 */
export async function createBookmarkButton({
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
  const bookmarked = await isBookmarked(window.location.href);
  button.textContent = bookmarked ? bookmarkedText : notBookmarkedText;
  button.dataset.bookmarked = bookmarked ? "true" : "false";

  button.addEventListener("click", () => {
    isBookmarked(window.location.href).then((isBookmarked) => {
      if (isBookmarked) {
        removeBookmark(window.location.href).then(() => {
          button.textContent = notBookmarkedText;
          button.dataset.bookmarked = "false";
          onClick?.();
        });
      } else {
        addBookmark().then(() => {
          button.textContent = bookmarkedText;
          button.dataset.bookmarked = "true";
          onClick?.();
        });
      }
    });
  });

  parentElement.appendChild(button);
}
