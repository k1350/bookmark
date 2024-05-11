import {
  type Bookmark,
  getBookmarks,
  isBookmarked,
  onClickBookmarkLink,
  removeBookmark,
} from "../index.js";
import { BookmarkButtonId, BookmarkListId } from "./constants.js";
import type { CreateBookmarkListProps } from "./types.js";

/**
 * ブックマーク削除ボタンがクリックされたときの処理
 */
function onRemoveButtonClick({
  bookmark,
  notBookmarkedText = "Add Bookmark",
  ...props
}: CreateBookmarkListProps & {
  bookmark: Bookmark;
}) {
  removeBookmark(bookmark);

  const bookmarkButton = document.getElementById(BookmarkButtonId);
  if (bookmarkButton && !isBookmarked()) {
    bookmarkButton.textContent = notBookmarkedText;
    bookmarkButton.dataset.bookmarked = "false";
  }

  createBookmarkList({ notBookmarkedText, ...props });
}

/**
 * ブックマーク一覧作成
 */
export function createBookmarkList({
  parentElement = document.body,
  className = "NovelBookmarkList",
  noBookmarkText = "No bookmarks",
  removeBookmarkButtonText = "Remove",
  ...props
}: CreateBookmarkListProps) {
  document.getElementById(BookmarkListId)?.remove();

  const bookmarks = getBookmarks();

  const div = document.createElement("div");
  div.id = BookmarkListId;
  div.classList.add(className);

  if (bookmarks.length === 0) {
    div.textContent = noBookmarkText;
    div.dataset.empty = "true";
    parentElement.appendChild(div);
    return;
  }

  div.dataset.empty = "false";
  const list = document.createElement("ul");
  for (const bookmark of bookmarks) {
    const item = document.createElement("li");
    const link = document.createElement("a");
    link.href = bookmark.url;
    link.textContent = bookmark.title;
    link.addEventListener("click", () => {
      onClickBookmarkLink(bookmark);
    });
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = removeBookmarkButtonText;
    button.addEventListener("click", () =>
      onRemoveButtonClick({
        ...props,
        parentElement,
        className,
        noBookmarkText,
        removeBookmarkButtonText,
        bookmark,
      }),
    );
    item.appendChild(link);
    item.appendChild(button);
    list.appendChild(item);
  }
  div.appendChild(list);
  parentElement.appendChild(div);
}
