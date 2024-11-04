import { BOOKMARK_LIST_CLASS, BOOKMARK_LIST_PROPS } from "./constants.js";
import { createList, initialize } from "./novel-bookmark/index.min.js";

initialize();

const parentElement = document.getElementsByTagName("main")[0];

if (document.readyState !== "loading") {
  createList({
    ...BOOKMARK_LIST_PROPS,
    className: BOOKMARK_LIST_CLASS,
    parentElement,
  });
} else {
  document.addEventListener("DOMContentLoaded", () => {
    createList({
      ...BOOKMARK_LIST_PROPS,
      className: BOOKMARK_LIST_CLASS,
      parentElement,
    });
  });
}
