import { observe, scrollToParagraph } from "../index.js";

export function initialize() {
  let disconnect: (() => void) | null = null;

  if (document.readyState !== "loading") {
    disconnect = observe({ wrapperClass: "Novel" });
  } else {
    document.addEventListener("readystatechange", () => {
      if (document.readyState === "interactive") {
        disconnect = observe({ wrapperClass: "Novel" });
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
