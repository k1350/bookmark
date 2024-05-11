import { createBookmarkList } from "./novel-bookmark/index.min.js";
import { createBookmarkListprops } from "./props.js";

if (document.readyState !== "loading") {
  createBookmarkList(createBookmarkListprops);
} else {
  document.addEventListener("readystatechange", () => {
    if (document.readyState === "interactive") {
      createBookmarkList(createBookmarkListprops);
    }
  });
}
