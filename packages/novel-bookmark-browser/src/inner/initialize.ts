import { observe, scrollToParagraph } from "novel-bookmark/index.js";
import { CONTAILNER_CLASS } from "../constants";

export function initialize() {
  let disconnect: (() => void) | null = null;

  if (document.readyState !== "loading") {
    disconnect = observe({ wrapperClass: CONTAILNER_CLASS });
  } else {
    document.addEventListener("readystatechange", () => {
      if (document.readyState === "interactive") {
        disconnect = observe({ wrapperClass: CONTAILNER_CLASS });
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
    false,
  );
}
