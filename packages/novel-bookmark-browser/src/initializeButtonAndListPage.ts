import { BOOKMARK_LIST_CONTAINER_CLASS } from "./constants";
import { initialize } from "./inner/initialize";
import { initializeBookmarkButton } from "./inner/initializeBookmarkButton";
import { initializeBookmarkList } from "./inner/initializeBookmarkList";
import { updateBookmarkList } from "./inner/updateBookmarkList";

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
