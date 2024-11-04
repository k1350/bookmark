import {
  BOOKMARK_BUTTON_CLASS,
  BOOKMARK_BUTTON_PROPS,
  BOOKMARK_LIST_CLASS,
  BOOKMARK_LIST_PROPS,
} from "./constants.js";
import { createButtonAndList, initialize } from "./novel-bookmark/index.min.js";

initialize();

const parentElement = document.getElementsByTagName("main")[0];

if (document.readyState !== "loading") {
  createButtonAndList({
    buttonProps: {
      ...BOOKMARK_BUTTON_PROPS,
      className: BOOKMARK_BUTTON_CLASS,
      parentElement,
    },
    listProps: {
      ...BOOKMARK_LIST_PROPS,
      className: BOOKMARK_LIST_CLASS,
      parentElement,
    },
  });
} else {
  document.addEventListener("DOMContentLoaded", () => {
    createButtonAndList({
      buttonProps: {
        ...BOOKMARK_BUTTON_PROPS,
        className: BOOKMARK_BUTTON_CLASS,
        parentElement,
      },
      listProps: {
        ...BOOKMARK_LIST_PROPS,
        className: BOOKMARK_LIST_CLASS,
        parentElement,
      },
    });
  });
}
