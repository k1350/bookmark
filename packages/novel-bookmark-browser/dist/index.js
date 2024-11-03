// ../novel-bookmark/src/constants.ts
var MAX_BOOKMARKS = 100;
var NOVEL_BOOKMARK_P_ID_PREFIX = "element-p-";
var NOVEL_BOOKMARK_P_DATA_NAME = "data-novel-bookmark-id";
var NOVEL_BOOKMARK_INTERSECTING_DATA_NAME = "data-novel-bookmark-intersecting";

// ../novel-bookmark/src/observe.ts
function observe({
  paragraphTag = "p",
  ...props
}) {
  const io = setIdAndIntersectionObserver({
    ...props,
    paragraphTag
  });
  if (!io) {
    return null;
  }
  return () => io.disconnect();
}
function setIdAndIntersectionObserver({
  wrapperClass,
  paragraphTag
}) {
  const wrapperElements = document.getElementsByClassName(wrapperClass);
  if (wrapperElements.length === 0) {
    return null;
  }
  const element = wrapperElements[0];
  const paragraphs = element.getElementsByTagName(paragraphTag);
  for (let index = 0; index < paragraphs.length; index++) {
    const id = `${NOVEL_BOOKMARK_P_ID_PREFIX}${index}`;
    paragraphs[index].dataset.novelBookmarkId = id;
  }
  const intersectionObserver = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      const target = entry.target;
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
var STORAGE_ID = "novel-bookmarks";
var TEMP_STORAGE_ID = "novel-bookmark-p-id";
function setItemToStorage({ type, key, value }) {
  if (type === "local") {
    return localStorage.setItem(key, value);
  }
  return sessionStorage.setItem(key, value);
}
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
function setBookmarkToStorage(bookmarks) {
  setItemToStorage({
    type: "local",
    key: STORAGE_ID,
    value: JSON.stringify(bookmarks)
  });
}
function setParagraphIdToStorage(id) {
  setItemToStorage({ type: "session", key: TEMP_STORAGE_ID, value: id });
}
function getBookmarksFromStorage() {
  return getItemFromStorage({ type: "local", key: STORAGE_ID });
}
function getParagraphIdFromStorage() {
  const id = getItemFromStorage({ type: "session", key: TEMP_STORAGE_ID });
  removeItemFromStorage({ type: "session", key: TEMP_STORAGE_ID });
  return id;
}
function removeBookmarkFromStorage() {
  removeItemFromStorage({ type: "local", key: STORAGE_ID });
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

// ../novel-bookmark/src/getBookmarks.ts
function getBookmarks() {
  const storageData = getBookmarksFromStorage() ?? "[]";
  const parsedStorageData = JSON.parse(storageData);
  return Array.isArray(parsedStorageData) ? parsedStorageData.filter((item) => isBookmark(item)) : [];
}
function isBookmark(data) {
  if (typeof data !== "object" || data === null) {
    return false;
  }
  return "title" in data && typeof data.title === "string" && "url" in data && typeof data.url === "string";
}

// ../novel-bookmark/src/isBookmarked.ts
function isBookmarked() {
  const currentBookmarks = getBookmarks();
  return currentBookmarks.some(
    (bookmark) => bookmark.url === window.location.href
  );
}

// ../novel-bookmark/src/addBookmark.ts
function addBookmark(id) {
  const currentBookmarks = getBookmarks();
  if (currentBookmarks.length >= MAX_BOOKMARKS) {
    return;
  }
  const intersectingIds = Array.from(
    document.querySelectorAll(
      `[${NOVEL_BOOKMARK_INTERSECTING_DATA_NAME}="true"]`
    )
  ).map(
    (element) => Number.parseInt(
      element.dataset.novelBookmarkId?.replace(
        "element-p-",
        ""
      ) ?? "0"
    )
  );
  currentBookmarks.push({
    title: document.title,
    url: window.location.href,
    id: intersectingIds.length > 0 ? `${NOVEL_BOOKMARK_P_ID_PREFIX}${Math.min(...intersectingIds)}` : void 0
  });
  setBookmarkToStorage(currentBookmarks);
}

// ../novel-bookmark/src/removeBookmark.ts
function removeBookmark(bookmark) {
  const currentBookmarks = getBookmarks();
  const filteredBookmarks = currentBookmarks.filter(
    (currentBookmark) => currentBookmark.url !== (bookmark ? bookmark.url : window.location.href)
  );
  if (filteredBookmarks.length > 0) {
    setBookmarkToStorage(filteredBookmarks);
    return;
  }
  removeBookmarkFromStorage();
}

// ../novel-bookmark/src/onClickBookmarkLink.ts
function onClickBookmarkLink(bookmark) {
  if (bookmark.id) {
    setParagraphIdToStorage(bookmark.id);
  }
}

// src/initialize.ts
function initialize() {
  let disconnect = null;
  if (document.readyState !== "loading") {
    disconnect = observe({ wrapperClass: "Novel" });
  } else {
    document.addEventListener("readystatechange", () => {
      if (document.readyState === "interactive") {
        disconnect = observe({ wrapperClass: "Novel" });
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

// src/constants.ts
var BookmarkButtonId = "NovelBookmarkButton";
var BookmarkListId = "NovelBookmarkList";

// src/createBookmarkButton.ts
function createBookmarkButton({
  parentElement = document.body,
  className = "NovelBookmarkButton",
  bookmarkedText = "Remove Bookmark",
  notBookmarkedText = "Add Bookmark",
  onClick
}) {
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

// src/createBookmarkList.ts
function onRemoveButtonClick({
  bookmark,
  notBookmarkedText = "Add Bookmark",
  ...props
}) {
  removeBookmark(bookmark);
  const bookmarkButton = document.getElementById(BookmarkButtonId);
  if (bookmarkButton && !isBookmarked()) {
    bookmarkButton.textContent = notBookmarkedText;
    bookmarkButton.dataset.bookmarked = "false";
  }
  createBookmarkList({ notBookmarkedText, ...props });
}
function createBookmarkList({
  parentElement = document.body,
  className = "NovelBookmarkList",
  noBookmarkText = "No bookmarks",
  removeBookmarkButtonText = "Remove",
  ...props
}) {
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
    button.addEventListener(
      "click",
      () => onRemoveButtonClick({
        ...props,
        parentElement,
        className,
        noBookmarkText,
        removeBookmarkButtonText,
        bookmark
      })
    );
    item.appendChild(link);
    item.appendChild(button);
    list.appendChild(item);
  }
  div.appendChild(list);
  parentElement.appendChild(div);
}
export {
  createBookmarkButton,
  createBookmarkList,
  initialize
};
