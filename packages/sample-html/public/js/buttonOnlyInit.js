import { BOOKMARK_BUTTON_CLASS, BOOKMARK_BUTTON_PROPS } from "./constants.js";
import { createButton, initialize } from "./novel-bookmark/index.min.js";

initialize();

const parentElement = document.getElementsByTagName("main")[0];

if (document.readyState !== "loading") {
  createButton({
    ...BOOKMARK_BUTTON_PROPS,
    className: BOOKMARK_BUTTON_CLASS,
    parentElement,
  });
} else {
  document.addEventListener("DOMContentLoaded", () => {
    createButton({
      ...BOOKMARK_BUTTON_PROPS,
      className: BOOKMARK_BUTTON_CLASS,
      parentElement,
    });
  });
}
