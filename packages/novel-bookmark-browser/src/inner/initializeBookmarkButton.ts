import {
  addBookmark,
  isBookmarked,
  removeBookmark,
} from "novel-bookmark/index.js";
import { BOOKMARK_BUTTON_CLASS } from "../constants.js";
import type { CreateBookmarkButtonProps } from "../types.js";
import { updateBookmarkButton } from "./updateBookmarkButton.js";

/**
 * ブックマークボタンを初期化する
 */
export async function initializeBookmarkButton({
  onClick,
}: CreateBookmarkButtonProps): Promise<HTMLElement> {
  const buttons = document.getElementsByClassName(BOOKMARK_BUTTON_CLASS);
  if (buttons.length === 0) {
    throw new Error("novel-bookmark__button is not found");
  }
  const button = buttons[0];
  if (!(button instanceof HTMLElement)) {
    throw new Error("novel-bookmark__button is not HTMLElement");
  }
  await updateBookmarkButton({
    element: button,
  });

  button.addEventListener("click", () => {
    isBookmarked(window.location.href).then((isBookmarked) => {
      if (isBookmarked) {
        removeBookmark(window.location.href).then(() => {
          button.dataset.bookmarked = "false";
          onClick?.();
        });
      } else {
        addBookmark().then(() => {
          button.dataset.bookmarked = "true";
          onClick?.();
        });
      }
    });
  });
  return button;
}
