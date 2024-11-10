// ../novel-bookmark/src/constants.ts
var MAX_BOOKMARKS = 100;
var NOVEL_BOOKMARK_P_ID_PREFIX = "element-p-";
var NOVEL_BOOKMARK_P_DATA_NAME = "data-novel-bookmark-id";
var NOVEL_BOOKMARK_INTERSECTING_DATA_NAME = "data-novel-bookmark-intersecting";

// ../novel-bookmark/src/observe.ts
function observe({ wrapperClass }) {
  const io = setIdAndIntersectionObserver({
    wrapperClass
  });
  if (!io) {
    return null;
  }
  return () => io.disconnect();
}
function setIdAndIntersectionObserver({
  wrapperClass
}) {
  const wrapperElements = document.getElementsByClassName(wrapperClass);
  if (wrapperElements.length === 0) {
    return null;
  }
  const element = wrapperElements[0];
  const paragraphs = element.children;
  for (let index = 0; index < paragraphs.length; index++) {
    const id = `${NOVEL_BOOKMARK_P_ID_PREFIX}${index}`;
    const paragraph = paragraphs[index];
    if (!(paragraph instanceof HTMLElement)) {
      continue;
    }
    paragraph.dataset.novelBookmarkId = id;
  }
  const intersectionObserver = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      const target = entry.target;
      if (!(target instanceof HTMLElement)) {
        continue;
      }
      const id = target.dataset.novelBookmarkId;
      if (!id) {
        continue;
      }
      target.dataset.novelBookmarkIntersecting = entry.isIntersecting.toString();
    }
  });
  for (const paragraph of paragraphs) {
    intersectionObserver.observe(paragraph);
  }
  return intersectionObserver;
}

// ../novel-bookmark/src/storage.ts
var TEMP_STORAGE_ID = "novel-bookmark-p-id";
function getItemFromStorage({
  type,
  key
}) {
  if (type === "local") {
    return localStorage.getItem(key);
  }
  return sessionStorage.getItem(key);
}
function removeItemFromStorage({ type, key }) {
  if (type === "local") {
    return localStorage.removeItem(key);
  }
  return sessionStorage.removeItem(key);
}
function getParagraphIdFromStorage() {
  const id = getItemFromStorage({ type: "session", key: TEMP_STORAGE_ID });
  removeItemFromStorage({ type: "session", key: TEMP_STORAGE_ID });
  return id;
}

