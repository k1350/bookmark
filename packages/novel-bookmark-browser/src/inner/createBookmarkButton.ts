import {
  addBookmark,
  isBookmarked,
  removeBookmark,
} from "novel-bookmark/index.js";
import type { CreateBookmarkButtonProps } from "../types.js";
import { updateBookmarkButton } from "./updateBookmarkButton.js";

/**
 * ブックマークボタンを作成する
 */
export async function createBookmarkButton({
  bookmarkedText = "Remove Bookmark",
  notBookmarkedText = "Add Bookmark",
  onClick,
}: CreateBookmarkButtonProps): Promise<HTMLButtonElement> {
  const button = document.createElement("button");
  button.type = "button";
  await updateBookmarkButton({
    element: button,
    bookmarkedText,
    notBookmarkedText,
  });

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
  return button;
}
