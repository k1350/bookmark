import { BOOKMARK_LIST_CONTAINER_CLASS } from "./constants.js";
import {
  initialize,
  initializeBookmarkButton,
  initializeBookmarkList,
  updateBookmarkList,
} from "./inner/index.js";

initialize();
initializeBookmarkButton({
  onClick: () => {
    const elements = document.getElementsByClassName(
      BOOKMARK_LIST_CONTAINER_CLASS,
    );
    if (elements.length === 0) {
      throw new Error("novel-bookmark__list-container is not found");
    }
    const bookmarkList = elements[0];
    if (!(bookmarkList instanceof HTMLElement)) {
      throw new Error("novel-bookmark__list-container is not HTMLElement");
    }
    updateBookmarkList({
      element: bookmarkList,
    });
  },
});
initializeBookmarkList();
