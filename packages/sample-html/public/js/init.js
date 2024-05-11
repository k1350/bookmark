import {
  createBookmarkButton,
  createBookmarkList,
  initialize,
} from "./novel-bookmark/index.min.js";
import { createBookmarkButtonprops, createBookmarkListprops } from "./props.js";

initialize();

function resetList() {
  const bookmarkList = document.querySelector(".BookmarkList");
  if (bookmarkList) {
    createBookmarkList(createBookmarkListprops);
  }
}

if (document.readyState !== "loading") {
  createBookmarkButton({
    ...createBookmarkButtonprops,
    onClick: () => resetList(),
  });
} else {
  document.addEventListener("readystatechange", () => {
    if (document.readyState === "interactive") {
      createBookmarkButton({
        ...createBookmarkButtonprops,
        onClick: () => resetList(),
      });
    }
  });
}