// ../novel-bookmark/src/scrollToParagraph.ts
function scrollToParagraph() {
  const id = getParagraphIdFromStorage();
  if (!id) return;
  const element = document.querySelector(
    `[${NOVEL_BOOKMARK_P_DATA_NAME}="${id}"]`
  );
  if (!element) {
    return;
  }
  element.scrollIntoView({ behavior: "smooth" });
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
async function addToDatabase(item) {
  const tx = await getTransaction("readwrite");
  return new Promise((resolve, reject) => {
    const request = tx.objectStore(DB_STORE_NAME).add(item);
    tx.oncomplete = () => {
      resolve();
    };
    request.onerror = (event) => {
      reject(event);
    };
  });
}
async function deleteFromDatabase(key) {
  const tx = await getTransaction("readwrite");
  return new Promise((resolve, reject) => {
    const request = tx.objectStore(DB_STORE_NAME).delete(key);
    tx.oncomplete = () => {
      resolve();
    };
    request.onerror = (event) => {
      reject(event);
    };
  });
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
async function getFromDatabase(key, typeGuard) {
  const tx = await getTransaction("readonly");
  return new Promise((resolve, reject) => {
    const request = tx.objectStore(DB_STORE_NAME).get(key);
    request.onsuccess = (event) => {
      const eventTarget = event.target;
      if (!eventTarget || !("result" in eventTarget)) {
        console.error("getFromDatabase: event.target is invalid", eventTarget);
        reject(event);
        return;
      }
      const item = eventTarget.result;
      if (typeGuard(item)) {
        resolve(item);
      } else if (item === null || item === void 0) {
        resolve(item);
      } else {
        console.error("getFromDatabase: event.target.result is invalid", item);
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

// ../novel-bookmark/src/isBookmarked.ts
async function isBookmarked(url) {
  const bookmark = await getFromDatabase(url, isBookmark);
  return !!bookmark;
}

// ../novel-bookmark/src/getBookmarks.ts
async function getBookmarks() {
  return getAllFromDatabase(isBookmark).catch((event) => {
    console.error("getBookmarks error", event);
    return [];
  });
}

// ../novel-bookmark/src/addBookmark.ts
async function addBookmark() {
  const alreadyBookmarked = await isBookmarked(window.location.href);
  if (alreadyBookmarked) return;
  const currentBookmarks = await getBookmarks();
  if (currentBookmarks.length >= MAX_BOOKMARKS) {
    return;
  }
  const intersectingIds = Array.from(
    document.querySelectorAll(
      `[${NOVEL_BOOKMARK_INTERSECTING_DATA_NAME}="true"]`
    )
  ).map((element) => {
    if (!(element instanceof HTMLElement)) {
      return 0;
    }
    return Number.parseInt(
      element.dataset.novelBookmarkId?.replace("element-p-", "") ?? "0"
    );
  });
  await addToDatabase({
    title: document.title,
    url: window.location.href,
    id: intersectingIds.length > 0 ? `${NOVEL_BOOKMARK_P_ID_PREFIX}${Math.min(...intersectingIds)}` : void 0
  }).catch((event) => {
    console.error("addToDatabase error", event);
  });
}

// ../novel-bookmark/src/removeBookmark.ts
async function removeBookmark(url) {
  const alreadyBookmarked = await isBookmarked(url);
  if (!alreadyBookmarked) return;
  await deleteFromDatabase(url);
}

// src/constants.ts
var CONTAILNER_CLASS = "novel-bookmark__container";
var BOOKMARK_BUTTON_CLASS = "novel-bookmark__button";

// src/inner/initialize.ts
function initialize() {
  let disconnect = null;
  if (document.readyState !== "loading") {
    disconnect = observe({ wrapperClass: CONTAILNER_CLASS });
  } else {
    document.addEventListener("readystatechange", () => {
      if (document.readyState === "interactive") {
        disconnect = observe({ wrapperClass: CONTAILNER_CLASS });
      }
    });
  }
  if (document.readyState === "complete") {
    scrollToParagraph();
  } else {
    document.addEventListener("readystatechange", () => {
      if (document.readyState === "complete") {
        scrollToParagraph();
      }
    });
  }
  window.addEventListener(
    "beforeunload",
    () => {
      if (disconnect) {
        disconnect();
        disconnect = null;
      }
    },
    false
  );
}

// src/inner/updateBookmarkButton.ts
async function updateBookmarkButton({
  element
}) {
  const bookmarked = await isBookmarked(window.location.href);
  element.dataset.bookmarked = bookmarked ? "true" : "false";
  return element;
}

// src/inner/initializeBookmarkButton.ts
async function initializeBookmarkButton({
  onClick
}) {
  const buttons = document.getElementsByClassName(BOOKMARK_BUTTON_CLASS);
  if (buttons.length === 0) {
    throw new Error("novel-bookmark__button is not found");
  }
  const button = buttons[0];
  if (!(button instanceof HTMLElement)) {
    throw new Error("novel-bookmark__button is not HTMLElement");
  }
  await updateBookmarkButton({
    element: button
  });
  button.addEventListener("click", () => {
    isBookmarked(window.location.href).then((isBookmarked2) => {
      if (isBookmarked2) {
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

// src/initializeButtonOnlyPage.ts
initialize();
if (document.readyState !== "loading") {
  initializeBookmarkButton({});
} else {
  document.addEventListener("DOMContentLoaded", () => {
    initializeBookmarkButton({});
  });
}
