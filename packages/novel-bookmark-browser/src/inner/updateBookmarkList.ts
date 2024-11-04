import {
  getBookmarks,
  onClickBookmarkLink,
  removeBookmark,
} from "novel-bookmark/index";
import type { UpdateBookmarkListProps } from "../types";

export async function updateBookmarkList({
  element,
  noBookmarkText = "No bookmarks",
  removeBookmarkButtonText = "Remove",
  onClickRemoveBookmarkButton,
}: UpdateBookmarkListProps): Promise<HTMLDivElement> {
  const bookmarks = await getBookmarks();
  if (bookmarks.length === 0) {
    let p: HTMLParagraphElement | null = null;
    for (const child of element.children) {
      if (child instanceof HTMLUListElement) {
        element.removeChild(child);
      } else if (child instanceof HTMLParagraphElement) {
        p = child;
      }
    }
    if (p === null) {
      p = document.createElement("p");
      element.appendChild(p);
    }
    p.textContent = noBookmarkText;
    element.dataset.empty = "true";
    return element;
  }

  element.dataset.empty = "false";
  let list: HTMLUListElement | null = null;
  for (const child of element.children) {
    if (child instanceof HTMLParagraphElement) {
      element.removeChild(child);
    } else if (child instanceof HTMLUListElement) {
      list = child;
    }
  }
  if (list === null) {
    list = document.createElement("ul");
    element.appendChild(list);
  }

  // 既存のリストに存在するがブックマークには存在しないものを削除する
  for (const child of list.children) {
    if (child instanceof HTMLLIElement) {
      const link = child.querySelector("a");
      if (link instanceof HTMLAnchorElement) {
        const url = link.href;
        if (!bookmarks.some((bookmark) => bookmark.url === url)) {
          list.removeChild(child);
        }
      }
    }
  }

  // ブックマークに存在するが既存のリストに存在しないものを追加する
  for (const bookmark of bookmarks) {
    const url = bookmark.url;
    if (!existsBookmark(url, list)) {
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
      button.addEventListener("click", () => {
        removeBookmark(bookmark.url).then(() => {
          updateBookmarkList({
            element,
            noBookmarkText,
            removeBookmarkButtonText,
          }).then(() => {
            onClickRemoveBookmarkButton?.();
          });
        });
      });
      item.appendChild(link);
      item.appendChild(button);
      list.appendChild(item);
    }
  }

  return element;
}

function existsBookmark(url: string, list: HTMLUListElement): boolean {
  return Array.from(list.children).some((child) => {
    if (child instanceof HTMLLIElement) {
      const link = child.querySelector("a");
      if (link instanceof HTMLAnchorElement) {
        return link.href === url;
      }
    }
    return false;
  });
}
