import { getBookmarks, onClickBookmarkLink } from "novel-bookmark/index";
import { BOOKMARK_LISTITEM_LINK_CLASS } from "../constants";
import type { UpdateBookmarkListProps } from "../types";

export async function updateBookmarkList({
  element,
}: UpdateBookmarkListProps): Promise<HTMLElement> {
  const bookmarks = await getBookmarks();
  if (bookmarks.length === 0) {
    element.dataset.empty = "true";
    return element;
  }

  element.dataset.empty = "false";
  const lists = element.getElementsByTagName("ul");
  if (lists.length === 0) {
    throw new Error("ul in novel-bookmark__list-container is not found");
  }
  const list = lists[0];

  // 既存のリストに存在するがブックマークには存在しないものを削除する
  for (const child of list.children) {
    if (child instanceof HTMLLIElement) {
      const links = child.getElementsByTagName("a");
      if (links.length === 0) {
        continue;
      }
      const link = links[0];
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
      link.classList.add(BOOKMARK_LISTITEM_LINK_CLASS);
      link.addEventListener("click", () => {
        onClickBookmarkLink(bookmark);
      });
      item.appendChild(link);
      list.appendChild(item);
    }
  }

  return element;
}

function existsBookmark(url: string, list: HTMLUListElement): boolean {
  return Array.from(list.children).some((child) => {
    if (child instanceof HTMLLIElement) {
      const links = child.getElementsByTagName("a");
      if (links.length === 0) {
        return false;
      }
      const link = links[0];
      if (link instanceof HTMLAnchorElement) {
        return link.href === url;
      }
    }
    return false;
  });
}
