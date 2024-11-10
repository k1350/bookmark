import { initialize } from "./inner/initialize";
import { initializeBookmarkButton } from "./inner/initializeBookmarkButton";

initialize();

if (document.readyState !== "loading") {
  initializeBookmarkButton({});
} else {
  document.addEventListener("DOMContentLoaded", () => {
    initializeBookmarkButton({});
  });
}
