import { initializeBookmarkList } from "./inner/initializeBookmarkList";

if (document.readyState !== "loading") {
  initializeBookmarkList();
} else {
  document.addEventListener("DOMContentLoaded", () => {
    initializeBookmarkList();
  });
}
