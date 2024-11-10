// src/constants.ts
var BOOKMARK_LIST_CONTAINER_CLASS = "novel-bookmark__list-container";
var BOOKMARK_LISTITEM_LINK_CLASS = "novel-bookmark__listitem--link";

// ../novel-bookmark/src/storage.ts
var TEMP_STORAGE_ID = "novel-bookmark-p-id";
function setItemToStorage({ type, key, value }) {
  if (type === "local") {
    return localStorage.setItem(key, value);
  }
  return sessionStorage.setItem(key, value);
}
function setParagraphIdToStorage(id) {
  setItemToStorage({ type: "session", key: TEMP_STORAGE_ID, value: id });
}

// ../novel-bookmark/src/database.ts
var DB_NAME = "novel-bookmarks";
var DB_VERSION = 1;
var DB_STORE_NAME = "novel-bookmarks-store";
var _db;
async function openDatabase() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onsuccess = function() {
      _db = this.result;
      resolve(_db);
    };
    req.onerror = (event) => {
      reject(event);
    };
    req.onupgradeneeded = (event) => {
      const eventTarget = event.target;
      if (!eventTarget || !("result" in eventTarget)) {
        console.error("openDatabase: event.target is invalid", eventTarget);
        reject(event);
        return;
      }
      const db = eventTarget.result;
      if (!(db instanceof IDBDatabase)) {
        console.error("openDatabase: event.target.result is invalid", db);
        reject(event);
        return;
      }
      db.createObjectStore(DB_STORE_NAME, {
        keyPath: "url"
      });
    };
  });
}
async function getDatabase() {
  if (_db) return _db;
  return openDatabase();
}
async function getTransaction(mode) {
  const db = await getDatabase();
  return db.transaction([DB_STORE_NAME], mode);
}
async function getAllFromDatabase(typeGuard) {
  const tx = await getTransaction("readonly");
  return new Promise((resolve, reject) => {
    const request = tx.objectStore(DB_STORE_NAME).openCursor();
    const items = [];
    request.onsuccess = (event) => {
      const eventTarget = event.target;
      if (!eventTarget || !("result" in eventTarget)) {
        console.error(
          "getAllFromDatabase: event.target is invalid",
          eventTarget
        );
        reject(event);
        return;
      }
      const cursor = eventTarget.result;
      if (cursor instanceof IDBCursorWithValue) {
        if (typeGuard(cursor.value)) {
          items.push(cursor.value);
          cursor.continue();
        } else {
          console.error(
            "getAllFromDatabase: event.target.result.value is invalid",
            cursor.value
          );
          reject(event);
        }
      } else if (cursor === null) {
        resolve(items);
      } else {
        console.error(
          "getAllFromDatabase: event.target.result is invalid",
          cursor
        );
        reject(event);
      }
    };
    request.onerror = (event) => {
      reject(event);
    };
  });
}

// ../novel-bookmark/src/typeGuard.ts
function isBookmark(data) {
  if (typeof data !== "object" || data === null) {
    return false;
  }
  return "title" in data && typeof data.title === "string" && "url" in data && typeof data.url === "string";
}

// ../novel-bookmark/src/getBookmarks.ts
async function getBookmarks() {
  return getAllFromDatabase(isBookmark).catch((event) => {
    console.error("getBookmarks error", event);
    return [];
  });
}

// ../novel-bookmark/src/onClickBookmarkLink.ts
function onClickBookmarkLink(bookmark) {
  if (bookmark.id) {
    setParagraphIdToStorage(bookmark.id);
  }
}

// src/inner/updateBookmarkList.ts
async function updateBookmarkList({
  element
}) {
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
function existsBookmark(url, list) {
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

// src/inner/initializeBookmarkList.ts
async function initializeBookmarkList() {
  const elements = document.getElementsByClassName(
    BOOKMARK_LIST_CONTAINER_CLASS
  );
  if (elements.length === 0) {
    throw new Error("novel-bookmark__list-container is not found");
  }
  const element = elements[0];
  if (!(element instanceof HTMLElement)) {
    throw new Error("novel-bookmark__list-container is not HTMLElement");
  }
  await updateBookmarkList({
    element
  });
  return element;
}

// src/initializeListOnlyPage.ts
if (document.readyState !== "loading") {
  initializeBookmarkList();
} else {
  document.addEventListener("DOMContentLoaded", () => {
    initializeBookmarkList();
  });
}
